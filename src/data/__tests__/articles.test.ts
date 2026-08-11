import { describe, it, expect } from 'vitest';
import {
  articles,
  getArticle,
  getArticleAuthor,
  ARTICLE_AUTHORS,
  ARTICLE_AUTHOR_BY_SLUG,
} from '@/data/articles';

describe('articles catalog integrity', () => {
  it('has at least one article', () => {
    expect(articles.length).toBeGreaterThan(0);
  });

  it('has unique ids', () => {
    const ids = articles.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every article has required, well-formed fields', () => {
    for (const a of articles) {
      expect(a.id).toMatch(/^[a-z0-9-]+$/);
      expect(a.title.trim().length).toBeGreaterThan(0);
      expect(a.description.trim().length).toBeGreaterThan(0);
      expect(a.image.startsWith('/')).toBe(true);
      // date is ISO yyyy-mm-dd and a real calendar date
      expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(a.date))).toBe(false);
      expect(Array.isArray(a.tags)).toBe(true);
      expect(a.tags.length).toBeGreaterThan(0);
    }
  });
});

describe('getArticle', () => {
  it('returns the matching article by id', () => {
    const found = getArticle('mortgage-guide');
    expect(found).toBeDefined();
    expect(found?.id).toBe('mortgage-guide');
  });

  it('returns undefined for an unknown id', () => {
    expect(getArticle('does-not-exist')).toBeUndefined();
  });
});

describe('article authorship', () => {
  it('ARTICLE_AUTHORS has the two known principals with license numbers', () => {
    expect(ARTICLE_AUTHORS.daniel.name).toBe('דניאל שרון');
    expect(ARTICLE_AUTHORS.yoav.name).toBe('יואב אלמוג');
    expect(ARTICLE_AUTHORS.daniel.license).toMatch(/^\d+$/);
    expect(ARTICLE_AUTHORS.yoav.license).toMatch(/^\d+$/);
    // personId links to the canonical Person @id on /about.
    expect(ARTICLE_AUTHORS.daniel.personId).toBe('owner-1');
    expect(ARTICLE_AUTHORS.yoav.personId).toBe('owner-2');
  });

  it('every article id has an author mapping', () => {
    for (const a of articles) {
      expect(ARTICLE_AUTHOR_BY_SLUG[a.id]).toBeDefined();
    }
  });

  it('author mappings reference only known principals', () => {
    for (const key of Object.values(ARTICLE_AUTHOR_BY_SLUG)) {
      expect(['daniel', 'yoav']).toContain(key);
    }
  });

  it('getArticleAuthor returns the mapped principal', () => {
    expect(getArticleAuthor('mortgage-guide')).toBe(ARTICLE_AUTHORS.yoav);
    expect(getArticleAuthor('home-staging')).toBe(ARTICLE_AUTHORS.daniel);
  });

  it('getArticleAuthor defaults to yoav for an unmapped slug', () => {
    expect(getArticleAuthor('unknown-slug')).toBe(ARTICLE_AUTHORS.yoav);
  });
});
