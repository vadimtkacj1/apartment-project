#!/usr/bin/env node
/**
 * phash-match.mjs — зіставлення онлайн-фото (Yad2/Madlan/FB) з recovered за
 * перцептивним хешем (dHash). Стійке до перестиснення/ресайзу/вотермарку.
 *
 * Будує dHash усіх recovered/*, тоді для кожного reference-URL рахує dHash і
 * шукає найближчий recovered (Hamming distance). Низька відстань (<=10) = та сама картинка.
 *
 * Запуск: node scripts/phash-match.mjs <url1> <url2> ...
 *   (без аргументів — використає вбудований тестовий список FB/Madlan/Yad2).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const REC = path.join(ROOT, 'recovered');

// dHash 64-біт: resize 9x8 grayscale, порівняти сусідні пікселі по рядку
async function dhash(buf) {
  const w = 9, h = 8;
  const px = await sharp(buf).resize(w, h, { fit: 'fill' }).grayscale().raw().toBuffer();
  const bits = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w - 1; c++) {
      bits.push(px[r * w + c] < px[r * w + c + 1] ? 1 : 0);
    }
  }
  return bits;
}
const ham = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d; };

async function fetchBuf(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

const DEFAULT_REFS = [
  'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1529189235872921',
  'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1513098424148669',
  'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1649111267214050',
  'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1535668478558330',
  'https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1535674881891023',
  'https://img.yad2.co.il/Pic/202606/14/2_5/o/o2_5_1_09349_20260614165250.jpg',
];

const refsFile = path.join(ROOT, 'refs-urls.txt');
const refs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : (fs.existsSync(refsFile)
      ? fs.readFileSync(refsFile, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
      : DEFAULT_REFS);

console.log('Будую dHash усіх recovered...');
const files = fs.readdirSync(REC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const index = [];
for (const f of files) {
  try { index.push({ f, h: await dhash(fs.readFileSync(path.join(REC, f))) }); }
  catch {}
}
console.log(`  проіндексовано: ${index.length}\n`);

for (const url of refs) {
  try {
    const buf = await fetchBuf(url);
    const h = await dhash(buf);
    let best = null;
    for (const it of index) {
      const d = ham(h, it.h);
      if (!best || d < best.d) best = { f: it.f, d };
    }
    const verdict = best.d <= 6 ? '✅ ТА САМА' : best.d <= 12 ? '≈ схоже' : '✗ нема збігу';
    console.log(`${verdict}  (dist=${best.d})  ${best.f}`);
    console.log(`     ← ${url.slice(0, 70)}`);
  } catch (e) {
    console.log(`✗ помилка: ${e.message}  ${url.slice(0, 60)}`);
  }
}
