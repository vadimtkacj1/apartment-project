import { articles } from '@/data/articles';

// Built once at build time (output: standalone). Provides a dated, machine-readable
// stream of guides for feed readers and AI ingestion crawlers. Sourced from the same
// article registry as the /articles grid and the sitemap, so it never drifts.
export const dynamic = 'force-static';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const items = [...articles]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map(
      (a) =>
        `\n  <item><title>${escapeXml(a.title)}</title><link>${siteUrl}/articles/${a.id}</link><guid isPermaLink="true">${siteUrl}/articles/${a.id}</guid><pubDate>${new Date(a.date).toUTCString()}</pubDate><description>${escapeXml(a.description)}</description></item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${escapeXml('רם נכסים חיים ענבי — מאמרים')}</title><link>${siteUrl}/articles</link><description>${escapeXml('מדריכי נדל״ן בחולון, בת ים וראשון לציון')}</description><language>he-IL</language>${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
