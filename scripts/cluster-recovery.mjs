#!/usr/bin/env node
/**
 * cluster-recovery.mjs — групує recovered/ за візуальною схожістю (dHash + single-linkage).
 * Створює montage на кожен кластер у clusters/ і clusters.json (кластер -> файли).
 *
 * Запуск: node scripts/cluster-recovery.mjs [threshold]   (типово 12)
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const REC = path.join(ROOT, 'recovered');
const OUT = path.join(ROOT, 'clusters');
const T = parseInt(process.argv[2] || '12', 10);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

async function dhash(buf) {
  const px = await sharp(buf).resize(9, 8, { fit: 'fill' }).grayscale().raw().toBuffer();
  const bits = [];
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) bits.push(px[r * 9 + c] < px[r * 9 + c + 1] ? 1 : 0);
  return bits;
}
const ham = (a, b) => { let d = 0; for (let i = 0; i < 64; i++) if (a[i] !== b[i]) d++; return d; };

const files = fs.readdirSync(REC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const H = [];
for (const f of files) { try { H.push(await dhash(fs.readFileSync(path.join(REC, f)))); } catch { H.push(null); } }

// union-find single linkage
const par = files.map((_, i) => i);
const find = (x) => (par[x] === x ? x : (par[x] = find(par[x])));
for (let i = 0; i < files.length; i++) {
  if (!H[i]) continue;
  for (let j = i + 1; j < files.length; j++) {
    if (!H[j]) continue;
    if (ham(H[i], H[j]) <= T) par[find(i)] = find(j);
  }
}
const groups = {};
files.forEach((f, i) => { const r = find(i); (groups[r] ||= []).push(f); });
const clusters = Object.values(groups).sort((a, b) => b.length - a.length);

// montages
async function montage(imgs, outFile) {
  const cols = Math.min(6, imgs.length), TW = 200, TH = 150;
  const rows = Math.ceil(imgs.length / cols);
  const comp = [];
  for (let i = 0; i < imgs.length; i++) {
    try {
      const t = await sharp(path.join(REC, imgs[i])).resize(TW, TH, { fit: 'cover' }).jpeg({ quality: 70 }).toBuffer();
      comp.push({ input: t, left: (i % cols) * TW, top: ((i / cols) | 0) * TH });
    } catch {}
  }
  await sharp({ create: { width: cols * TW, height: rows * TH, channels: 3, background: '#0b0d11' } })
    .composite(comp).jpeg({ quality: 72 }).toFile(outFile);
}

const FILES_OUT = path.join(ROOT, 'grouped-similar');
fs.rmSync(FILES_OUT, { recursive: true, force: true });
fs.mkdirSync(FILES_OUT, { recursive: true });
const summary = [];
let gi = 0;
for (let i = 0; i < clusters.length; i++) {
  const c = clusters[i];
  summary.push({ cluster: i, size: c.length, files: c });
  if (c.length >= 2) {
    await montage(c, path.join(OUT, `c${String(i).padStart(3, '0')}_n${c.length}.jpg`));
    // реальні файли у папку групи
    const dir = path.join(FILES_OUT, `group-${String(++gi).padStart(2, '0')}_x${c.length}`);
    fs.mkdirSync(dir, { recursive: true });
    c.forEach((f, k) => fs.copyFileSync(path.join(REC, f), path.join(dir, `${String(k + 1).padStart(2, '0')}_${f}`)));
  }
}
// одиночні — окремо
const singDir = path.join(FILES_OUT, '_поодинокі');
fs.mkdirSync(singDir, { recursive: true });
for (const c of clusters) if (c.length === 1) fs.copyFileSync(path.join(REC, c[0]), path.join(singDir, c[0]));
fs.writeFileSync(path.join(OUT, 'clusters.json'), JSON.stringify(summary, null, 0));

const multi = clusters.filter((c) => c.length >= 2).length;
const singles = clusters.filter((c) => c.length === 1).length;
console.log(`threshold=${T}`);
console.log(`файлів: ${files.length}`);
console.log(`кластерів: ${clusters.length}  (груп ≥2: ${multi}, одиночних: ${singles})`);
console.log(`найбільші: ${clusters.slice(0, 12).map((c) => c.length).join(', ')}`);
console.log(`montage груп ≥2 -> clusters/`);
