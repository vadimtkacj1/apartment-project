import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const REC = path.join(ROOT, 'recovered');
// характерні підбори: [propId, файл, що очікую]
const picks = [
  ['61', 'd2520cf70e6e2cb4b68c8b9cbe2bc46c.jpg', 'mini-penthouse'],
  ['63', 'cc2761f2a4fdda4e7adb701921b867ab.jpg', 'mini-penthouse'],
  ['65', 'd82224ea3e8b9ce34da81bf9aa236f3f.jpg', 'private house yard'],
  ['66', 'd37689595ceca0464826a4e8462f1855.jpg', 'roof apt'],
  ['77', 'aa64dcb7eee972b0921ec224090a0ab2.png', 'duplex penthouse'],
  ['84', 'df3c5653e8467b32a8135797727abab3.jpg', 'roof apt'],
  ['85', 'ad861f9b42e1df3634f5b1df9f70cdc3.jpg', 'private house'],
  ['98', 'a53d378aa3815778faf35bb631850f03.jpg', 'ground floor'],
];
const TW = 300, TH = 220, LBL = 22, COLS = 4;
const rows = Math.ceil(picks.length / COLS);
const comp = [];
for (let i = 0; i < picks.length; i++) {
  const [id, f] = picks[i];
  const x = (i % COLS) * TW, y = ((i / COLS) | 0) * (TH + LBL);
  try {
    const t = await sharp(path.join(REC, f)).resize(TW, TH, { fit: 'cover' }).jpeg({ quality: 78 }).toBuffer();
    comp.push({ input: t, left: x, top: y });
  } catch {}
  const svg = Buffer.from(`<svg width="${TW}" height="${LBL}"><rect width="100%" height="100%" fill="#111"/><text x="5" y="16" font-family="monospace" font-size="14" fill="#7ad17a">#${id} — ${picks[i][2]}</text></svg>`);
  comp.push({ input: svg, left: x, top: y + TH });
}
await sharp({ create: { width: COLS * TW, height: rows * (TH + LBL), channels: 3, background: '#0b0d11' } })
  .composite(comp).jpeg({ quality: 80 }).toFile(path.join(ROOT, 'picks-check.jpg'));
console.log('picks-check.jpg готовий');
