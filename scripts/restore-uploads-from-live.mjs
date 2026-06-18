#!/usr/bin/env node
/**
 * restore-uploads-from-live.mjs
 *
 * Відновлення папки public/uploads з ПРАВИЛЬНИМИ назвами.
 *
 * Контекст: recovery-файли названі як MD5 від ВМІСТУ (<md5>.jpg), тож з назви в БД
 * їх не зіставити автоматично. Тому беремо вміст із надійних джерел, де є правильні
 * назви, у такому порядку пріоритету для кожної назви:
 *   1) файл уже на місці (--out)            -> пропускаємо
 *   2) --from-dir <розпакований бекап>       -> копіюємо (правильна назва + вміст)
 *   3) завантаження з живого сайту (кеш CF)  -> качаємо
 *   4) нема ніде                              -> у "втрачені" (ручне зіставлення з recovery)
 *
 * Список потрібних назв беремо з (пріоритет): --db -> --names -> обхід сайту (CRAWL).
 *
 * Якщо вказати --recovery <dir>, наприкінці скрипт покаже:
 *   • скільки відновлених файлів підтверджені recovery (md5 збігся),
 *   • які recovery-файли НЕ використані (кандидати для ручного добору втрачених).
 *
 * БЕЗПЕЧНО: типово DRY-RUN. --apply, щоб реально писати.
 *
 * Приклади:
 *   # На сервері: розпакувати бекап і відновити з нього + добрати з сайту
 *   node scripts/restore-uploads-from-live.mjs --from-dir /tmp/bk/uploads \
 *        --out /opt/apartment-project/public/uploads --recovery /opt/recovery --apply
 *
 *   # Локально лише з сайту (демо)
 *   node scripts/restore-uploads-from-live.mjs --apply
 *
 * Опції:
 *   --base <url>      базовий URL.            [default: https://ram-haim.co.il]
 *   --out <dir>       куди писати.            [default: ./public/uploads]
 *   --from-dir <dir>  джерело з правильними назвами (розпакований бекап).
 *   --db <file>       взяти список назв із SQLite-БД.
 *   --names <file>    взяти список назв із текстового файлу.
 *   --recovery <dir>  recovery-папка для звірки/звіту про невикористані.
 *   --no-live         не качати з сайту (тільки --from-dir).
 *   --apply           реально писати (без цього — звіт).
 *   --concurrency <n> [default: 6]
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function arg(name, def = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) return true;
  return next;
}

const BASE = String(arg('base', 'https://ram-haim.co.il')).replace(/\/+$/, '');
const OUT_DIR = arg('out', './public/uploads');
const FROM_DIR = arg('from-dir', null);
const DB_PATH = arg('db', null);
const NAMES_FILE = arg('names', null);
const RECOVERY_DIR = arg('recovery', null);
const NO_LIVE = arg('no-live', false) === true;
const APPLY = arg('apply', false) === true;
const CONCURRENCY = Math.max(1, parseInt(arg('concurrency', '6'), 10) || 6);

const md5 = (buf) => crypto.createHash('md5').update(buf).digest('hex');
const UPLOADS_RE = /\/uploads\/[A-Za-z0-9/_.-]+?\.(?:jpe?g|png|webp|gif)/gi;

async function getText(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'restore-uploads/1.0' } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.text();
}

// рекурсивний індекс папки за базовим іменем файлу
function indexByBasename(dir) {
  const idx = new Map();
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full);
      else idx.set(e.name, full);
    }
  };
  if (dir && fs.existsSync(dir)) walk(dir);
  return idx;
}

// ---------- 1. зібрати список /uploads-шляхів ----------
const paths = new Set();
const addPath = (p) => {
  if (!p) return;
  const m = String(p).match(/\/uploads\/[A-Za-z0-9/_.-]+?\.(?:jpe?g|png|webp|gif)/i);
  if (m) paths.add(m[0]);
};

if (DB_PATH) {
  console.log(`🗄️  Назви з БД: ${DB_PATH}`);
  const Database = (await import('better-sqlite3')).default;
  const db = new Database(DB_PATH, { readonly: true });
  for (const row of db.prepare('SELECT images FROM Property').all()) {
    try { JSON.parse(row.images || '[]').forEach(addPath); } catch {}
  }
  for (const t of ['Owner', 'TeamMember']) {
    try { for (const row of db.prepare(`SELECT image FROM ${t}`).all()) addPath(row.image); } catch {}
  }
  db.close();
} else if (NAMES_FILE) {
  console.log(`📄 Назви з файлу: ${NAMES_FILE}`);
  fs.readFileSync(NAMES_FILE, 'utf8').split(/\r?\n/).forEach(addPath);
} else {
  console.log(`🕸️  Обхід сайту: ${BASE}/sitemap.xml`);
  let pages = [];
  try {
    const sm = await getText(`${BASE}/sitemap.xml`);
    pages = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  } catch (e) { console.warn(`   sitemap недоступний (${e.message})`); }
  for (const p of ['/', '/apartments', '/about']) if (!pages.includes(BASE + p)) pages.push(BASE + p);
  console.log(`   Сторінок: ${pages.length}`);
  let done = 0;
  for (const url of pages) {
    try { (await getText(url)).match(UPLOADS_RE)?.forEach(addPath); }
    catch (e) { console.warn(`   ⚠️  ${e.message}`); }
    if (++done % 10 === 0) console.log(`   ...${done}/${pages.length}`);
  }
}

const list = [...paths].sort();
console.log(`\n📦 Унікальних потрібних картинок: ${list.length}`);
if (!list.length) { console.error('❌ Жодного /uploads-посилання.'); process.exit(1); }

// ---------- джерела ----------
const fromIdx = FROM_DIR ? indexByBasename(FROM_DIR) : null;
if (fromIdx) console.log(`📁 Файлів у бекап-папці (--from-dir): ${fromIdx.size}`);

let recIndex = null;
if (RECOVERY_DIR) {
  if (!fs.existsSync(RECOVERY_DIR)) { console.error(`❌ Немає recovery: ${RECOVERY_DIR}`); process.exit(1); }
  recIndex = new Set(
    fs.readdirSync(RECOVERY_DIR)
      .filter((f) => fs.statSync(path.join(RECOVERY_DIR, f)).isFile())
      .map((f) => f.replace(/\.[^.]+$/, '').toLowerCase())
  );
  console.log(`🔁 recovery-файлів: ${recIndex.size}`);
}

// ---------- 2. відновлення ----------
let fromBackup = 0, fromLive = 0, already = 0, lost = 0;
const lostList = [];
const usedRecoveryMd5 = new Set();

async function handle(p) {
  const rel = p.replace(/^\/uploads\//, '');
  const base = path.posix.basename(rel);
  const dest = path.join(OUT_DIR, rel);

  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) { already++; return; }

  let buf = null, src = null;
  // (2) бекап
  if (fromIdx && fromIdx.has(base)) {
    buf = fs.readFileSync(fromIdx.get(base)); src = 'backup';
  }
  // (3) живий сайт
  if (!buf && !NO_LIVE) {
    try {
      const r = await fetch(BASE + p, { headers: { 'User-Agent': 'restore-uploads/1.0' } });
      if (r.ok) {
        const ct = r.headers.get('content-type') || '';
        const b = Buffer.from(await r.arrayBuffer());
        if (b.length > 0 && /^image\//i.test(ct)) { buf = b; src = 'live'; }
      }
    } catch {}
  }

  if (!buf) { lost++; lostList.push(p); return; }

  if (recIndex) { const h = md5(buf); if (recIndex.has(h)) usedRecoveryMd5.add(h); }
  if (APPLY) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, buf); }
  if (src === 'backup') fromBackup++; else fromLive++;
}

let idx = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (idx < list.length) await handle(list[idx++]);
}));

// ---------- 3. звіт ----------
console.log('\n================= РЕЗУЛЬТАТ =================');
console.log(`Потрібно картинок       : ${list.length}`);
console.log(`Вже були на місці       : ${already}`);
console.log(`${APPLY ? 'Відновлено' : 'Готові'} з бекапу : ${fromBackup}`);
console.log(`${APPLY ? 'Відновлено' : 'Готові'} з сайту  : ${fromLive}`);
console.log(`Втрачені (нема джерела) : ${lost}`);

if (recIndex) {
  const unused = [...recIndex].filter((h) => !usedRecoveryMd5.has(h));
  console.log(`\n🔁 recovery: підтверджено ${usedRecoveryMd5.size}, не використано ${unused.length}`);
  console.log(`   (невикористані — кандидати для ручного добору ${lost} втрачених)`);
}

if (lostList.length) {
  console.log(`\n⚠️  Втрачені назви (${lostList.length}) — потрібне ручне зіставлення з recovery:`);
  lostList.slice(0, 40).forEach((p) => console.log('   ' + p));
  if (lostList.length > 40) console.log(`   ... ще ${lostList.length - 40}`);
}

if (!APPLY) console.log('\n🔍 DRY-RUN. Додай --apply, щоб писати.');
else console.log(`\n✅ Готово -> ${OUT_DIR}`);
