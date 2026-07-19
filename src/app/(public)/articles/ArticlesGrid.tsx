'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { articles } from '@/data/articles';

const ALL = 'הכל';

export default function ArticlesGrid() {
  const [active, setActive] = useState<string>(ALL);

  // Distinct categories, in first-seen order, with an "all" option prepended.
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const a of articles) {
      if (a.category && !seen.includes(a.category)) seen.push(a.category);
    }
    return [ALL, ...seen];
  }, []);

  const visible = active === ALL ? articles : articles.filter((a) => a.category === active);

  return (
    <>
      {/* Category filter pills — derived from the distinct article categories */}
      <div className="categories" role="tablist" aria-label="סינון לפי קטגוריה">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={active === category}
            className={`category-btn ${active === category ? 'active' : ''}`}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="articles-grid">
        {visible.map((article, index) => (
          <article key={article.id} className="article-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="card-accent"></div>
            <Link href={`/articles/${article.id}`} className="article-image" aria-label={article.title}>
              <Image
                src={article.image}
                alt={article.title}
                width={1200}
                height={630}
                className="article-image-img"
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 400px"
              />
            </Link>
            <div className="article-content">
              <span className="category-badge">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="badge-icon">
                  <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {article.category}
              </span>
              <div className="article-meta">
                <span className="article-date">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="meta-icon">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {new Date(article.date).toLocaleDateString('he-IL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="separator">•</span>
                <span className="read-time">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="meta-icon">
                    <path d="M2 3h10a1 1 0 011 1v7a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M4 1v2M10 1v2M1 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {article.readTime}
                </span>
              </div>
              <h2 className="article-title">
                <Link href={`/articles/${article.id}`}>
                  {article.title}
                </Link>
              </h2>
              <p className="article-description">
                {article.description}
              </p>
              <div className="article-tags">
                {article.tags.map((tag, i) => (
                  <span key={i} className="tag">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="tag-icon">
                      <path d="M2 2L6 1L10 2L11 6L10 10L6 11L2 10L1 6L2 2Z" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/articles/${article.id}`} className="read-more">
                <span>קרא עוד</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="arrow-icon">
                  <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
