#!/usr/bin/env node
/**
 * ai-image.mjs — генерація / правка зображень через OpenRouter (Nano Banana).
 *
 * КОПІРАЙТ-ПРАВИЛО: «трохи змінити чуже фото» — це НЕ захист (derivative work = порушення).
 * Безпеку дає ДЖЕРЕЛО, а не правка. Тому `edit` СПОЧАТКУ проганяє основу через
 * `find-free-image.mjs verify` і ВІДМОВЛЯЄТЬСЯ редагувати, якщо вона RISKY (платний сток тощо).
 * Правити можна лише license-safe основу: Unsplash/Pexels/Pixabay, CC0/PDM, або in-house AI.
 *
 * Команди:
 *   generate "<prompt>" <destPath> [--model ...] [--w 1600] [--h 900]
 *   edit <baseFileOrUrl> "<prompt>" <destPath> [--model ...] [--w] [--h] [--force]
 *
 * Ключ: OPENROUTER_API_KEY (env або .env.local). Модель за замовч.: google/gemini-2.5-flash-image (~$0.04).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OR_URL = 'https://openrouter.ai/api/v1/chat/completions';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*(OPENROUTER_API_KEY|OPENROUTER_MODEL)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

// Обчислюємо ПІСЛЯ loadEnv(), інакше OPENROUTER_MODEL з .env.local не підхопиться.
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash-image';

const die = (m) => { console.error('✗ ' + m); process.exit(1); };
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

// Прогнати основу через verify з find-free-image.mjs. Повертає {verdict, out}.
function verifyBase(target) {
  try {
    const out = execFileSync('node', ['scripts/find-free-image.mjs', 'verify', target], { cwd: ROOT, encoding: 'utf8' });
    const verdict = /VERDICT:\s*RISKY/.test(out) ? 'RISKY' : /VERDICT:\s*SAFE/.test(out) ? 'SAFE' : 'UNKNOWN';
    return { verdict, out };
  } catch (e) {
    return { verdict: 'UNKNOWN', out: (e.stdout || '') + (e.stderr || e.message || '') };
  }
}

async function callModel(model, content) {
  const key = process.env.OPENROUTER_API_KEY || die('немає OPENROUTER_API_KEY (додай у .env.local).');
  const r = await fetch(OR_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'X-Title': 'ram-haim-ai-image' },
    body: JSON.stringify({ model, messages: [{ role: 'user', content }], modalities: ['image', 'text'] }),
  });
  const j = await r.json();
  if (j.error) die(`OpenRouter: ${j.error.message || JSON.stringify(j.error)}`);
  const msg = j.choices?.[0]?.message;
  const img = (msg?.images || [])[0]?.image_url?.url;
  if (!img) die('модель не повернула зображення. Відповідь: ' + JSON.stringify(msg || j).slice(0, 300));
  return { buf: Buffer.from(img.split(',')[1], 'base64'), cost: j.usage?.cost, usedModel: j.model || model, note: msg?.content || '' };
}

async function saveClean(rawBuf, dest, w, h) {
  let out = rawBuf;
  try {
    const sharp = (await import('sharp')).default;
    let img = sharp(rawBuf);
    if (w || h) img = img.resize({ width: w || null, height: h || null, fit: 'cover', position: 'entropy' });
    const ext = path.extname(dest).toLowerCase();
    if (ext === '.png') out = await img.png().toBuffer();
    else if (ext === '.webp') out = await img.webp({ quality: 82 }).toBuffer();
    else out = await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer(); // stripмає метадані
  } catch { /* без sharp — як є */ }
  const abs = path.join(ROOT, dest);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, out);
  return out.length;
}

function logProvenance(dest, rec, creditsPath) {
  const cp = path.join(ROOT, creditsPath);
  let db = {};
  if (fs.existsSync(cp)) try { db = JSON.parse(fs.readFileSync(cp, 'utf8')); } catch { /* reset */ }
  db[dest.replace(/\\/g, '/')] = { ...rec, savedAt: new Date().toISOString() };
  fs.mkdirSync(path.dirname(cp), { recursive: true });
  fs.writeFileSync(cp, JSON.stringify(db, null, 2) + '\n');
}

async function cmdGenerate(pos, flags) {
  const [prompt, dest] = pos;
  if (!prompt || !dest) die('usage: generate "<prompt>" <destPath> [--w 1600] [--h 900]');
  const model = typeof flags.model === 'string' ? flags.model : DEFAULT_MODEL;
  const { buf, cost, usedModel } = await callModel(model, prompt);
  const bytes = await saveClean(buf, dest, num(flags.w), num(flags.h));
  logProvenance(dest, {
    source: 'ai:openrouter', model: usedModel, license: 'AI-generated (no third-party rights)',
    requiresAttribution: false, attribution: '', basedOn: null, prompt,
  }, typeof flags.credits === 'string' ? flags.credits : 'public/image-credits.json');
  console.log(`✅ згенеровано ${dest} (${(bytes / 1024).toFixed(0)} KB) | ${usedModel} | вартість:$${cost ?? '?'}`);
  console.log('   ліцензія: AI-generated — вільне від чужих прав. Провенанс записано.');
}

