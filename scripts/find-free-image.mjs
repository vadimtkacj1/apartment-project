#!/usr/bin/env node
/**
 * find-free-image.mjs — знаходить license-safe (безкоштовні) фото, ПЕРЕВІРЯЄ що
 * зображення справді вільне, і завантажує його з записом джерела/ліцензії.
 *
 * Навіщо: копірайтний лист (LuxuryLiving.jpg / Shai Epstein, 30k₪) дав правило —
 * тільки license-safe картинки (Unsplash / Pexels / Pixabay / CC0-Openverse або in-house AI).
 * Цей інструмент його примушує: показує фото ЛИШЕ з безкоштовних API, ВІДМОВЛЯЄТЬСЯ
 * зберігати файл із вбудованими rights-метаданими, і логує source+license кожного download.
 *
 * Команди:
 *   search  "<запит>" [--n 8] [--orientation landscape|portrait|squarish] [--source unsplash,pexels]
 *   download <index|url> <destPath> [--w 1600] [--h 840] [--credits public/image-credits.json]
 *   verify  <файл-або-url>
 *
 * Ключі (безкоштовні тарифи) з env або .env.local: UNSPLASH_ACCESS_KEY, PEXELS_API_KEY,
 * PIXABAY_API_KEY, (опц.) OPENVERSE_TOKEN, SERPAPI_KEY. Openverse працює БЕЗ ключа.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const ROOT = process.cwd();
const CACHE = path.join(os.tmpdir(), 'free-images-last-search.json');

// ─────────────────────────────────────────────────────────────────────────────
// env: підвантажуємо лише потрібні ключі з .env.local / .env (без залежностей)
// ─────────────────────────────────────────────────────────────────────────────
function loadEnv() {
  const keys = ['UNSPLASH_ACCESS_KEY', 'PEXELS_API_KEY', 'PIXABAY_API_KEY', 'OPENVERSE_TOKEN', 'SERPAPI_KEY'];
  for (const file of ['.env.local', '.env']) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
      if (m && keys.includes(m[1]) && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

// ─────────────────────────────────────────────────────────────────────────────
// знання про джерела: що безпечно, що НЕ безпечно
// ─────────────────────────────────────────────────────────────────────────────
// Хости, чию ліцензію ми контролюємо (походить із безкоштовного API) → авто-SAFE.
const FREE_HOSTS = [
  'images.unsplash.com', 'unsplash.com',
  'images.pexels.com', 'pexels.com', 'www.pexels.com',
  'pixabay.com', 'cdn.pixabay.com',
];
// Платні стокові банки → авто-RISKY (саме такі URL/назви й спричинили позов).
const PAID_STOCK = /shutterstock|gettyimages|getty\s*images|istockphoto|istock|stock\.adobe|adobe\s*stock|dreamstime|123rf|\balamy\b|depositphotos|bigstock|fotolia|agefotostock|\bstocklib\b/i;
// Патерни назв файлів стокових comp/watermark-прев'ю.
const STOCK_FILENAME = /(^|[^0-9])360_F_\d{6,}_|dreamstime|shutterstock|istock|gettyimages|-articleLarge|depositphotos|123rf|alamy|_XL\.jpe?g$/i;
// Маркери вбудованих прав/кредитів у метаданих (XMP/IPTC/EXIF).
const RIGHTS_MARKERS = [
  /dc:rights/i, /xmpRights:/i, /<photoshop:(Credit|Source|AuthorsPosition)/i, /Iptc4xmpCore/i,
  /plus:(Licensor|CopyrightOwner)/i, PAID_STOCK,
];

// ─────────────────────────────────────────────────────────────────────────────
// утиліти
// ─────────────────────────────────────────────────────────────────────────────
const die = (msg) => { console.error('✗ ' + msg); process.exit(1); };
const num = (v) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : 0; };

function parseFlags(argv) {
  const flags = {}, pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) flags[a.slice(2)] = true;
      else { flags[a.slice(2)] = next; i++; }
    } else pos.push(a);
  }
  return { flags, pos };
}

async function fetchBytes(url) {
  const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'ram-haim-free-image-tool' } });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

function detectType(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  const head = buf.slice(0, 12).toString('latin1');
  if (head.startsWith('RIFF') && head.slice(8, 12) === 'WEBP') return 'webp';
  if (head.startsWith('GIF8')) return 'gif';
  if (head.slice(4, 8) === 'ftyp') return 'avif/heic';
  return null;
}

function hostOf(url) { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } }
function hostSource(url) {
  const h = hostOf(url);
  if (h.includes('unsplash')) return 'unsplash';
  if (h.includes('pexels')) return 'pexels';
  if (h.includes('pixabay')) return 'pixabay';
  if (h.includes('openverse')) return 'openverse';
  return h || 'unknown';
}

/**
 * Шукає вбудовані rights/credit метадані. Через sharp читаємо ЛИШЕ блоки xmp/iptc/exif
 * (не icc — щоб не ловити «Copyright ... Hewlett-Packard» зі стандартного sRGB-профілю).
 * Без sharp — падаємо у сирий latin1-скан лише за сильними маркерами.
 */
