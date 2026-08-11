import Link from 'next/link';
import Image from 'next/image';
import { articles, type Article } from '@/data/articles';

interface RelatedArticlesProps {
  /** Slug of the article being read — excluded from the picks. */
  currentId: string;
}

const byDateDesc = (a: Article, b: Article) =>
  +new Date(b.date) - +new Date(a.date);

/**
 * "מאמרים נוספים" — three cards under the end-of-article CTA. Prefers guides
 * from the same category, then backfills with the latest of the rest.
 * Card styles live in foreign-investors/styles.css (.related-card, mirroring
 * the hub card idiom) since importing the hub's articles.css here would leak
 * its conflicting .article-content rules onto the article shell.
 */
export default function RelatedArticles({ currentId }: RelatedArticlesProps) {
  const current = articles.find((a) => a.id === currentId);
  const others = articles.filter((a) => a.id !== currentId);
  const sameCategory = others
    .filter((a) => current && a.category === current.category)
    .sort(byDateDesc);
  const rest = others
    .filter((a) => !current || a.category !== current.category)
    .sort(byDateDesc);
  const picks = [...sameCategory, ...rest].slice(0, 3);

  if (picks.length === 0) return null;

  return (
    <section dir="rtl" className="related-articles" aria-label="מאמרים נוספים">
      <h2 className="related-articles-title">מאמרים נוספים</h2>
      <div className="related-grid">
        {picks.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="related-card"
          >
            <div className="related-card-image">
              {/* Decorative — the card title right below names the destination. */}
              <Image
                src={article.image}
                alt=""
                width={600}
                height={315}
                sizes="(max-width: 640px) 100vw, 320px"
              />
            </div>
            <div className="related-card-body">
              <span className="related-card-category">{article.category}</span>
              <h3 className="related-card-title">{article.title}</h3>
              <span className="related-card-meta">{article.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
