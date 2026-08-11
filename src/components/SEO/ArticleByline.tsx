import { getArticle, getArticleAuthor } from '@/data/articles';

// Visible byline + "updated" date for article pages. The date is a freshness cue
// for readers and AI engines; the author is a human E-E-A-T signal linking to the
// /about page. Pure-data component (no server-only APIs) so it is safe to render
// inside the 'use client' article Content components.
export default function ArticleByline({ id }: { id: string }) {
  const article = getArticle(id);
  if (!article) return null;
  const author = getArticleAuthor(id);
  const updated = new Date(article.date).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <p className="article-byline">
      מאת <a href="/about">{author.name}</a>, {author.jobTitle} (רישיון {author.license}) · Aiterra
      <span className="article-byline-sep"> · </span>
      <time dateTime={article.date}>עודכן: {updated}</time>
    </p>
  );
}
