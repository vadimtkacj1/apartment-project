#!/usr/bin/env node
/**
 * group-by-property.mjs — будує каркас групування фото по квартирах із маніфесту.
 *
 * Для кожної квартири з all-photo-names.txt створює папку:
 *   grouped/<id> - <адреса>/
 * і кладе туди:
 *   _ПОТРІБНО.txt  — скільки фото треба + список правильних назв (по порядку);
 *   уже відомі фото (ті, що є в restored/properties або public/uploads/properties).
 *
 * Агент докидає у кожну папку фото цієї квартири → далі скрипт-заливка перейменує й завантажить.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const MANIFEST = path.join(ROOT, 'all-photo-names.txt');
const OUT = path.join(ROOT, 'grouped');
const KNOWN_DIRS = [path.join(ROOT, 'restored', 'properties'), path.join(ROOT, 'public', 'uploads', 'properties')];

// безпечна назва папки (прибрати символи, заборонені у Windows)
const safe = (s) => s.replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();

// де лежить уже відома картинка з правильною назвою
function findKnown(name) {
  for (const d of KNOWN_DIRS) {
    const p = path.join(d, name);
    if (fs.existsSync(p) && fs.statSync(p).size > 0) return p;
  }
  return null;
}

// описи об'єктів (якщо є)
const descMap = {};
const descFile = path.join(ROOT, 'property-descriptions.txt');
if (fs.existsSync(descFile)) {
  for (const block of fs.readFileSync(descFile, 'utf8').split(/\n\n+/)) {
    const m = block.match(/^#(\d+):\s*([\s\S]*)/);
    if (m) descMap[m[1]] = m[2].trim();
  }
}

// парс маніфесту
const props = [];
let cur = null;
for (const raw of fs.readFileSync(MANIFEST, 'utf8').split(/\r?\n/)) {
  const line = raw.trim();
  const h = line.match(/^===\s*#(\d+)\s+(.+?)\s*\((\d+)\)\s*===/);
  if (h) { cur = { id: h[1], title: h[2], count: +h[3], names: [] }; props.push(cur); continue; }
  const n = line.match(/^(\d{13}-[A-Za-z0-9]+\.(?:jpe?g|png|webp|gif))$/i);
  if (n && cur) cur.names.push(n[1]);
}

fs.mkdirSync(OUT, { recursive: true });
let placed = 0, totalSlots = 0;
for (const p of props) {
  const dir = path.join(OUT, safe(`${p.id} - ${p.title}`));
  fs.mkdirSync(dir, { recursive: true });

  // список потрібного
  const lines = [
    `Квартира #${p.id}: ${p.title}`,
    `Потрібно фото: ${p.names.length}`,
    descMap[p.id] ? `\nОпис об'єкта:\n${descMap[p.id]}\n` : ``,
    `Поклади сюди ${p.names.length} фото цієї квартири (у порядку показу).`,
    `Правильні назви (проставлю автоматично — від тебе лише самі фото):`,
    ...p.names.map((n, i) => `  ${i + 1}. ${n}`),
  ];
  fs.writeFileSync(path.join(dir, '_ПОТРІБНО.txt'), lines.join('\n'), 'utf8');

  // покласти вже відомі фото
  let local = 0;
  for (let i = 0; i < p.names.length; i++) {
    const src = findKnown(p.names[i]);
    if (src) { fs.copyFileSync(src, path.join(dir, `${String(i + 1).padStart(2, '0')}_${p.names[i]}`)); placed++; local++; }
  }
  totalSlots += p.names.length;
  console.log(`#${p.id} ${p.title}  —  ${p.names.length} слотів, вже є ${local}`);
}

console.log(`\nКаркас готовий: ${path.relative(ROOT, OUT)}/`);
console.log(`Квартир: ${props.length}, слотів усього: ${totalSlots}, вже покладено відомих: ${placed}`);
console.log(`Решту фото докидає агент у відповідні папки.`);