async function cmdEdit(pos, flags) {
  const [base, prompt, dest] = pos;
  if (!base || !prompt || !dest) die('usage: edit <baseFileOrUrl> "<prompt>" <destPath> [--w] [--h] [--force]');

  // ── ГАРДРЕЙЛ: основа мусить бути license-safe ──
  const { verdict, out } = verifyBase(base);
  if (verdict === 'RISKY')
    die(`ОСНОВА RISKY — редагувати НЕ можна (правка чужого фото = порушення).\n${out}\nВізьми вільне фото: npm run images:find "<опис>"`);
  if (verdict === 'UNKNOWN' && !flags.force) {
    console.error('⚠ Основа UNKNOWN — походження не підтверджене. Редагування чужого фото не робить його вільним.');
    console.error('  Якщо це ТВОЯ картинка або з вільного банку — додай --force. Інакше перезалий з вільного API.');
    die('зупинено заради копірайт-безпеки.');
  }
  console.log(`✓ основа license-safe (${verdict}) — редагую.`);

  // зчитати основу (файл або url) → data URL
  let mime = 'image/jpeg', b64;
  if (/^https?:\/\//.test(base)) {
    const rr = await fetch(base); if (!rr.ok) die(`не завантажив основу: HTTP ${rr.status}`);
    const bb = Buffer.from(await rr.arrayBuffer());
    b64 = bb.toString('base64');
    if (base.match(/\.png(\?|$)/i)) mime = 'image/png'; else if (base.match(/\.webp(\?|$)/i)) mime = 'image/webp';
  } else {
    const abs = path.isAbsolute(base) ? base : path.join(ROOT, base);
    b64 = fs.readFileSync(abs).toString('base64');
    const ext = path.extname(abs).toLowerCase();
    if (ext === '.png') mime = 'image/png'; else if (ext === '.webp') mime = 'image/webp';
  }

  const model = typeof flags.model === 'string' ? flags.model : DEFAULT_MODEL;
  const { buf, cost, usedModel } = await callModel(model, [
    { type: 'text', text: prompt },
    { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } },
  ]);
  const bytes = await saveClean(buf, dest, num(flags.w), num(flags.h));

  // якщо основа є в credits — успадкуємо її ліцензію + URL-джерело для повного paper trail
  let baseLicense = 'license-safe (verified)', baseSourceUrl = null, baseDownloadUrl = null;
  try {
    const cp = path.join(ROOT, typeof flags.credits === 'string' ? flags.credits : 'public/image-credits.json');
    if (fs.existsSync(cp)) {
      const db = JSON.parse(fs.readFileSync(cp, 'utf8'));
      const rec = db[base.replace(/\\/g, '/').replace(/^\.?\//, '')];
      if (rec) {
        baseLicense = `${rec.source} / ${rec.license}`;
        baseSourceUrl = rec.sourceUrl || (rec.basedOn && rec.basedOn.sourceUrl) || null;
        baseDownloadUrl = rec.downloadUrl || null;
      }
    }
  } catch { /* ignore */ }

  logProvenance(dest, {
    source: 'ai:openrouter (edit)', model: usedModel,
    license: 'AI-edited from a license-safe base (no third-party rights)',
    requiresAttribution: false, attribution: '',
    basedOn: { file: base, license: baseLicense, sourceUrl: baseSourceUrl, downloadUrl: baseDownloadUrl }, prompt,
  }, typeof flags.credits === 'string' ? flags.credits : 'public/image-credits.json');

  console.log(`✅ відредаговано → ${dest} (${(bytes / 1024).toFixed(0)} KB) | ${usedModel} | вартість:$${cost ?? '?'}`);
  console.log(`   основа: ${base} [${baseLicense}] | результат вільний від чужих прав. Провенанс записано.`);
}

function help() {
  console.log(`ai-image — генерація/правка зображень через OpenRouter (Nano Banana)

  node scripts/ai-image.mjs generate "<prompt>" <destPath> [--model M] [--w 1600] [--h 900]
  node scripts/ai-image.mjs edit <baseFileOrUrl> "<prompt>" <destPath> [--w] [--h] [--force]

Ключ у .env.local: OPENROUTER_API_KEY (модель: OPENROUTER_MODEL, за замовч. google/gemini-2.5-flash-image).
edit редагує ЛИШЕ license-safe основу (перевіряє через find-free-image.mjs verify).`);
}

const [cmd, ...rest] = process.argv.slice(2);
const { flags, pos } = parseFlags(rest);
const run = { generate: cmdGenerate, edit: cmdEdit }[cmd];
if (!run) { help(); process.exit(cmd ? 1 : 0); }
run(pos, flags).catch((e) => die(e.message));
