import React from 'react';

import { prisma } from '@/lib/prisma';
import { extractBody, loadTemplatePage } from './template-html';
import { getMoonlitContent } from './content.server';

/**
 * About — the template's `about.html` itself: the intro block, the facility
 * band, the team grid and the testimonial all keep their markup, filled with
 * the agency's own copy, its owners and the theme's admin-managed content.
 */

const HERO = '/images/moonlit/building.jpg';

export default async function MoonlitAbout() {
  const [content, owners, team] = await Promise.all([
    getMoonlitContent(),
    prisma.owner
      .findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: { name: true, title: true, image: true },
      })
      .catch(() => []),
    prisma.teamMember
      .findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        select: { name: true, role: true, image: true },
      })
      .catch(() => []),
  ]);

  // Owners store their job title as `title`, team members as `role`.
  const people: { name: string; role: string; image: string | null }[] = [
    ...owners.map((o) => ({ name: o.name, role: o.title ?? '', image: o.image })),
    ...team.map((t) => ({ name: t.name, role: t.role ?? '', image: t.image })),
  ];

  const $ = await loadTemplatePage('about.html');

  /* ── hero ─────────────────────────────────────────────────────────────── */
  $('.page__hero__bg').attr('style', `background-image: url(${HERO});`);
  $('.page__hero__content h1').text('אודות Aiterra');
  $('.page__hero__content p').text('משרד תיווך בוטיק בחולון, בת ים והמרכז');

  /* ── intro block ──────────────────────────────────────────────────────── */
  $('.about__content h2').first().text('ברוכים הבאים ל־Aiterra נדל״ן');
  $('.about__content p').first().text(content.aboutText);
  $('.about__images img').first().attr('src', content.aboutImageMain).attr('alt', '');
  $('.about__images img').eq(1).attr('src', content.aboutImageInset).attr('alt', '');

  /* ── facility band → our advantages ───────────────────────────────────── */
  $('.facility__area .content__title, .facility__area .section__title').first().text('למה לבחור בנו');
  const facilityCards = $('.facility__area .card, .facility__area .single__facility, .facility__area .rts__card');
  facilityCards.each((i, el) => {
    const f = content.facilities[i];
    if (!f) {
      $(el).closest('[class*="col-"]').remove();
      return;
    }
    const card = $(el);
    card.find('img').first().attr('src', f.icon).attr('alt', '');
    card.find('.card-title, h6, .h6').first().text(f.title);
    card.find('.card-text, p').first().text(f.text);
  });

  /* ── team grid → owners + agents ──────────────────────────────────────── */
  const members = $('.team__member');
  const memberCol = members.first().closest('[class*="col-"]');
  const grid = memberCol.parent();

  if (people.length === 0) {
    members.closest('.rts__section').remove();
  } else {
    const colClass = memberCol.attr('class') ?? 'col-lg-4 col-md-6';
    grid.html(
      people
        .map(
          (p) => `<div class="${colClass}">
            <div class="team__member">
              <div class="team__member__thumb">
                <img src="${p.image || '/images/about/team-placeholder.jpg'}" alt="${p.name}">
              </div>
              <div class="team__member__meta">
                <span class="h5 d-block">${p.name}</span>
                <span>${p.role}</span>
              </div>
            </div>
          </div>`
        )
        .join('')
    );
    $('.section__title')
      .filter((_, el) => ($(el).text() || '').includes('Team'))
      .text('הצוות שלנו');
  }

  /* ── testimonial ──────────────────────────────────────────────────────── */
  const quote = content.testimonials[0];
  if (quote) {
    $('.slider__text').first().text(quote.text);
    $('.slider__author__info__content h6').first().text(quote.author);
    $('.slider__author__info__content span').first().text(quote.context);
    $('.author__icon img, .slider__author__info__image img').attr('src', quote.avatar);
  }
  $('.testimonial .swiper-slide').slice(1).remove();
  $('.content__title')
    .filter((_, el) => ($(el).text() || '').includes('Client'))
    .text('מה הלקוחות שלנו אומרים');

  return <div dangerouslySetInnerHTML={{ __html: extractBody($) }} />;
}