async function scanRights(buf) {
  const hits = new Set();
  try {
    const sharp = (await import('sharp')).default;
    const m = await sharp(buf).metadata();
    for (const blk of ['xmp', 'iptc', 'exif']) {
      const b = m[blk];
      if (!b || !b.length) continue;
      const s = Buffer.isBuffer(b) ? b.toString('latin1') : String(b);
      for (const re of RIGHTS_MARKERS) if (re.test(s)) hits.add(re.source);
      if (/Copyright|©/i.test(s)) hits.add('Copyright');
      if (/\bArtist\b|by-line|\bCredit\b/i.test(s)) hits.add('Artist/Credit');
    }
    return { hits: [...hits], via: 'sharp', meta: { format: m.format, width: m.width, height: m.height } };
  } catch {
    const s = buf.toString('latin1');
    for (const re of RIGHTS_MARKERS) if (re.test(s)) hits.add(re.source);
    return { hits: [...hits], via: 'raw', meta: null };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// провайдери пошуку → нормалізований запис
// { source,id,width,height,license,requiresAttribution,author,authorUrl,pageUrl,downloadUrl,attribution,thumb,downloadLocation }
// ─────────────────────────────────────────────────────────────────────────────
async function searchUnsplash(q, n, orientation) {
  const u = new URL('https://api.unsplash.com/search/photos');
  u.searchParams.set('query', q); u.searchParams.set('per_page', String(n));
  if (orientation) u.searchParams.set('orientation', orientation); // landscape|portrait|squarish
  const r = await fetch(u, { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`, 'Accept-Version': 'v1' } });
  if (!r.ok) throw new Error(`unsplash HTTP ${r.status}`);
  const j = await r.json();
  return (j.results || []).map((p) => ({
    source: 'unsplash', id: p.id, width: p.width, height: p.height,
    license: 'Unsplash License', requiresAttribution: false,
    author: p.user?.name || '', authorUrl: p.user?.links?.html || '',
    pageUrl: p.links?.html || '', downloadLocation: p.links?.download_location || '',
    downloadUrl: `${p.urls?.raw}${p.urls?.raw?.includes('?') ? '&' : '?'}fm=jpg&q=85&w=2000&fit=max`,
    attribution: `Photo by ${p.user?.name || 'Unknown'} on Unsplash`, thumb: p.urls?.thumb || '',
  }));
}

async function searchPexels(q, n, orientation) {
  const u = new URL('https://api.pexels.com/v1/search');
  u.searchParams.set('query', q); u.searchParams.set('per_page', String(n));
  if (orientation) u.searchParams.set('orientation', orientation === 'squarish' ? 'square' : orientation);
  const r = await fetch(u, { headers: { Authorization: process.env.PEXELS_API_KEY } });
  if (!r.ok) throw new Error(`pexels HTTP ${r.status}`);
  const j = await r.json();
  return (j.photos || []).map((p) => ({
    source: 'pexels', id: String(p.id), width: p.width, height: p.height,
    license: 'Pexels License', requiresAttribution: false,
    author: p.photographer || '', authorUrl: p.photographer_url || '',
    pageUrl: p.url || '', downloadUrl: p.src?.large2x || p.src?.original || '',
    attribution: `Photo by ${p.photographer || 'Unknown'} on Pexels`, thumb: p.src?.tiny || '',
  }));
}

async function searchPixabay(q, n, orientation) {
  const u = new URL('https://pixabay.com/api/');
  u.searchParams.set('key', process.env.PIXABAY_API_KEY);
  u.searchParams.set('q', q); u.searchParams.set('image_type', 'photo');
  u.searchParams.set('per_page', String(Math.max(3, n))); u.searchParams.set('safesearch', 'true');
  if (orientation === 'landscape') u.searchParams.set('orientation', 'horizontal');
  if (orientation === 'portrait') u.searchParams.set('orientation', 'vertical');
  const r = await fetch(u);
  if (!r.ok) throw new Error(`pixabay HTTP ${r.status}`);
  const j = await r.json();
  return (j.hits || []).slice(0, n).map((p) => ({
    source: 'pixabay', id: String(p.id), width: p.imageWidth, height: p.imageHeight,
    license: 'Pixabay Content License', requiresAttribution: false,
    author: p.user || '', authorUrl: `https://pixabay.com/users/${p.user}-${p.user_id}/`,
    pageUrl: p.pageURL || '', downloadUrl: p.largeImageURL || p.webformatURL || '',
    attribution: `Image by ${p.user || 'Unknown'} on Pixabay`, thumb: p.previewURL || '',
  }));
}

async function searchOpenverse(q, n, orientation, license) {
  const u = new URL('https://api.openverse.org/v1/images/');
  u.searchParams.set('q', q); u.searchParams.set('page_size', String(n));
  if (license) u.searchParams.set('license', license); // конкретні ліцензії, напр. cc0,pdm (БЕЗ атрибуції)
  else u.searchParams.set('license_type', 'commercial,modification'); // лише комерційно-придатні
  if (orientation === 'landscape') u.searchParams.set('aspect_ratio', 'wide');
  if (orientation === 'portrait') u.searchParams.set('aspect_ratio', 'tall');
  if (orientation === 'squarish') u.searchParams.set('aspect_ratio', 'square');
  const headers = process.env.OPENVERSE_TOKEN ? { Authorization: `Bearer ${process.env.OPENVERSE_TOKEN}` } : {};
  const r = await fetch(u, { headers });
  if (!r.ok) throw new Error(`openverse HTTP ${r.status}`);
  const j = await r.json();
  return (j.results || []).map((p) => {
    const lic = `${String(p.license || '').toUpperCase()}${p.license_version ? ' ' + p.license_version : ''}`.trim();
    const free = ['cc0', 'pdm'].includes(String(p.license || '').toLowerCase());
    return {
      source: 'openverse', id: String(p.id), width: p.width, height: p.height,
      license: lic || 'CC (?)', requiresAttribution: !free,
      author: p.creator || '', authorUrl: p.creator_url || '',
      pageUrl: p.foreign_landing_url || '', downloadUrl: p.url || '',
      attribution: p.attribution || `${p.title || 'Untitled'} by ${p.creator || 'Unknown'} (${lic})`,
      thumb: p.thumbnail || '',
    };
  });
}

function readCache() { try { return JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch { return []; } }

// ─────────────────────────────────────────────────────────────────────────────
// COMMAND: search
// ─────────────────────────────────────────────────────────────────────────────
async function cmdSearch(pos, flags) {
  const q = pos.join(' ').trim();
  if (!q) die('usage: search "<query>" [--n 8] [--orientation landscape] [--source unsplash,pexels]');
  const n = num(flags.n) || 8;
  const orientation = typeof flags.orientation === 'string' ? flags.orientation : null;
  const license = typeof flags.license === 'string' ? flags.license : null; // напр. cc0,pdm → Openverse без атрибуції
  const only = typeof flags.source === 'string' ? flags.source.split(',').map((s) => s.trim()) : null;
  const want = (name) => !only || only.includes(name);

  const jobs = [], disabled = [];
  if (want('unsplash')) (process.env.UNSPLASH_ACCESS_KEY ? jobs.push(['unsplash', searchUnsplash(q, n, orientation)]) : disabled.push('unsplash (no UNSPLASH_ACCESS_KEY)'));
  if (want('pexels')) (process.env.PEXELS_API_KEY ? jobs.push(['pexels', searchPexels(q, n, orientation)]) : disabled.push('pexels (no PEXELS_API_KEY)'));
  if (want('pixabay')) (process.env.PIXABAY_API_KEY ? jobs.push(['pixabay', searchPixabay(q, n, orientation)]) : disabled.push('pixabay (no PIXABAY_API_KEY)'));
  if (want('openverse')) jobs.push(['openverse', searchOpenverse(q, n, orientation, license)]); // без ключа

  const settled = await Promise.allSettled(jobs.map(([, p]) => p));
  let results = [];
  settled.forEach((s, i) => {
    if (s.status === 'fulfilled') results.push(...s.value);
    else disabled.push(`${jobs[i][0]} failed: ${s.reason?.message || s.reason}`);
  });
  results.forEach((r) => (r.query = q));

  // найбезпечніші зверху: спершу ті, що НЕ вимагають атрибуції; в межах — unsplash>pexels>pixabay>openverse
  const rank = (r) => (r.requiresAttribution ? 100 : 0) + ({ unsplash: 0, pexels: 1, pixabay: 2, openverse: 3 }[r.source] ?? 9);
  results.sort((a, b) => rank(a) - rank(b));

  fs.writeFileSync(CACHE, JSON.stringify(results, null, 2));

  if (!results.length) {
    console.log(`Нічого не знайдено для "${q}".`);
    if (disabled.length) console.log('Вимкнені/впали джерела:\n  - ' + disabled.join('\n  - '));
    return;
  }
  console.log(`\nЗнайдено ${results.length} license-safe кандидатів для "${q}" (найбезпечніші зверху):\n`);
  results.forEach((r, i) => {
    const flag = r.requiresAttribution ? '⚠ потрібна атрибуція' : '✓ атрибуція не потрібна';
    console.log(` ${String(i + 1).padStart(2)}. [${r.source}]  ${r.width}×${r.height}  ${r.license.padEnd(22)}  by ${r.author || '—'}  ${flag}`);
    console.log(`      page: ${r.pageUrl}`);
    if (r.requiresAttribution) console.log(`      credit: ${r.attribution}`);
  });
  console.log(`\nЗавантажити:  node scripts/find-free-image.mjs download <№> public/images/<файл>.jpg --w 1600 --h 840`);
  if (disabled.length) console.log(`\nНеактивні джерела (додай ключі в .env.local щоб розширити вибір):\n  - ${disabled.join('\n  - ')}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMAND: download
// ─────────────────────────────────────────────────────────────────────────────
async function cmdDownload(pos, flags) {
  const [ref, dest] = pos;
  if (!ref || !dest) die('usage: download <index|url> <destPath> [--w 1600] [--h 840]');

  let entry;
  if (/^https?:\/\//.test(ref)) {
    entry = {
      source: hostSource(ref), downloadUrl: ref, license: typeof flags.license === 'string' ? flags.license : 'unverified',
      author: typeof flags.author === 'string' ? flags.author : '', pageUrl: typeof flags.page === 'string' ? flags.page : ref,
      requiresAttribution: false, attribution: '', query: '',
    };
    if (!FREE_HOSTS.includes(hostOf(ref)) && !flags.force)
      die(`host "${hostOf(ref)}" НЕ у списку безкоштовних. Перевір спершу:  verify ${ref}  (або --force якщо впевнений).`);
  } else {
    const cache = readCache();
    entry = cache[num(ref) - 1];
    if (!entry) die(`немає збереженого результату #${ref}. Спершу запусти "search".`);
  }

  const raw = await fetchBytes(entry.downloadUrl);
  const type = detectType(raw);
  if (!type) die('завантажені байти — не зображення (abort).');
  const scan = await scanRights(raw);
  if (scan.hits.length)
    die(`ВІДМОВА зберігати: у файлі вбудовані rights/credit метадані [${scan.hits.join(', ')}]. Це НЕ чисте вільне фото.`);

  // ресайз/переенкод (заодно зчищає будь-які метадані — sharp не тягне їх у вихід)
  let out = raw;
  const w = num(flags.w), h = num(flags.h);
  try {
    const sharp = (await import('sharp')).default;
    let img = sharp(raw);
    if (w || h) img = img.resize({ width: w || null, height: h || null, fit: 'cover', position: 'entropy' });
    const ext = path.extname(dest).toLowerCase();
    if (ext === '.png') out = await img.png().toBuffer();
    else if (ext === '.webp') out = await img.webp({ quality: 82 }).toBuffer();
    else out = await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  } catch { /* без sharp — пишемо як є */ }

  const destAbs = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  fs.writeFileSync(destAbs, out);

  // Unsplash API guideline: тригернути download endpoint
  if (entry.downloadLocation && process.env.UNSPLASH_ACCESS_KEY)
    try { await fetch(entry.downloadLocation, { headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` } }); } catch { /* ok */ }

  const creditsPath = typeof flags.credits === 'string' ? flags.credits : 'public/image-credits.json';
  const cp = path.join(ROOT, creditsPath);
  let db = {};
  if (fs.existsSync(cp)) try { db = JSON.parse(fs.readFileSync(cp, 'utf8')); } catch { /* reset */ }
  db[dest.replace(/\\/g, '/')] = {
    source: entry.source, license: entry.license, author: entry.author,
    sourceUrl: entry.pageUrl, downloadUrl: entry.downloadUrl,
    requiresAttribution: !!entry.requiresAttribution, attribution: entry.attribution || '',
    query: entry.query || '', savedAt: new Date().toISOString(),
  };
  fs.mkdirSync(path.dirname(cp), { recursive: true });
  fs.writeFileSync(cp, JSON.stringify(db, null, 2) + '\n');

  console.log(`✅ збережено ${dest} (${(out.length / 1024).toFixed(0)} KB, ${type}) — чисте, без rights-метаданих`);
  console.log(`   джерело: ${entry.source} | ліцензія: ${entry.license}`);
  if (entry.requiresAttribution) console.log(`   ⚠ ПОТРІБНА атрибуція на сторінці: ${entry.attribution}`);
  console.log(`   провенанс записано у ${creditsPath}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMAND: verify
// ─────────────────────────────────────────────────────────────────────────────
async function cmdVerify(pos, flags) {
  const target = pos[0];
  if (!target) die('usage: verify <файл-або-url>');
  const isUrl = /^https?:\/\//.test(target);
  const reasons = { risky: [], safe: [], info: [] };

  // 1) хост — рахуємо ПЕРШИМ, не залежить від байтів (платний сток часто й не даси завантажити)
  if (isUrl) {
    const h = hostOf(target);
    if (PAID_STOCK.test(h)) reasons.risky.push(`хост ${h} — ПЛАТНИЙ стоковий банк`);
    else if (FREE_HOSTS.includes(h)) reasons.safe.push(`хост ${h} — відомий безкоштовний банк`);
    else reasons.info.push(`хост ${h} — невідоме джерело`);
  }
  // 2) назва файлу
  if (STOCK_FILENAME.test(target)) reasons.risky.push('назва файлу схожа на стокове comp/watermark-прев\'ю');

  // 3) байти → тип + вбудовані метадані. Локальний файл нечитабельний = фатально;
  //    URL що не завантажився — не фатально (вердикт усе одно з хоста/назви).
  let buf = null;
  try { buf = isUrl ? await fetchBytes(target) : fs.readFileSync(path.isAbsolute(target) ? target : path.join(ROOT, target)); }
  catch (e) { if (!isUrl) die('не можу прочитати файл: ' + e.message); reasons.info.push(`байти не завантажені (${e.message}) — метадані не перевірені`); }

  if (buf) {
    const type = detectType(buf);
    reasons.info.push(type ? `тип: ${type}` : 'тип: НЕ розпізнано як зображення');
    const scan = await scanRights(buf);
    if (scan.hits.length) reasons.risky.push(`вбудовані rights/credit метадані: ${scan.hits.join(', ')}`);
    else reasons.safe.push('вбудованих rights-метаданих не знайдено');
  }
  // 4) наш провенанс-лог
  const creditsPath = typeof flags.credits === 'string' ? flags.credits : 'public/image-credits.json';
  const cp = path.join(ROOT, creditsPath);
  if (fs.existsSync(cp)) {
    try {
      const db = JSON.parse(fs.readFileSync(cp, 'utf8'));
      const key = target.replace(/\\/g, '/').replace(/^\.?\//, '');
      const rec = db[key] || Object.values(db).find((v) => v.downloadUrl === target);
      if (rec) {
        reasons.safe.push(`є у ${creditsPath}: ${rec.source} / ${rec.license}`);
        if (rec.requiresAttribution) reasons.risky.push(`ліцензія вимагає атрибуції: ${rec.attribution}`);
      }
    } catch { /* ignore */ }
  }

  // 5) реверс-пошук (best-effort через SerpApi, лише для URL + ключ), інакше — ручні лінки
  let reverse = null;
  if (isUrl && process.env.SERPAPI_KEY) {
    try {
      const su = new URL('https://serpapi.com/search.json');
      su.searchParams.set('engine', 'google_reverse_image');
      su.searchParams.set('image_url', target);
      su.searchParams.set('api_key', process.env.SERPAPI_KEY);
      const j = await (await fetch(su)).json();
      const items = j.image_results || j.inline_images || [];
      const stock = items.map((x) => x.link || x.source || '').filter((l) => PAID_STOCK.test(l));
      reverse = stock.length ? `реверс-пошук: знайдено на ПЛАТНИХ стоках (${stock.length}): ${stock.slice(0, 3).join(', ')}` : `реверс-пошук: платних стоків не знайдено (${items.length} результатів)`;
      if (stock.length) reasons.risky.push('реверс-пошук знайшов фото на платних стоках');
    } catch (e) { reverse = 'реверс-пошук (SerpApi) не вдався: ' + e.message; }
  }

  // вердикт
  let verdict, icon;
  if (reasons.risky.length) { verdict = 'RISKY — НЕ використовувати'; icon = '⛔'; }
  else if (reasons.safe.some((s) => /безкоштовний банк|є у /.test(s))) { verdict = 'SAFE'; icon = '✅'; }
  else if (isUrl && FREE_HOSTS.includes(hostOf(target))) { verdict = 'SAFE'; icon = '✅'; }
  else { verdict = 'UNKNOWN — походження не підтверджене'; icon = '❓'; }

  console.log(`\n${icon} VERDICT: ${verdict}`);
  if (reasons.risky.length) console.log('  причини ризику:\n' + reasons.risky.map((r) => '   ⛔ ' + r).join('\n'));
  if (reasons.safe.length) console.log('  за безпеку:\n' + reasons.safe.map((r) => '   ✓ ' + r).join('\n'));
  console.log('  інфо:\n' + reasons.info.map((r) => '   · ' + r).join('\n'));
  if (reverse) console.log('  ' + reverse);

  if (verdict.startsWith('UNKNOWN') || verdict.startsWith('RISKY')) {
    console.log('\n  Ручна реверс-перевірка (~10с кожна):');
    if (isUrl) {
      const e = encodeURIComponent(target);
      console.log(`   · Google Lens: https://lens.google.com/uploadbyurl?url=${e}`);
      console.log(`   · TinEye:      https://tineye.com/search?url=${e}`);
      console.log(`   · Yandex:      https://yandex.com/images/search?rpt=imageview&url=${e}`);
    } else {
      console.log('   · завантаж файл у Google Lens / TinEye / Yandex Images (локальний файл не має публічного URL)');
    }
    console.log('  Порада: якщо походження неясне — краще перезалити з безкоштовного API:  search "<опис фото>"');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
function help() {
  console.log(`find-free-image — license-safe пошук/перевірка/завантаження зображень

  node scripts/find-free-image.mjs search  "<query>" [--n 8] [--orientation landscape|portrait|squarish] [--source unsplash,pexels,pixabay,openverse]
  node scripts/find-free-image.mjs download <index|url> <destPath> [--w 1600] [--h 840] [--credits public/image-credits.json] [--force]
  node scripts/find-free-image.mjs verify   <file-or-url>

Ключі у .env.local (усі — безкоштовні тарифи; Openverse без ключа):
  UNSPLASH_ACCESS_KEY  https://unsplash.com/oauth/applications
  PEXELS_API_KEY       https://www.pexels.com/api/
  PIXABAY_API_KEY      https://pixabay.com/api/docs/
  OPENVERSE_TOKEN      (опц.) https://api.openverse.org/v1/auth_tokens/register/
  SERPAPI_KEY          (опц., для авто-реверс-пошуку) https://serpapi.com/`);
}

const [cmd, ...rest] = process.argv.slice(2);
const { flags, pos } = parseFlags(rest);
const run = { search: cmdSearch, download: cmdDownload, verify: cmdVerify }[cmd];
if (!run) { help(); process.exit(cmd ? 1 : 0); }
run(pos, flags).catch((e) => die(e.message));
