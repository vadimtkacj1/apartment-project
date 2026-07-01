// Image recovery manifest — records every uploaded image's path, size and
// sha256, plus which Property(ies) reference it (from the DB). Purpose: if the
// uploads are ever lost again, unnamed/recovered files can be re-identified by
// hash (or size) and mapped back to the right property + original filename.
//
// Runs standalone (no Prisma client needed — talks to Postgres via `pg`, and
// gracefully degrades to size+hash only if the DB is unreachable).
//
// Env:
//   DATABASE_URL  postgres connection string (optional; enables property links)
//   UPLOADS_DIR   images root (default: <cwd>/public/uploads)
//   MANIFEST_OUT  output path without extension (default: ./image-manifest)
//                 writes MANIFEST_OUT.json (full) and MANIFEST_OUT.csv (human)
//
// Usage: node scripts/image-manifest.mjs

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads')
const OUT = process.env.MANIFEST_OUT || path.join(process.cwd(), 'image-manifest')
const IMG_RE = /\.(jpe?g|png|webp|gif|avif|svg)$/i

function walk(dir, base = dir) {
  const out = []
  let entries = []
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(full, base))
    else if (IMG_RE.test(e.name)) out.push(full)
  }
  return out
}

function sha256(file) {
  const h = crypto.createHash('sha256')
  h.update(fs.readFileSync(file))
  return h.digest('hex')
}

// Map "/uploads/.../name.jpg" -> [{id,title}] from Property.images JSON.
async function loadPropertyRefs() {
  const url = process.env.DATABASE_URL
  if (!url || !/^postgres/.test(url)) return null
  let Client
  try { ({ Client } = require('pg')) } catch { return null }
  const client = new Client({ connectionString: url })
  const byRef = new Map()
  const add = (ref, entity) => {
    if (typeof ref !== 'string' || !ref) return
    const key = ref.split('/').pop() // basename
    if (!byRef.has(key)) byRef.set(key, [])
    byRef.get(key).push(entity)
  }
  try {
    await client.connect()
    // Property.images is a JSON array of paths.
    const props = await client.query('SELECT id, title, images FROM "Property"')
    for (const r of props.rows) {
      let arr = []
      try { arr = JSON.parse(r.images || '[]') } catch {}
      for (const ref of arr) add(ref, { type: 'property', id: r.id, title: r.title })
    }
    // Owner / TeamMember each store a single image path.
    for (const tbl of ['Owner', 'TeamMember']) {
      try {
        const { rows } = await client.query(`SELECT id, name, image FROM "${tbl}"`)
        for (const r of rows) add(r.image, { type: tbl.toLowerCase(), id: r.id, title: r.name })
      } catch {}
    }
  } catch (e) {
    console.error('WARN: DB unreachable, manifest will omit property links:', e.message)
    try { await client.end() } catch {}
    return null
  }
  await client.end()
  return byRef
}

async function main() {
  const files = walk(UPLOADS_DIR)
  const refs = await loadPropertyRefs()
  const entries = []
  for (const f of files) {
    const st = fs.statSync(f)
    const rel = '/' + path.relative(path.dirname(UPLOADS_DIR), f).split(path.sep).join('/') // e.g. /uploads/properties/x.jpg
    const name = path.basename(f)
    const linked = refs ? (refs.get(name) || []) : []
    entries.push({
      path: rel,
      name,
      bytes: st.size,
      sha256: sha256(f),
      properties: linked,
    })
  }
  entries.sort((a, b) => a.path.localeCompare(b.path))

  const orphans = entries.filter((e) => refs && e.properties.length === 0).length
  const summary = {
    generatedAtEpochMs: null, // stamp externally to keep this deterministic
    uploadsDir: UPLOADS_DIR,
    totalImages: entries.length,
    totalBytes: entries.reduce((s, e) => s + e.bytes, 0),
    dbLinked: refs != null,
    referencedImages: refs ? entries.filter((e) => e.properties.length).length : null,
    orphanImages: refs ? orphans : null,
  }

  fs.writeFileSync(`${OUT}.json`, JSON.stringify({ summary, images: entries }, null, 2))
  const csv = ['path,bytes,sha256,property_ids']
    .concat(entries.map((e) => `${e.path},${e.bytes},${e.sha256},"${e.properties.map((p) => p.id).join(' ')}"`))
    .join('\n')
  fs.writeFileSync(`${OUT}.csv`, csv)

  console.log(
    `image-manifest: ${summary.totalImages} images, ${(summary.totalBytes / 1024 / 1024).toFixed(1)} MB` +
      (refs ? `, ${summary.referencedImages} linked to properties, ${orphans} orphan` : ', (no DB link)') +
      ` -> ${OUT}.json / .csv`
  )
}

main().catch((e) => { console.error('image-manifest failed:', e); process.exit(1) })
