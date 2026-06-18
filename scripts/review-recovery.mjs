#!/usr/bin/env node
/**
 * review-recovery.mjs — швидка галерея для перегляду й видалення зайвих recovery-фото.
 *
 * Гортаєш великим переглядом (лайтбокс) або по сітці; тиснеш «Видалити» на сміттєвих
 * (лого, скріншоти, дублі, чужі) — файл їде в recovered_trash/ (НЕ стирається, можна повернути).
 * Так лишаються тільки реальні фото квартир.
 *
 * Клавіші у великому перегляді:  D / Delete = у кошик,  →/Пробіл = лишити й далі,  ← = назад,  Esc = закрити.
 *
 * Запуск:  node scripts/review-recovery.mjs   → відкрий http://localhost:5056
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const REC = path.join(ROOT, 'recovered');
const TRASH = path.join(ROOT, 'recovered_trash');
const PORT = 5056;
fs.mkdirSync(TRASH, { recursive: true });

const isImg = (f) => /\.(jpe?g|png|webp|gif)$/i.test(f);
const list = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter(isImg).sort() : []);
const send = (res, code, type, body) => { res.writeHead(code, { 'Content-Type': type }); res.end(body); };
const readBody = (req) => new Promise((r) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => r(b)); });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/') return send(res, 200, 'text/html; charset=utf-8', HTML);

  if (url.pathname === '/api/list')
    return send(res, 200, 'application/json', JSON.stringify({ files: list(REC), trash: list(TRASH).length }));

  if (url.pathname.startsWith('/img/')) {
    const f = path.basename(decodeURIComponent(url.pathname.slice(5)));
    for (const base of [REC, TRASH]) {
      const fp = path.join(base, f);
      if (fs.existsSync(fp)) {
        const ext = path.extname(fp).slice(1).toLowerCase();
        res.writeHead(200, { 'Content-Type': `image/${ext === 'jpg' ? 'jpeg' : ext}`, 'Cache-Control': 'max-age=3600' });
        return fs.createReadStream(fp).pipe(res);
      }
    }
    return send(res, 404, 'text/plain', 'no');
  }

  if (url.pathname === '/api/trash' && req.method === 'POST') {
    const { file } = JSON.parse(await readBody(req));
    const f = path.basename(file);
    try { fs.renameSync(path.join(REC, f), path.join(TRASH, f)); return send(res, 200, 'application/json', '{"ok":true}'); }
    catch (e) { return send(res, 400, 'application/json', JSON.stringify({ ok: false, error: String(e) })); }
  }

  if (url.pathname === '/api/untrash' && req.method === 'POST') {
    const { file } = JSON.parse(await readBody(req));
    const f = path.basename(file);
    try { fs.renameSync(path.join(TRASH, f), path.join(REC, f)); return send(res, 200, 'application/json', '{"ok":true}'); }
    catch (e) { return send(res, 400, 'application/json', JSON.stringify({ ok: false, error: String(e) })); }
  }

  send(res, 404, 'text/plain', 'not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  Галерея перегляду:  http://localhost:${PORT}`);
  console.log(`  Фото в recovered: ${list(REC).length}, у кошику: ${list(TRASH).length}`);
  console.log(`  Видалені їдуть у recovered_trash/ (можна повернути). Ctrl+C — стоп.\n`);
});

const HTML = `<!doctype html><html lang="uk"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Recovery — чистка</title>
<style>
 *{box-sizing:border-box} body{margin:0;font:14px system-ui,Segoe UI,sans-serif;background:#0f1115;color:#e6e6e6}
 header{position:sticky;top:0;z-index:5;background:#171a21;border-bottom:1px solid #2a2f3a;padding:10px 16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
 header b{font-size:16px} .muted{color:#9aa4b2} .ok{color:#7ad17a}
 a.undo{color:#ffcf6b;cursor:pointer;text-decoration:underline}
 .hint{color:#9aa4b2;font-size:12px}
 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;padding:12px}
 .card{position:relative;border:1px solid #2a2f3a;border-radius:8px;overflow:hidden;background:#11141a;cursor:pointer}
 .card img{width:100%;height:150px;object-fit:cover;display:block}
 .card .del{position:absolute;top:4px;right:4px;background:#c0392b;color:#fff;border:0;border-radius:6px;padding:3px 7px;font-size:12px;cursor:pointer;opacity:.85}
 .card .del:hover{opacity:1}
 /* lightbox */
 #lb{display:none;position:fixed;inset:0;z-index:20;background:#000d;flex-direction:column;align-items:center;justify-content:center}
 #lb img{max-width:92vw;max-height:80vh;object-fit:contain;border-radius:8px}
 #lb .bar{margin-top:12px;display:flex;gap:10px;align-items:center}
 #lb button{border:0;border-radius:8px;padding:10px 16px;font-size:15px;cursor:pointer}
 .bdel{background:#c0392b;color:#fff} .bkeep{background:#2d6cdf;color:#fff} .bclose{background:#2a2f3a;color:#fff}
 #lb .cnt{color:#9aa4b2;margin:0 8px}
</style></head><body>
<header>
 <b>Чистка recovery</b>
 <span class="muted">Залишилось: <b id="left">0</b></span>
 <span class="muted">У кошику: <b id="trash">0</b> <a class="undo" id="undo">повернути останнє</a></span>
 <span class="hint">Клік по фото → великий перегляд. Клавіші: D=видалити, →=лишити, ←=назад, Esc=закрити.</span>
</header>
<div class="grid" id="grid"></div>

<div id="lb">
 <img id="lbimg" src="">
 <div class="bar">
   <button class="bclose" onclick="closeLb()">✕ Закрити (Esc)</button>
   <button class="bkeep" onclick="step(1)">← Лишити →</button>
   <span class="cnt" id="lbcnt"></span>
   <button class="bdel" onclick="delCur()">🗑 Видалити (D)</button>
 </div>
</div>

<script>
let files=[], i=0, lastTrashed=null;
const $=s=>document.querySelector(s);
async function load(){
  const d=await (await fetch('/api/list')).json();
  files=d.files; $('#left').textContent=files.length; $('#trash').textContent=d.trash;
  const g=$('#grid'); g.innerHTML='';
  files.forEach((f,idx)=>{
    const c=document.createElement('div');c.className='card';
    c.innerHTML='<img loading="lazy" src="/img/'+f+'"><button class="del">🗑</button>';
    c.querySelector('img').onclick=()=>openLb(idx);
    c.querySelector('.del').onclick=(e)=>{e.stopPropagation();trash(f);};
    g.appendChild(c);
  });
}
async function trash(f){
  const r=await (await fetch('/api/trash',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({file:f})})).json();
  if(r.ok){lastTrashed=f;await load();}
}
$('#undo').onclick=async()=>{
  if(!lastTrashed)return;
  await fetch('/api/untrash',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({file:lastTrashed})});
  lastTrashed=null;await load();
};
// lightbox
function openLb(idx){i=idx;showLb();$('#lb').style.display='flex';}
function showLb(){ if(!files.length){closeLb();return;} if(i>=files.length)i=files.length-1; if(i<0)i=0;
  $('#lbimg').src='/img/'+files[i]; $('#lbcnt').textContent=(i+1)+' / '+files.length; }
function closeLb(){$('#lb').style.display='none';}
function step(d){i+=d; if(i>=files.length){closeLb();return;} if(i<0)i=0; showLb();}
async function delCur(){
  const f=files[i];
  const r=await (await fetch('/api/trash',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({file:f})})).json();
  if(r.ok){ lastTrashed=f; files.splice(i,1); $('#left').textContent=files.length;
    $('#trash').textContent=+$('#trash').textContent+1; showLb(); /* фон оновимо при закритті */ }
}
document.addEventListener('keydown',e=>{
  if($('#lb').style.display!=='flex')return;
  if(e.key==='d'||e.key==='D'||e.key==='Delete'){delCur();e.preventDefault();}
  else if(e.key==='ArrowRight'||e.key===' '){step(1);e.preventDefault();}
  else if(e.key==='ArrowLeft'){step(-1);e.preventDefault();}
  else if(e.key==='Escape'){closeLb();load();}
});
$('#lb').addEventListener('click',e=>{if(e.target.id==='lb')closeLb();});
load();
</script></body></html>`;
