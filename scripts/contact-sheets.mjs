#!/usr/bin/env node
/**
 * contact-sheets.mjs — робить контактні аркуші (монтажі мініатюр) з recovered/,
 * щоб можна було оглянути всі фото компактно. Кожна клітинка підписана глобальним
 * індексом; contact/index.json мапить індекс -> назва файлу.
 *
 * Запуск: node scripts/contact-sheets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const REC = path.join(ROOT, 'recovered');
const OUT = path.join(ROOT, 'contact');
fs.mkdirSync(OUT, { recursive: true });

const COLS = 6, ROWS = 5, PER = COLS * ROWS;     // 30 на аркуш
const TW = 230, TH = 168, LBL = 20;               // розмір клітинки
const CW = TW, CH = TH + LBL;

const files = fs.readdirSync(REC).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort();
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(files, null, 0));

function labelSvg(text) {
  return Buffer.from(
    `<svg width="${TW}" height="${LBL}"><rect width="100%" height="100%" fill="#111"/>` +
    `<text x="5" y="15" font-family="monospace" font-size="14" fill="#7ad17a">${text}</text></svg>`
  );
}

let sheet = 0;
for (let start = 0; start < files.length; start += PER) {
  const batch = files.slice(start, start + PER);
  const W = COLS * CW, H = ROWS * CH;
  const composites = [];
  for (let i = 0; i < batch.length; i++) {
    const gi = start + i;                 // глобальний індекс
    const col = i % COLS, row = (i / COLS) | 0;
    const x = col * CW, y = row * CH;
    try {
      const thumb = await sharp(path.join(REC, batch[i]))
        .resize(TW, TH, { fit: 'cover' }).jpeg({ quality: 70 }).toBuffer();
      composites.push({ input: thumb, left: x, top: y });
    } catch { /* пропускаємо биті */ }
    composites.push({ input: labelSvg(`#${gi}`), left: x, top: y + TH });
  }
  const file = path.join(OUT, `sheet-${String(sheet).padStart(2, '0')}.jpg`);
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0b0d11' } })
    .composite(composites).jpeg({ quality: 72 }).toFile(file);
  console.log(`${path.relative(ROOT, file)}  (#${start}–#${start + batch.length - 1})`);
  sheet++;
}
console.log(`\nГотово: ${sheet} аркушів, ${files.length} фото. Мапа індексів: contact/index.json`);
