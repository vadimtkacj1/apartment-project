// Lossless data copy: SQLite (dev.db) -> PostgreSQL (DATABASE_URL).
//
// - Reads every row from the SQLite file with better-sqlite3 (raw, so it
//   tolerates the old prod schema that is missing newer columns like metaTitle).
// - Writes into Postgres via Prisma, PRESERVING primary-key ids, in FK-safe order.
// - Coerces types using the Prisma DMMF (SQLite stores Boolean as 0/1 and
//   DateTime as ISO strings; Postgres needs real booleans / Date objects).
// - Resets autoincrement sequences to MAX(id) after load.
// - Verifies per-table counts (sqlite == postgres) and exits non-zero on mismatch.
//
// Safe to re-run: it TRUNCATEs the Postgres tables first (dev target only).
// The SQLite file is opened read-only and never modified.
//
// Usage:  node scripts/migrate-sqlite-to-postgres.mjs [path-to-sqlite-db]
//         (defaults to ./dev.db)

import 'dotenv/config'
import { createRequire } from 'node:module'

// Load the native/generated packages via require so the script works
// regardless of whether @prisma/client is built as ESM (7.8+) or CommonJS
// (7.4.x on the server) — named ESM imports break on the CJS build.
const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')
const { PrismaClient, Prisma } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const SQLITE_PATH = process.argv[2] ?? 'dev.db'

const connectionString = process.env.DATABASE_URL
if (!connectionString || !/^postgres(ql)?:\/\//.test(connectionString)) {
  console.error('DATABASE_URL must be a postgresql:// URL. Got:', connectionString)
  process.exit(1)
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter, errorFormat: 'minimal' })
const sqlite = new Database(SQLITE_PATH, { readonly: true, fileMustExist: true })

// FK-safe order: parents before children.
const ORDER = [
  'User',
  'ContactInfo',
  'HomepageSettings',
  'Owner',
  'TeamMember',
  'Property',
  'PropertyView',
  'ClickEvent',
  'Inquiry',
]

const delegateFor = (model) => model[0].toLowerCase() + model.slice(1)

// Build scalar field-type maps from the Prisma schema (source of truth).
const modelMeta = {}
for (const m of Prisma.dmmf.datamodel.models) {
  const scalars = {}
  for (const f of m.fields) {
    if (f.kind === 'scalar' && !f.isList) scalars[f.name] = f.type
  }
  modelMeta[m.name] = { scalars, hasIntId: m.fields.some((f) => f.name === 'id' && f.type === 'Int') }
}

const sqliteTableExists = (name) =>
  !!sqlite
    .prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name = ?")
    .get(name)

function coerce(type, value) {
  if (value === null || value === undefined) return null
  switch (type) {
    case 'Boolean':
      return value === true || value === 1 || value === '1'
    case 'DateTime':
      return value instanceof Date ? value : new Date(value)
    case 'Int':
    case 'BigInt':
      return typeof value === 'number' ? value : Number(value)
    case 'Float':
      return typeof value === 'number' ? value : Number(value)
    default:
      return value // String / Json-as-string passthrough
  }
}

function rowToData(model, row) {
  const { scalars } = modelMeta[model]
  const data = {}
  for (const [col, val] of Object.entries(row)) {
    const type = scalars[col]
    if (!type) continue // column not in current schema -> skip (defensive)
    const c = coerce(type, val)
    if (c !== null) data[col] = c
    // leave nulls out so Prisma applies column defaults where defined
  }
  return data
}

async function chunkedCreateMany(model, rows) {
  const delegate = prisma[delegateFor(model)]
  const BATCH = 500
  let inserted = 0
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH).map((r) => rowToData(model, r))
    const res = await delegate.createMany({ data: batch })
    inserted += res.count
  }
  return inserted
}

async function resetSequence(model) {
  if (!modelMeta[model]?.hasIntId) return
  const table = model // no @@map in this schema; model name == table name
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"${table}"','id'),
       COALESCE((SELECT MAX(id) FROM "${table}"), 1),
       (SELECT COUNT(*) FROM "${table}") > 0)`
  )
}

async function main() {
  console.log(`SQLite source : ${SQLITE_PATH}`)
  console.log(`Postgres target: ${connectionString.replace(/:[^:@/]+@/, ':****@')}\n`)

  const summary = []

  // 1) Truncate target (children first) so re-runs are clean. Dev target only.
  console.log('Truncating Postgres tables (RESTART IDENTITY CASCADE)...')
  const truncatable = [...ORDER].reverse().map((m) => `"${m}"`).join(', ')
  await prisma.$executeRawUnsafe(`TRUNCATE ${truncatable} RESTART IDENTITY CASCADE`)

  // 2) Copy each table in FK-safe order.
  for (const model of ORDER) {
    if (!sqliteTableExists(model)) {
      console.log(`- ${model.padEnd(18)} (no SQLite table) -> skipped`)
      summary.push({ model, sqlite: 0, pg: 0, skipped: true })
      continue
    }
    const rows = sqlite.prepare(`SELECT * FROM "${model}"`).all()
    const inserted = await chunkedCreateMany(model, rows)
    await resetSequence(model)
    const pgCount = await prisma[delegateFor(model)].count()
    const ok = rows.length === pgCount && pgCount === inserted
    console.log(
      `- ${model.padEnd(18)} sqlite=${rows.length}  inserted=${inserted}  pg=${pgCount}  ${ok ? 'OK' : '*** MISMATCH ***'}`
    )
    summary.push({ model, sqlite: rows.length, pg: pgCount, ok })
  }

  // 3) Final verdict.
  const mismatches = summary.filter((s) => !s.skipped && !s.ok)
  console.log('\n=== SUMMARY ===')
  for (const s of summary) {
    console.log(`  ${s.model.padEnd(18)} sqlite=${String(s.sqlite).padStart(5)}  pg=${String(s.pg).padStart(5)}  ${s.skipped ? 'skipped' : s.ok ? 'OK' : 'MISMATCH'}`)
  }
  await prisma.$disconnect()
  sqlite.close()

  if (mismatches.length) {
    console.error(`\nFAILED: ${mismatches.length} table(s) mismatch.`)
    process.exit(2)
  }
  console.log('\nAll tables copied with matching row counts. ✅')
}

main().catch(async (e) => {
  console.error('Migration error:', e)
  try { await prisma.$disconnect() } catch {}
  process.exit(1)
})
