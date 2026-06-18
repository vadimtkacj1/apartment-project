/**
 * seed-one-each.mjs — кладе щонайменше 1 фото-старт у КОЖНУ папку квартири в grouped/.
 * 6 реальних якорів лишаються; характерні підбираю осмислено; решта — DRAFT-обкладинка.
 * Усе в grouped/ (чернетка), на сайт нічого не йде. DRAFT_ = здогад, агент перевірить.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const REC = path.join(ROOT, 'recovered');
const GROUPED = path.join(ROOT, 'grouped');
const files = JSON.parse(fs.readFileSync(path.join(ROOT, 'contact', 'index.json'), 'utf8'));

// характерні підбори: propertyId -> індекс фото (за описом)
const PICK = {
  65: 250,  // בית פרטי — великий приватний двір
  85: 206,  // בית פרטי — сад + пергола
  77: 203,  // פנטהאוז דו-מפלסי — сходи/дуплекс
  66: 246,  // דירת גג — дахова тераса
  84: 258,  // דירת גג נהריה — тераса
  61: 245,  // מיני פנטהאוז — тераса з кріслом-яйцем
  63: 240,  // מיני פנטהאוז — тераса
  98: 195,  // קומת קרקע — відкритий вид/низ
  99: 206 === 206 ? 219 : 219, // פונה לגינה — сад
};

// папки квартир
const dirs = fs.readdirSync(GROUPED).filter((d) => fs.statSync(path.join(GROUPED, d)).isDirectory());
const idOf = (d) => (d.match(/^(\d+)\s*-/) || [])[1];

// що вже зайнято (реальні якорі + підбори)
const used = new Set();
for (const d of dirs) for (const f of fs.readdirSync(path.join(GROUPED, d))) if (!/_ПОТРІБНО/.test(f)) used.add(f.replace(/^\d+_/, '').replace(/^DRAFT_\d+_/, ''));
for (const idx of Object.values(PICK)) used.add(files[idx]);

let seq = 0;
const nextFree = () => { while (seq < files.length && used.has(files[seq])) seq++; const f = files[seq++]; used.add(f); return f; };

let seeded = 0, kept = 0;
for (const d of dirs) {
  const id = idOf(d);
  const dir = path.join(GROUPED, d);
  const has = fs.readdirSync(dir).some((f) => !/_ПОТРІБНО/.test(f));
  if (has) { kept++; continue; }                       // вже є реальний якір
  const file = PICK[id] != null ? files[PICK[id]] : nextFree();
  const tag = PICK[id] != null ? 'DRAFT-характерне' : 'DRAFT-плейсхолдер';
  fs.copyFileSync(path.join(REC, file), path.join(dir, `DRAFT_01_${file}`));
  console.log(`#${id}\t${tag}\t${file}`);
  seeded++;
}
console.log(`\nРеальних якорів збережено: ${kept}`);
console.log(`Додано draft-стартів: ${seeded}`);
console.log(`Тепер у КОЖНІЙ з ${dirs.length} папок є щонайменше 1 фото.`);
