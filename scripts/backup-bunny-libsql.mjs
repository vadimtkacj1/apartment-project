#!/usr/bin/env node
/**
 * Off-host backup of the Bunny libSQL (sqld) database to a portable SQL dump.
 *
 * Bunny's hosted libSQL speaks the sqld/Turso protocol, so we connect with
 * @libsql/client (already a project dependency) using a READ-ONLY token and
 * stream a `.sql` dump: schema (CREATE TABLE/INDEX/TRIGGER/VIEW) + INSERTs.
 * The dump is gzipped with a sha256 sidecar and old dumps are pruned.
 *
 * Why a SQL dump (not an embedded-replica .db file): it is pure-JS, restorable
 * anywhere (`sqlite3 new.db < dump.sql`, or pipe into any libSQL), survives
 * schema/engine changes, and needs no native bindings — so the same script runs
 * on the VPS, in CI, or on a laptop.
 *
 * Run it from the app dir so node can resolve @libsql/client, e.g.:
 *   cd /opt/apartment-project && node scripts/backup-bunny-libsql.mjs
 *
 * Required env (keep these OUT of the repo — a root-only file or CI secret):
 *   BUNNY_LIBSQL_URL    libsql://<id>-<db>.lite.bunnydb.net
 *   BUNNY_LIBSQL_TOKEN  read-only access token
 * Optional env:
 *   BUNNY_BACKUP_DIR    output dir   (default: /var/backups/apartment-project/bunny)
 *   BUNNY_RETENTION_DAYS retention   (default: 30)
 *   BUNNY_BATCH         rows per page (default: 1000)
 *
 * Exit codes: 0 ok · 1 bad config · 2 connect/dump failure.
 */
import { createClient } from '@libsql/client'
import { gzipSync } from 'node:zlib'
import { createHash } from 'node:crypto'
import { writeFileSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { hostname } from 'node:os'

const url = (process.env.BUNNY_LIBSQL_URL || '').trim().replace(/\/+$/, '')
const authToken = (process.env.BUNNY_LIBSQL_TOKEN || '').trim()
const outDir = process.env.BUNNY_BACKUP_DIR || '/var/backups/apartment-project/bunny'
const retentionDays = Number(process.env.BUNNY_RETENTION_DAYS || 30)
const batch = Math.max(1, Number(process.env.BUNNY_BATCH || 1000))

if (!url || !authToken) {
  console.error('❌ BUNNY_LIBSQL_URL and BUNNY_LIBSQL_TOKEN are required.')
  process.exit(1)
}

// SQLite literal for any value libSQL hands back (null/number/bigint/bool/str/blob).
function lit(v) {
  if (v === null || v === undefined) return 'NULL'
  if (typeof v === 'bigint') return v.toString()
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL'
  if (typeof v === 'boolean') return v ? '1' : '0'
  if (v instanceof ArrayBuffer || ArrayBuffer.isView(v)) {
    const bytes = v instanceof ArrayBuffer ? new Uint8Array(v) : new Uint8Array(v.buffer, v.byteOffset, v.byteLength)
    let hex = ''
    for (const b of bytes) hex += b.toString(16).padStart(2, '0')
    return `x'${hex}'`
  }
  return `'${String(v).replace(/'/g, "''")}'`
}

const qid = (name) => `"${String(name).replace(/"/g, '""')}"`
// Lexically-sortable timestamp: YYYYMMDD-HHMMSS (UTC).
function stamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}-${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`
}

async function main() {
  const client = createClient({ url, authToken })

  // Schema objects, excluding SQLite/libSQL internal bookkeeping tables.
  const internal = "name NOT LIKE 'sqlite_%' AND name NOT LIKE 'libsql_%' AND name NOT LIKE '_litestream%'"
  const tablesRes = await client.execute(
    `SELECT name, sql FROM sqlite_master WHERE type='table' AND sql IS NOT NULL AND ${internal} ORDER BY name`
  )
  const idxRes = await client.execute(
    `SELECT name, sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL AND ${internal} ORDER BY name`
  )
  const otherRes = await client.execute(
    `SELECT type, name, sql FROM sqlite_master WHERE type IN ('trigger','view') AND sql IS NOT NULL AND ${internal} ORDER BY type, name`
  )

  const parts = []
  parts.push(`-- Bunny libSQL dump`)
  parts.push(`-- source: ${url}`)
  parts.push(`-- taken:  ${new Date().toISOString()} on ${hostname()}`)
  parts.push(`-- tables: ${tablesRes.rows.length}`)
  parts.push('PRAGMA foreign_keys=OFF;')
  parts.push('BEGIN TRANSACTION;')

  let grandTotal = 0
  const perTable = []

  for (const t of tablesRes.rows) {
    const name = String(t.name)
    parts.push('')
    parts.push(`DROP TABLE IF EXISTS ${qid(name)};`)
    parts.push(`${t.sql};`)

    let offset = 0
    let rows = 0
    for (;;) {
      const page = await client.execute({
        sql: `SELECT * FROM ${qid(name)} LIMIT ? OFFSET ?`,
        args: [batch, offset],
      })
      if (page.rows.length === 0) break
      const cols = page.columns
      const colList = cols.map(qid).join(', ')
      for (const row of page.rows) {
        const vals = cols.map((c) => lit(row[c])).join(', ')
        parts.push(`INSERT INTO ${qid(name)} (${colList}) VALUES (${vals});`)
      }
      rows += page.rows.length
      offset += page.rows.length
      if (page.rows.length < batch) break
    }
    grandTotal += rows
    perTable.push(`${name}=${rows}`)
  }

  // Indexes, then triggers/views, after all data is loaded.
  for (const i of idxRes.rows) parts.push(`${i.sql};`)
  for (const o of otherRes.rows) parts.push(`${o.sql};`)

  parts.push('COMMIT;')
  parts.push('PRAGMA foreign_keys=ON;')
  parts.push('')

  client.close()

  const sql = parts.join('\n')
  const gz = gzipSync(Buffer.from(sql, 'utf8'), { level: 9 })
  const sha = createHash('sha256').update(gz).digest('hex')

  mkdirSync(outDir, { recursive: true })
  const base = `bunny-libsql-${stamp()}.sql.gz`
  const file = join(outDir, base)
  writeFileSync(file, gz)
  writeFileSync(`${file}.sha256`, `${sha}  ${base}\n`)

  // Retention: drop dumps + sidecars older than retentionDays.
  const cutoff = Date.now() - retentionDays * 86400_000
  for (const f of readdirSync(outDir)) {
    if (!/^bunny-libsql-.*\.sql\.gz(\.sha256)?$/.test(f)) continue
    const p = join(outDir, f)
    try { if (statSync(p).mtimeMs < cutoff) unlinkSync(p) } catch {}
  }

  const kb = (gz.length / 1024).toFixed(1)
  console.log(
    `OK ${new Date().toISOString()} -> ${file} (${kb} KB, ${tablesRes.rows.length} tables, ${grandTotal} rows)`
  )
  if (tablesRes.rows.length === 0) {
    console.warn('⚠️  Source DB has 0 tables — dump is valid but EMPTY (Bunny not migrated yet?).')
  } else {
    console.log(`   rows: ${perTable.join(' ')}`)
  }
}

main().catch((e) => {
  console.error('❌ Bunny backup failed:', e?.message || e)
  process.exit(2)
})
