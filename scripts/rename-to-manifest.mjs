/**
 * rename-to-manifest.mjs — збирає всі фото з grouped/ у плоску папку final-names/
 * з ПРАВИЛЬНИМИ назвами з маніфесту (готові до заливки в /uploads/properties/).
 *   • реальні (NN_<назва>) -> їхня правильна назва;
 *   • RANDOM_ -> назви слотів квартири, які вони заповнюють.
 * Також пише mapping.csv: правильна_назва,джерело (real|random).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const GROUPED = path.join(ROOT, 'grouped');
const OUT = path.join(ROOT, 'final-names');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// маніфест: id -> ordered names
const props = [];
let cur = null;
for (const raw of fs.readFileSync(path.join(ROOT, 'all-photo-names.txt'), 'utf8').split(/\r?\n/)) {
  const h = raw.trim().match(/^===\s*#(\d+)\s+(.+?)\s*\((\d+)\)\s*===/);
  if (h) { cur = { id: h[1], names: [] }; props.push(cur); continue; }
  const n = raw.trim().match(/^(\d{13}-[A-Za-z0-9]+\.(?:jpe?g|png|webp|gif))$/i);
  if (n && cur) cur.names.push(n[1]);
}
const dirById = {};
for (const d of fs.readdirSync(GROUPED)) { const m = d.match(/^(\d+)\s*-/); if (m && fs.statSync(path.join(GROUPED, d)).isDirectory()) dirById[m[1]] = path.join(GROUPED, d); }

const map = ['name,source'];
let real = 0, rnd = 0;
for (const p of props) {
  const dir = dirById[p.id];
  if (!dir) continue;
  const files = fs.readdirSync(dir).filter((f) => !/_ПОТРІБНО/.test(f));
  // реальні: NN_<13digit-name>
  const realName = {}; // correctName -> srcPath
  const randomFiles = [];
  for (const f of files) {
    const m = f.match(/^\d+_((\d{13}-[A-Za-z0-9]+)\.[a-z]+)$/i);
    if (m && !/^RANDOM_/.test(f)) realName[m[1]] = path.join(dir, f);
    else if (/^RANDOM_/.test(f)) randomFiles.push(path.join(dir, f));
  }
  const usedReal = new Set(Object.keys(realName));
  // копіюємо реальні під їхніми правильними назвами
  for (const [name, src] of Object.entries(realName)) {
    fs.copyFileSync(src, path.join(OUT, name)); map.push(`${name},real`); real++;
  }
  // решта назв квартири -> заповнюємо random-файлами по порядку
  const remaining = p.names.filter((n) => !usedReal.has(n));
  randomFiles.sort();
  remaining.forEach((name, i) => {
    if (randomFiles[i]) { fs.copyFileSync(randomFiles[i], path.join(OUT, name)); map.push(`${name},random`); rnd++; }
  });
}
fs.writeFileSync(path.join(ROOT, 'mapping.csv'), map.join('\n'), 'utf8');
console.log(`final-names/: ${real} реальних + ${rnd} random = ${real + rnd} файлів з правильними назвами`);
console.log('Карта: mapping.csv (name,source)');
