// Fetch PageSpeed Insights data for key URLs and print a compact summary.
const urls = process.argv.slice(2);
const strategy = process.env.PSI_STRATEGY || 'mobile';

const fmtMs = (v) => (v == null ? 'n/a' : `${Math.round(v)}ms`);
const fmtS = (v) => (v == null ? 'n/a' : `${(v / 1000).toFixed(2)}s`);
const fmtKB = (v) => (v == null ? 'n/a' : `${Math.round(v / 1024)} KB`);

for (const url of urls) {
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', url);
  api.searchParams.set('strategy', strategy);
  api.searchParams.append('category', 'performance');

  let json;
  try {
    const res = await fetch(api, { signal: AbortSignal.timeout(120000) });
    if (!res.ok) {
      console.log(`\n=== ${url} (${strategy}) ===\nHTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
      continue;
    }
    json = await res.json();
  } catch (e) {
    console.log(`\n=== ${url} (${strategy}) ===\nFETCH ERROR: ${e.message}`);
    continue;
  }

  const lh = json.lighthouseResult;
  const audits = lh?.audits || {};
  const field = json.loadingExperience?.metrics;
  const originField = json.originLoadingExperience?.metrics;

  console.log(`\n=== ${url} (${strategy}) ===`);
  console.log(`Performance score: ${Math.round((lh?.categories?.performance?.score ?? 0) * 100)}`);

  const printField = (label, m) => {
    if (!m) return console.log(`${label}: no CrUX data`);
    const g = (k) => m[k] ? `${m[k].percentile}${k.includes('CLS') ? '' : 'ms'} (${m[k].category})` : 'n/a';
    console.log(`${label}: LCP ${g('LARGEST_CONTENTFUL_PAINT_MS')} | CLS ${m.CUMULATIVE_LAYOUT_SHIFT_SCORE ? (m.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100).toFixed(2) + ' (' + m.CUMULATIVE_LAYOUT_SHIFT_SCORE.category + ')' : 'n/a'} | INP ${g('INTERACTION_TO_NEXT_PAINT')} | FCP ${g('FIRST_CONTENTFUL_PAINT_MS')} | TTFB ${g('EXPERIMENTAL_TIME_TO_FIRST_BYTE')}`);
  };
  printField('Field (this URL)', field);
  printField('Field (origin)  ', originField);

  console.log('--- Lab metrics ---');
  console.log(`FCP: ${audits['first-contentful-paint']?.displayValue} | LCP: ${audits['largest-contentful-paint']?.displayValue} | CLS: ${audits['cumulative-layout-shift']?.displayValue} | TBT: ${audits['total-blocking-time']?.displayValue} | SI: ${audits['speed-index']?.displayValue} | TTFB: ${fmtMs(audits['server-response-time']?.numericValue)}`);

  const lcpEl = audits['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0];
  if (lcpEl) console.log(`LCP element: ${lcpEl.node?.nodeLabel?.slice(0, 120)?.replace(/\n/g, ' ')} | ${lcpEl.node?.snippet?.slice(0, 200)}`);
  const lcpPhases = audits['largest-contentful-paint-element']?.details?.items?.[1]?.items;
  if (lcpPhases) console.log('LCP phases: ' + lcpPhases.map(p => `${p.phase}: ${fmtMs(p.timing)}`).join(' | '));

  const summary = audits['resource-summary']?.details?.items;
  if (summary) {
    console.log('--- Resource summary ---');
    for (const it of summary) console.log(`${it.label}: ${it.requestCount} req, ${fmtKB(it.transferSize)}`);
  }

  console.log('--- Top opportunities/diagnostics ---');
  const interesting = Object.values(audits)
    .filter(a => a.details?.type === 'opportunity' && a.numericValue > 0)
    .sort((a, b) => b.numericValue - a.numericValue)
    .slice(0, 8);
  for (const a of interesting) console.log(`* ${a.title}: ${a.displayValue || fmtMs(a.numericValue)}`);

  for (const key of ['render-blocking-resources', 'unused-javascript', 'unused-css-rules', 'modern-image-formats', 'uses-responsive-images', 'offscreen-images', 'uses-text-compression', 'uses-long-cache-ttl', 'mainthread-work-breakdown', 'bootup-time', 'third-party-summary', 'dom-size', 'font-display', 'prioritize-lcp-image', 'lcp-lazy-loaded', 'layout-shifts', 'total-byte-weight']) {
    const a = audits[key];
    if (!a || a.score === 1 || a.score == null && !a.displayValue) continue;
    console.log(`# ${a.title} [score ${a.score}]: ${a.displayValue || ''}`);
    const items = a.details?.items?.slice(0, 5) || [];
    for (const it of items) {
      const u = it.url || it.node?.nodeLabel || it.groupLabel || '';
      const size = it.wastedBytes ? ` waste ${fmtKB(it.wastedBytes)}` : it.transferSize ? ` ${fmtKB(it.transferSize)}` : '';
      const t = it.wastedMs ? ` ${Math.round(it.wastedMs)}ms` : it.mainThreadTime ? ` main-thread ${Math.round(it.mainThreadTime)}ms` : it.duration ? ` ${Math.round(it.duration)}ms` : '';
      if (u || size || t) console.log(`    - ${String(u).slice(0, 110).replace(/\n/g, ' ')}${size}${t}`);
    }
  }
}
