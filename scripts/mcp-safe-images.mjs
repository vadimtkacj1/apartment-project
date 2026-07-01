#!/usr/bin/env node
/**
 * mcp-safe-images.mjs — MCP (stdio) сервер для КОПІРАЙТ-БЕЗПЕЧНИХ зображень через OpenRouter.
 *
 * Мета: авторські права НІКОЛИ не повертаються. Тому сервер уміє лише безпечні дії:
 *   • generate_image  — чиста AI-генерація з тексту (нуль чужих прав)
 *   • edit_free_image — AI-правка, але ГАРДРЕЙЛ редагує ЛИШЕ перевірено-вільну основу
 *                       (verify SAFE); платний сток / невідоме походження → відмова
 *   • find_free_image — пошук вільних фото (Openverse CC0/PDM без ключа, + Unsplash/Pexels)
 *   • verify_image    — перевірка чи зображення справді вільне (SAFE/UNKNOWN/RISKY)
 *
 * Ключ береться з env OPENROUTER_API_KEY (передається у конфізі MCP) або з .env.local.
 * Немає стороннього коду — лише виклики наших скриптів scripts/*.mjs (де живе гардрейл).
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url))); // репозиторій
const FIND = path.join(ROOT, 'scripts', 'find-free-image.mjs');
const AII = path.join(ROOT, 'scripts', 'ai-image.mjs');

function runNode(argv) {
  const r = spawnSync(process.execPath, argv, {
    cwd: ROOT, encoding: 'utf8', env: process.env, maxBuffer: 64 * 1024 * 1024,
  });
  const out = ((r.stdout || '') + (r.stderr ? '\n' + r.stderr : '')).trim();
  return { ok: r.status === 0, out: out || '(no output)' };
}

const TOOLS = [
  {
    name: 'find_free_image',
    description: 'Search LICENSE-SAFE (free) stock images. Openverse CC0/PDM works with no key; Unsplash/Pexels/Pixabay if keys are in .env.local. Returns a ranked, indexed list (no-attribution first). Use this to pick a safe base before edit_free_image.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search terms (English works best).' },
        count: { type: 'number', description: 'Number of results (default 8).' },
        orientation: { type: 'string', enum: ['landscape', 'portrait', 'squarish'] },
        license: { type: 'string', description: 'Openverse license filter, e.g. "cc0,pdm" for no-attribution.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'generate_image',
    description: 'Generate a brand-new image from a text prompt via OpenRouter (Nano Banana). 100% AI-created → ZERO third-party copyright, always safe. Saves to <dest> and logs provenance. Tip: add "no text, no watermark, no logo" to the prompt.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string' },
        dest: { type: 'string', description: 'Repo-relative output path, e.g. public/images/articles/x.jpg' },
        width: { type: 'number', description: 'default 1200' },
        height: { type: 'number', description: 'default 630' },
        model: { type: 'string', description: 'Optional OpenRouter model id.' },
      },
      required: ['prompt', 'dest'],
    },
  },
  {
    name: 'edit_free_image',
    description: 'AI-modify an image via OpenRouter (Nano Banana). IRONCLAD GUARDRAIL: it first runs verify on the base and REFUSES unless the base is license-safe (own/CC0/free-stock/AI). Editing a copyrighted image is a derivative work = infringement, so this tool will not do it. Saves to <dest>, logs provenance.',
    inputSchema: {
      type: 'object',
      properties: {
        base: { type: 'string', description: 'Repo-relative path or URL of a LICENSE-SAFE base image.' },
        prompt: { type: 'string', description: 'Edit instruction. Add "no text, no watermark, no logo".' },
        dest: { type: 'string', description: 'Repo-relative output path.' },
        width: { type: 'number', description: 'default 1200' },
        height: { type: 'number', description: 'default 630' },
        model: { type: 'string' },
      },
      required: ['base', 'prompt', 'dest'],
    },
  },
  {
    name: 'verify_image',
    description: 'Check whether an image (file path or URL) is license-safe. Returns SAFE / UNKNOWN / RISKY with reasons (host, filename, embedded rights metadata, provenance log). Never ship UNKNOWN or RISKY.',
    inputSchema: {
      type: 'object',
      properties: { target: { type: 'string', description: 'File path or URL to check.' } },
      required: ['target'],
    },
  },
];

function callTool(name, args) {
  const a = args || {};
  if (name === 'find_free_image') {
    const argv = [FIND, 'search', String(a.query || '')];
    if (a.count) argv.push('--n', String(a.count));
    if (a.orientation) argv.push('--orientation', String(a.orientation));
    if (a.license) argv.push('--license', String(a.license));
    return runNode(argv);
  }
  if (name === 'verify_image') return runNode([FIND, 'verify', String(a.target || '')]);
  if (name === 'generate_image') {
    const argv = [AII, 'generate', String(a.prompt || ''), String(a.dest || ''),
      '--w', String(a.width || 1200), '--h', String(a.height || 630)];
    if (a.model) argv.push('--model', String(a.model));
    return runNode(argv);
  }
  if (name === 'edit_free_image') {
    // NB: no --force is ever passed → guardrail stays ironclad (refuses non-safe base)
    const argv = [AII, 'edit', String(a.base || ''), String(a.prompt || ''), String(a.dest || ''),
      '--w', String(a.width || 1200), '--h', String(a.height || 630)];
    if (a.model) argv.push('--model', String(a.model));
    return runNode(argv);
  }
  return { ok: false, out: 'unknown tool: ' + name };
}

// ─── stdio JSON-RPC 2.0 (newline-delimited) ───
const SERVER_INFO = { name: 'safe-images', version: '1.0.0' };
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
const reply = (id, result) => send({ jsonrpc: '2.0', id, result });
const replyErr = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

function handle(msg) {
  const { id, method, params } = msg;
  if (method === 'initialize') {
    const pv = params && params.protocolVersion ? params.protocolVersion : '2024-11-05';
    return reply(id, { protocolVersion: pv, capabilities: { tools: {} }, serverInfo: SERVER_INFO });
  }
  if (method === 'ping') return reply(id, {});
  if (method === 'tools/list') return reply(id, { tools: TOOLS });
  if (method === 'tools/call') {
    const r = callTool(params && params.name, params && params.arguments);
    return reply(id, { content: [{ type: 'text', text: r.out }], isError: !r.ok });
  }
  if (method && method.startsWith('notifications/')) return; // no response to notifications
  if (id !== undefined) return replyErr(id, -32601, 'Method not found: ' + method);
}

let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buf += chunk;
  let nl;
  while ((nl = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    try { handle(msg); } catch (e) { if (msg && msg.id !== undefined) replyErr(msg.id, -32603, String((e && e.message) || e)); }
  }
});
process.stdin.on('end', () => process.exit(0));
process.stderr.write('safe-images MCP server ready\n');
