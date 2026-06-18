/**
 * match-covers.mjs — вирізає обкладинки квартир зі скріншоту списку (lh-fullpage.jpg)
 * і pHash-зіставляє з recovered, щоб знайти точний файл-обкладинку кожної квартири.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const REC = path.join(ROOT, 'recovered');
const SHOT = path.join(ROOT, 'lh-fullpage.jpg');
const OUT = path.join(ROOT, 'cover-crops');
fs.mkdirSync(OUT, { recursive: true });

// [propId, left, top, width, height] — у координатах оригіналу 412x6990
const BOXES = [
  ['101', 28, 3084, 356, 470],
  ['100', 28, 3680, 356, 470],
  ['99', 28, 4218, 356, 470],
  ['98', 28, 4740, 356, 420],
  ['97', 28, 5330, 356, 470],
  ['96', 28, 5880, 356, 400],
  ['95', 28, 6360, 356, 410],
];

async function dhash(buf) {
  const px = await sharp(buf).resize(9, 8, { fit: 'fill' }).grayscale().raw().toBuffer();
  const b = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) b.push(px[r * 9 + c] < px[r * 9 + c + 1] ? 1 : 0);
  return b;
}
const ham = (a, b) => { let d = 0; for (let i = 0; i < 64; i++) if (a[i] !== b[i]) d++; return d; };

// індекс recovered
const files = fs.readdirSync(REC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const idx = [];
for (const f of files) { try { idx.push({ f, h: await dhash(fs.readFileSync(path.join(REC, f))) }); } catch {} }

for (const [id, L, T, W, H] of BOXES) {
  const cropFile = path.join(OUT, `cover-${id}.jpg`);
  await sharp(SHOT).extract({ left: L, top: T, width: W, height: H }).jpeg({ quality: 85 }).toFile(cropFile);
  const h = await dhash(fs.readFileSync(cropFile));
  let best = null, second = null;
  for (const it of idx) { const d = ham(h, it.h); if (!best || d < best.d) { second = best; best = { f: it.f, d }; } else if (!second || d < second.d) second = { f: it.f, d }; }
  const verdict = best.d <= 10 ? '✅' : best.d <= 14 ? '≈' : '✗';
  console.log(`#${id}  ${verdict} dist=${best.d}  ${best.f}   (2-й: ${second.d})`);
}
console.log('\nКропи обкладинок -> cover-crops/  (звір очима cover-XX.jpg ↔ recovered)');
