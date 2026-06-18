#!/usr/bin/env node
/**
 * match-recovery.mjs — локальний інструмент ручного зіставлення recovery-фото.
 *
 * Зліва — квартири з маніфесту (слоти під кожне фото в правильному порядку).
 * Справа — мініатюри всіх recovery-картинок (recovered/<md5>.jpg).
 * Клікаєш слот -> клікаєш фото -> воно стає на місце з ПРАВИЛЬНОЮ назвою.
 * Кнопка "Зберегти" копіює призначені фото у ./restored/properties/<правильна-назва>.
 *
 * Запуск:  node scripts/match-recovery.mjs
 * Відкрий: http://localhost:5055
 *
 * Прогрес автозберігається у браузері (localStorage) + на диск при "Зберегти".
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RECOVERED = path.join(ROOT, 'recovered');
const MANIFEST = path.join(ROOT, 'all-photo-names.txt');
const OUT = path.join(ROOT, 'restored', 'properties');
const ONDISK = path.join(ROOT, 'public', 'uploads', 'properties');
const PORT = 5055;

// ---- описи об'єктів (для контексту агенту) ----
const DESC = {};
const descFile = path.join(ROOT, 'property-descriptions.txt');
if (fs.existsSync(descFile)) {
  for (const block of fs.readFileSync(descFile, 'utf8').split(/\n\n+/)) {
    const m = block.match(/^#(\d+):\s*([\s\S]*)/);
    if (m) DESC[m[1]] = m[2].trim();
  }
}

// ---- парсимо маніфест ----
function parseManifest() {
  const props = [];
  let cur = null;
  for (const raw of fs.readFileSync(MANIFEST, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    const h = line.match(/^===\s*#(\d+)\s+(.+?)\s*\((\d+)\)\s*===/);
    if (h) { cur = { id: h[1], title: h[2], count: +h[3], names: [], desc: DESC[h[1]] || '' }; props.push(cur); continue; }
    const n = line.match(/^(\d{13}-[A-Za-z0-9]+\.(?:jpe?g|png|webp|gif))$/i);
    if (n && cur) cur.names.push(n[1]);
  }
  return props;
}

const recoveredFiles = () =>
  fs.readdirSync(RECOVERED).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f)).sort();

const doneSet = () => {
  const s = new Set();
  for (const dir of [ONDISK, OUT]) {
    if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) s.add(f);
  }
  return [...s];
};

const send = (res, code, type, body) => {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/') return send(res, 200, 'text/html; charset=utf-8', HTML);

  if (url.pathname === '/api/data') {
    return send(res, 200, 'application/json', JSON.stringify({
      properties: parseManifest(),
      recovered: recoveredFiles(),
      done: doneSet(),
    }));
  }

  if (url.pathname.startsWith('/img/')) {
    const file = decodeURIComponent(url.pathname.slice(5));
    const fp = path.join(RECOVERED, path.basename(file));
    if (!fs.existsSync(fp)) return send(res, 404, 'text/plain', 'no');
    const ext = path.extname(fp).slice(1).toLowerCase();
    res.writeHead(200, { 'Content-Type': `image/${ext === 'jpg' ? 'jpeg' : ext}`, 'Cache-Control': 'max-age=3600' });
    return fs.createReadStream(fp).pipe(res);
  }

  if (url.pathname === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const { assignments } = JSON.parse(body); // { correctName: md5file }
        fs.mkdirSync(OUT, { recursive: true });
        let written = 0; const errors = [];
        for (const [name, src] of Object.entries(assignments)) {
          const sp = path.join(RECOVERED, path.basename(src));
          if (!fs.existsSync(sp)) { errors.push(name); continue; }
          fs.copyFileSync(sp, path.join(OUT, path.basename(name)));
          written++;
        }
        send(res, 200, 'application/json', JSON.stringify({ ok: true, written, errors }));
      } catch (e) {
        send(res, 400, 'application/json', JSON.stringify({ ok: false, error: String(e) }));
      }
    });
    return;
  }

  send(res, 404, 'text/plain', 'not found');
});

server.listen(PORT, '127.0.0.1', () => {
  const p = parseManifest();
  const total = p.reduce((s, x) => s + x.names.length, 0);
  console.log(`\n  Зіставлювач запущено:  http://localhost:${PORT}`);
  console.log(`  Квартир: ${p.length}, фото-слотів: ${total}, recovery-картинок: ${recoveredFiles().length}`);
  console.log(`  Збереження -> ${path.relative(ROOT, OUT)}\n  (Ctrl+C щоб зупинити)\n`);
});

const HTML = `<!doctype html><html lang="uk"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Recovery match</title>
<style>
  *{box-sizing:border-box} body{margin:0;font:14px/1.4 system-ui,Segoe UI,sans-serif;background:#0f1115;color:#e6e6e6}
  header{position:sticky;top:0;z-index:10;background:#171a21;border-bottom:1px solid #2a2f3a;padding:10px 16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
  header b{font-size:16px} .prog{color:#7ad17a} button{background:#2d6cdf;color:#fff;border:0;padding:8px 14px;border-radius:7px;cursor:pointer;font-size:14px}
  button.ghost{background:#2a2f3a} button:disabled{opacity:.5;cursor:default}
  .wrap{display:grid;grid-template-columns:420px 1fr;gap:0;height:calc(100vh - 53px)}
  .left{overflow:auto;border-right:1px solid #2a2f3a;padding:10px}
  .right{overflow:auto;padding:10px}
  .prop{border:1px solid #2a2f3a;border-radius:9px;margin-bottom:10px;overflow:hidden}
  .prop h3{margin:0;padding:9px 11px;background:#1c2029;font-size:13px;display:flex;justify-content:space-between;cursor:pointer}
  .prop h3 .c{color:#9aa4b2;font-weight:400}
  .prop .desc{padding:4px 11px 8px;font-size:11px;color:#8893a4;line-height:1.45;border-bottom:1px solid #1c2029}
  .slots{display:flex;flex-wrap:wrap;gap:6px;padding:9px}
  .slot{width:78px;height:78px;border:2px dashed #3a4150;border-radius:7px;display:flex;align-items:center;justify-content:center;position:relative;cursor:pointer;background:#11141a;overflow:hidden;font-size:11px;color:#8893a4}
  .slot.sel{border-color:#2d6cdf;border-style:solid;box-shadow:0 0 0 2px #2d6cdf55}
  .slot.done{border-style:solid;border-color:#3a4150}
  .slot img{width:100%;height:100%;object-fit:cover} .slot .n{position:absolute;top:1px;left:3px;font-size:10px;color:#fff;text-shadow:0 0 3px #000}
  .slot .x{position:absolute;top:0;right:2px;color:#ff6b6b;font-weight:700;display:none} .slot.filled:hover .x{display:block}
  .slot.lock{opacity:.6}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px}
  .card{border:1px solid #2a2f3a;border-radius:8px;overflow:hidden;cursor:pointer;position:relative;background:#11141a}
  .card img{width:100%;height:120px;object-fit:cover;display:block}
  .card.used{outline:3px solid #7ad17a;opacity:.55}
  .card .tag{position:absolute;bottom:0;left:0;right:0;background:#000a;color:#9ad;font-size:10px;padding:2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .toolbar{display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap}
  .hint{color:#9aa4b2;font-size:12px}
  input,select{background:#11141a;color:#e6e6e6;border:1px solid #2a2f3a;border-radius:6px;padding:6px 8px}
</style></head><body>
<header>
  <b>Зіставлення recovery-фото</b>
  <span class="prog" id="prog">0 / 0</span>
  <button id="save">💾 Зберегти на диск</button>
  <button class="ghost" id="clear">Скинути все</button>
  <span class="hint" id="msg"></span>
</header>
<div class="wrap">
  <div class="left" id="left"></div>
  <div class="right">
    <div class="toolbar">
      <span class="hint">Обери слот зліва, тоді клікни фото тут.</span>
      <label class="hint"><input type="checkbox" id="hideUsed"> сховати використані</label>
      <input id="search" placeholder="пошук за назвою…" style="margin-left:auto">
    </div>
    <div class="grid" id="grid"></div>
  </div>
</div>
<script>
let DATA={properties:[],recovered:[],done:[]};
let assign=JSON.parse(localStorage.getItem('rmatch')||'{}'); // {correctName: md5file}
let sel=null; // вибраний слот (correctName)
const used=()=>new Set(Object.values(assign));
const $=s=>document.querySelector(s);

async function load(){
  DATA=await (await fetch('/api/data')).json();
  // блокуємо слоти, що вже є на диску
  DATA.doneSet=new Set(DATA.done);
  render();
}
function totalSlots(){return DATA.properties.reduce((s,p)=>s+p.names.length,0)}
function filledCount(){
  let n=0;for(const p of DATA.properties)for(const nm of p.names){if(assign[nm]||DATA.doneSet.has(nm))n++}return n;
}
function render(){
  // left
  const L=$('#left');L.innerHTML='';
  for(const p of DATA.properties){
    const div=document.createElement('div');div.className='prop';
    const fill=p.names.filter(n=>assign[n]||DATA.doneSet.has(n)).length;
    div.innerHTML='<h3>#'+p.id+' '+esc(p.title)+'<span class="c">'+fill+'/'+p.names.length+'</span></h3>'+
      (p.desc?'<div class="desc" dir="rtl">'+esc(p.desc.slice(0,160))+'</div>':'');
    const slots=document.createElement('div');slots.className='slots';
    for(const nm of p.names){
      const s=document.createElement('div');
      const onDisk=DATA.doneSet.has(nm);
      const md5=assign[nm];
      s.className='slot'+(sel===nm?' sel':'')+(md5?' filled done':'')+(onDisk?' done lock':'');
      s.title=nm;
      if(onDisk){s.innerHTML='<span class="n">✓ диск</span>';}
      else if(md5){s.innerHTML='<img src="/img/'+md5+'"><span class="x">✕</span>';}
      else{s.textContent='+';}
      s.onclick=()=>{
        if(onDisk)return;
        if(md5){delete assign[nm];persist();render();return;} // клік по заповненому — очистити
        sel=(sel===nm?null:nm);render();
      };
      slots.appendChild(s);
    }
    div.appendChild(slots);L.appendChild(div);
  }
  // right grid
  const q=($('#search').value||'').toLowerCase();
  const hide=$('#hideUsed').checked;const U=used();
  const G=$('#grid');G.innerHTML='';
  for(const f of DATA.recovered){
    if(q&&!f.toLowerCase().includes(q))continue;
    const isUsed=U.has(f);if(hide&&isUsed)continue;
    const c=document.createElement('div');c.className='card'+(isUsed?' used':'');
    c.innerHTML='<img loading="lazy" src="/img/'+f+'"><div class="tag">'+f.slice(0,14)+'…</div>';
    c.onclick=()=>{
      if(!sel){flash('Спочатку обери слот зліва');return;}
      assign[sel]=f;
      // авто-перехід до наступного порожнього слота цієї квартири
      const p=DATA.properties.find(p=>p.names.includes(sel));
      const next=p.names.find(n=>n!==sel&&!assign[n]&&!DATA.doneSet.has(n));
      sel=next||null;persist();render();
    };
    G.appendChild(c);
  }
  $('#prog').textContent=filledCount()+' / '+totalSlots();
}
function persist(){localStorage.setItem('rmatch',JSON.stringify(assign))}
function esc(s){return s.replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}
function flash(m){const e=$('#msg');e.textContent=m;setTimeout(()=>e.textContent='',2500)}
$('#search').oninput=render;$('#hideUsed').onchange=render;
$('#clear').onclick=()=>{if(confirm('Скинути всі призначення?')){assign={};persist();sel=null;render();}};
$('#save').onclick=async()=>{
  $('#save').disabled=true;flash('Зберігаю…');
  const r=await (await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({assignments:assign})})).json();
  $('#save').disabled=false;
  flash(r.ok?('Збережено: '+r.written+' файлів у restored/properties'):'Помилка: '+r.error);
  if(r.ok)load();
};
load();
</script></body></html>`;
