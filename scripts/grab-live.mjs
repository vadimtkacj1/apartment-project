/**
 * grab-live.mjs — перевіряє всі 247 фото з маніфесту на сайті й завантажує живі (200),
 * розкладаючи по grouped/<квартира>/ + restored/properties/ з ПРАВИЛЬНИМИ назвами.
 * Прибирає DRAFT_ там, де зʼявилось реальне фото. Безпечно перезапускати — добирає нові живі.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const BASE = 'https://ram-haim.co.il/uploads/properties/';
const RESTORED = path.join(ROOT, 'restored', 'properties');
const GROUPED = path.join(ROOT, 'grouped');
fs.mkdirSync(RESTORED, { recursive: true });

// маніфест -> список квартир із назвами
const props = [];
let cur = null;
for (const raw of fs.readFileSync(path.join(ROOT, 'all-photo-names.txt'), 'utf8').split(/\r?\n/)) {
  const h = raw.trim().match(/^===\s*#(\d+)\s+(.+?)\s*\((\d+)\)\s*===/);
  if (h) { cur = { id: h[1], title: h[2].replace(/[\\/:*?"<>|]/g, '').trim(), names: [] }; props.push(cur); continue; }
  const n = raw.trim().match(/^(\d{13}-[A-Za-z0-9]+\.(?:jpe?g|png|webp|gif))$/i);
  if (n && cur) cur.names.push(n[1]);
}

const folderOf = (p) => {
  const exact = path.join(GROUPED, `${p.id} - ${p.title}`);
  if (fs.existsSync(exact)) return exact;
  const hit = fs.readdirSync(GROUPED).find((d) => d.startsWith(p.id + ' -'));
  return hit ? path.join(GROUPED, hit) : exact;
};

async function grab(name) {
  try {
    const r = await fetch(BASE + name);
    if (!r.ok) return null;
    const ct = r.headers.get('content-type') || '';
    if (!/^image\//i.test(ct)) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    return buf.length > 0 ? buf : null;
  } catch { return null; }
}

let totalLive = 0, totalPhotos = 0, fullProps = 0;
const report = [];
for (const p of props) {
  const fdir = folderOf(p);
  fs.mkdirSync(fdir, { recursive: true });
  let live = 0;
  // паралельно по квартирі
  const bufs = await Promise.all(p.names.map(grab));
  let clearedDraft = false;
  for (let i = 0; i < p.names.length; i++) {
    const buf = bufs[i];
    if (!buf) continue;
    if (!clearedDraft) { for (const f of fs.readdirSync(fdir)) if (/^(DRAFT|RANDOM)_/.test(f)) fs.rmSync(path.join(fdir, f)); clearedDraft = true; }
    fs.writeFileSync(path.join(RESTORED, p.names[i]), buf);
    fs.writeFileSync(path.join(fdir, `${String(i + 1).padStart(2, '0')}_${p.names[i]}`), buf);
    live++;
  }
  totalLive += live; totalPhotos += p.names.length;
  if (live === p.names.length) fullProps++;
  if (live > 0) report.push(`#${p.id} ${live === p.names.length ? '✅' : '◐'} ${live}/${p.names.length} ${p.title}`);
}

console.log(report.join('\n'));
console.log(`\n=== ${totalLive}/${totalPhotos} фото живі | повністю закритих квартир: ${fullProps}/${props.length} ===`);
