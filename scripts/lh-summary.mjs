// Summarize a local Lighthouse JSON report.
import { readFileSync } from 'fs';
const file = process.argv[2];
const lh = JSON.parse(readFileSync(file, 'utf8'));
const audits = lh.audits;
const fmtMs = (v) => (v == null ? 'n/a' : `${Math.round(v)}ms`);
const fmtKB = (v) => (v == null ? 'n/a' : `${Math.round(v / 1024)} KB`);

console.log(`URL: ${lh.finalDisplayedUrl}`);
console.log(`Performance score: ${Math.round(lh.categories.performance.score * 100)}`);
console.log(`FCP: ${audits['first-contentful-paint']?.displayValue} | LCP: ${audits['largest-contentful-paint']?.displayValue} | CLS: ${audits['cumulative-layout-shift']?.displayValue} | TBT: ${audits['total-blocking-time']?.displayValue} | SI: ${audits['speed-index']?.displayValue} | TTFB: ${fmtMs(audits['server-response-time']?.numericValue)}`);

const lcpItems = audits['largest-contentful-paint-element']?.details?.items || [];
const lcpEl = lcpItems[0]?.items?.[0];
if (lcpEl) console.log(`LCP element: ${(lcpEl.node?.snippet || lcpEl.node?.nodeLabel || '').slice(0, 220).replace(/\n/g, ' ')}`);
const phases = lcpItems[1]?.items;
if (phases) console.log('LCP phases: ' + phases.map(p => `${p.phase}: ${fmtMs(p.timing)}`).join(' | '));

const rs = audits['resource-summary']?.details?.items;
if (rs) { console.log('--- Resources ---'); for (const it of rs) console.log(`${it.label}: ${it.requestCount} req, ${fmtKB(it.transferSize)}`); }

console.log('--- Failing/notable audits ---');
const keys = ['render-blocking-resources','unused-javascript','unused-css-rules','modern-image-formats','uses-responsive-images','offscreen-images','uses-text-compression','uses-long-cache-ttl','mainthread-work-breakdown','bootup-time','third-party-summary','dom-size','font-display','prioritize-lcp-image','lcp-lazy-loaded','layout-shifts','total-byte-weight','legacy-javascript','duplicated-javascript','network-requests'];
for (const key of keys) {
  const a = audits[key];
  if (!a) continue;
  if (key === 'network-requests') continue;
  if (a.score === 1 || (a.score == null && !a.displayValue)) continue;
  console.log(`# ${a.title} [score ${a.score}]: ${a.displayValue || ''}`);
  for (const it of (a.details?.items || []).slice(0, 6)) {
    const u = it.url || it.node?.nodeLabel || it.groupLabel || it.label || '';
    const size = it.wastedBytes ? ` waste ${fmtKB(it.wastedBytes)}` : it.transferSize ? ` ${fmtKB(it.transferSize)}` : it.totalBytes ? ` ${fmtKB(it.totalBytes)}` : '';
    const t = it.wastedMs ? ` ${Math.round(it.wastedMs)}ms` : it.mainThreadTime ? ` main ${Math.round(it.mainThreadTime)}ms` : it.duration ? ` ${Math.round(it.duration)}ms` : '';
    if (u || size || t) console.log(`    - ${String(u).slice(0, 110).replace(/\n/g, ' ')}${size}${t}`);
  }
}

// Layout shift culprits
const ls = audits['layout-shifts']?.details?.items || [];
if (ls.length) {
  console.log('--- Layout shift culprits ---');
  for (const it of ls.slice(0, 6)) {
    console.log(`  score ${it.score?.toFixed?.(4)}: ${(it.node?.nodeLabel || '').slice(0, 100).replace(/\n/g, ' ')}`);
    for (const sub of it.subItems?.items?.slice(0, 3) || []) {
      console.log(`      cause: ${(sub.cause || '')} ${(sub.extra?.nodeLabel || sub.extra?.url || '').toString().slice(0, 90).replace(/\n/g, ' ')}`);
    }
  }
}

// Biggest JS files
const net = audits['network-requests']?.details?.items || [];
const js = net.filter(r => r.resourceType === 'Script').sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0)).slice(0, 10);
if (js.length) {
  console.log('--- Largest scripts ---');
  for (const r of js) console.log(`  ${fmtKB(r.transferSize)}  ${r.url.replace('https://ram-haim.co.il', '').slice(0, 110)}`);
}
