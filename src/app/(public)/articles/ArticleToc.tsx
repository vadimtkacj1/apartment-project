'use client';

import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  label: string;
}

// Hebrew-safe slug: keep the letters, drop punctuation, hyphenate spaces.
const slugify = (text: string) =>
  text
    .trim()
    .replace(/["'״׳()?!,:;.]/g, '')
    .replace(/\s+/g, '-');

/**
 * "בעמוד הזה" — compact table of contents for article pages. Headings are
 * authored as plain JSX per article (no data source), so this client component
 * assigns id slugs to the body's H2s after mount and links to them.
 * Collapsed <details> on mobile; open list on lg+. Skips anything inside a
 * [data-toc-exclude] wrapper (e.g. mid-article CTA bands).
 */
export default function ArticleToc() {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(
        '.article-body .article-section h2',
      ),
    ).filter((heading) => !heading.closest('[data-toc-exclude]'));

    const seen = new Set<string>();
    const next: TocItem[] = [];
    for (const heading of headings) {
      const label = heading.textContent?.trim() ?? '';
      if (!label) continue;
      const base = slugify(label) || 'section';
      let id = heading.id || base;
      let n = 2;
      while (seen.has(id)) id = `${base}-${n++}`;
      seen.add(id);
      heading.id = id;
      next.push({ id, label });
    }
    setItems(next);
  }, []);

  if (items.length < 2) return null;

  const list = (
    <ul className="article-toc-list">
      {items.map((item) => (
        <li key={item.id}>
          <a href={`#${item.id}`}>{item.label}</a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="article-toc">
      <details className="article-toc-mobile">
        <summary>בעמוד הזה</summary>
        {list}
      </details>
      <nav className="article-toc-desktop" aria-label="בעמוד הזה">
        <p className="article-toc-heading">בעמוד הזה</p>
        {list}
      </nav>
    </div>
  );
}
