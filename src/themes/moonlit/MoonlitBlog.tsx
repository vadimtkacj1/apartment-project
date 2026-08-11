import React from 'react';

import { articles } from '@/data/articles';
import { extractBody, loadTemplatePage } from './template-html';

/**
 * Articles — the template's `blog.html` itself: the post list, the sidebar
 * (search, categories, latest posts, tags) and the hero all keep their markup,
 * filled with the site's real articles.
 */

const HERO = '/images/moonlit/park.jpg';

export default async function MoonlitBlog() {
  const $ = await loadTemplatePage('blog.html');

  $('.page__hero__bg').attr('style', `background-image: url(${HERO});`);
  $('.page__hero__content h1').text('מאמרים ומדריכים');
  $('.page__hero__content p').text('כל מה שכדאי לדעת לפני שקונים, מוכרים או משכירים דירה');

  /* ── post list ────────────────────────────────────────────────────────── */
  const list = $('.blog__list__item').first();
  list.html(
    articles
      .map(
        (a) => `
        <div class="single__blog">
          <div class="single__blog__thumb">
            <a href="/articles/${a.id}"><img src="${a.image}" height="490" width="760" alt="${a.title}"></a>
          </div>
          <div class="single__blog__meta">
            <a href="/articles" class="category">${a.category}</a>
            <a href="/articles/${a.id}" class="h5">${a.title}</a>
            <p>${a.description.slice(0, 220)}${a.description.length > 220 ? '…' : ''}</p>
            <div class="single__blog__meta__main">
              <div class="author__meta">
                <span><img src="/moonlit/images/icon/clock.svg" alt=""> ${a.readTime}</span>
              </div>
              <div class="readmore"><a href="/articles/${a.id}">קריאה</a></div>
            </div>
          </div>
        </div>`
      )
      .join('')
  );

  /* ── sidebar: search, categories, latest posts, tags ──────────────────── */
  $('.search__form').first().attr('id', 'moonlit-article-search');
  $('.search__form input').attr('placeholder', 'חיפוש במאמרים').attr('name', 'q');

  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const categoryList = $('.search__item__list').first();
  categoryList.html(
    categories
      .map((c) => {
        const count = articles.filter((a) => a.category === c).length;
        return `<li class="d-flex align-items-center justify-content-between list"><a href="/articles">${c}</a><span>${count}</span></li>`;
      })
      .join('')
  );

  const latest = $('.single__post');
  latest.each((i, el) => {
    const a = articles[i];
    if (!a) {
      $(el).remove();
      return;
    }
    const post = $(el);
    post.find('a').attr('href', `/articles/${a.id}`);
    post.find('.single__post__thumb img').attr('src', a.image).attr('alt', a.title);
    post.find('.single__post__meta a').text(a.title);
    // The template's item carries its own "10 Min Read" span — replace whichever
    // one holds it so no English leftovers survive.
    post.find('.single__post__meta span').each((_, sp) => {
      const el = $(sp);
      if (/read/i.test(el.text())) el.text(a.readTime);
    });
    post.find('.single__post__meta .font-sm').first().text(a.readTime);
  });

  const tags = Array.from(new Set(articles.flatMap((a) => a.tags))).slice(0, 10);
  $('.tag__list')
    .first()
    .html(tags.map((t) => `<li><a href="/articles">${t}</a></li>`).join(''));

  // Sidebar headings
  $('.blog__sidebar__section h6').each((i, el) => {
    const labels = ['חיפוש', 'קטגוריות', 'מאמרים אחרונים', 'תגיות'];
    if (labels[i]) $(el).text(labels[i]);
  });

  return <div dangerouslySetInnerHTML={{ __html: extractBody($) }} />;
}
