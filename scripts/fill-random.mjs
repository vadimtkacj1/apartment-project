/**
 * fill-random.mjs — заповнює прогалини у папках квартир ВИПАДКОВИМИ recovered-фото,
 * щоб у кожної був повний набір за маніфестом. Реальні (NN_) не чіпає.
 * Випадкові = RANDOM_  (заглушки-плейсхолдери, агент має замінити). Кожне recovered — раз.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const REC = path.join(ROOT, 'recovered');
const GROUPED = path.join(ROOT, 'grouped');

// маніфест: id -> count
const props = [];
let cur = null;
for (const raw of fs.readFileSync(path.join(ROOT, 'all-photo-names.txt'), 'utf8').split(/\r?\n/)) {
  const h = raw.trim().match(/^===\s*#(\d+)\s+(.+?)\s*\((\d+)\)\s*===/);
  if (h) { cur = { id: h[1], count: +h[3] }; props.push(cur); continue; }
}
const dirById = {};
for (const d of fs.readdirSync(GROUPED)) { const m = d.match(/^(\d+)\s*-/); if (m) dirById[m[1]] = path.join(GROUPED, d); }

// пул recovered
const pool = fs.readdirSync(REC).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort();
let pi = 0;
const nextRec = () => (pi < pool.length ? pool[pi++] : null);

let filled = 0, fullNow = 0;
for (const p of props) {
  const dir = dirById[p.id];
  if (!dir) continue;
  // прибрати старі DRAFT_/RANDOM_
  for (const f of fs.readdirSync(dir)) if (/^(DRAFT|RANDOM)_/.test(f)) fs.rmSync(path.join(dir, f));
  const real = fs.readdirSync(dir).filter((f) => /^[0-9]{2}_[0-9]{13}-/.test(f)).length;
  let gap = p.count - real;
  let slot = real;
  while (gap-- > 0) {
    const r = nextRec();
    if (!r) break;
    slot++;
    fs.copyFileSync(path.join(REC, r), path.join(dir, `RANDOM_${String(slot).padStart(2, '0')}_${r}`));
    filled++;
  }
  const total = fs.readdirSync(dir).filter((f) => /^([0-9]{2}_|RANDOM_)/.test(f)).length;
  if (total >= p.count) fullNow++;
}
console.log(`Випадкових заповнено: ${filled}`);
console.log(`Використано recovered: ${pi}/${pool.length}`);
console.log(`Квартир із повним набором: ${fullNow}/${props.length}`);
