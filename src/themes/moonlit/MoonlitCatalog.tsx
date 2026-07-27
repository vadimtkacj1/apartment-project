import React from 'react';

import { prisma } from '@/lib/prisma';
import { ISRAELI_CITIES } from '@/data/cities';
import { firstImage, formatPrice } from './kit';
import SearchFormBinder from './SearchFormBinder';
import { extractBody, loadTemplatePage } from './template-html';
import { getMoonlitContent } from './content.server';

/**
 * Catalogue — the template's `room-two.html` itself, with the room grid fed by
 * real listings, the booking bar turned into the catalogue's filters and the
 * testimonial band carrying the theme's admin-managed quotes.
 */

interface Props {
  dealType?: string;
  city?: string;
  minRooms?: string;
}

const HERO = '/images/moonlit/street.jpg';

export default async function MoonlitCatalog({ dealType, city, minRooms }: Props) {
  const rooms = minRooms ? Number(minRooms) : undefined;

  const [listings, content] = await Promise.all([
    prisma.property
      .findMany({
        where: {
          isActive: true,
          isSold: false,
          ...(dealType === 'sale' || dealType === 'rent' ? { dealType } : {}),
          ...(city ? { city } : {}),
          ...(rooms && Number.isFinite(rooms) ? { rooms: { gte: String(rooms) } } : {}),
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        take: 12,
        select: { id: true, title: true, price: true, rooms: true, area: true, images: true },
      })
      .catch(() => []),
    getMoonlitContent(),
  ]);

  const $ = await loadTemplatePage('room-two.html');

  /* ── page hero ────────────────────────────────────────────────────────── */
  $('.page__hero__bg').attr('style', `background-image: url(${HERO});`);
  $('.page__hero__content h1').text('הנכסים שלנו');
  $('.page__hero__content p').text('כל הדירות למכירה ולהשכרה בחולון, בת ים והמרכז');

  /* ── the booking bar becomes the catalogue's filters ──────────────────── */
  const search = $('.advance__search').first();
  if (search.length) {
    search.attr('id', 'moonlit-search-form').removeAttr('action').removeAttr('method');
    search.find('h5, .h5, h4, .h4').first().text('סינון נכסים');
    const cities = content.searchCities
      .map((v) => ISRAELI_CITIES.find((c) => c.value === v))
      .filter(Boolean) as { value: string; label: string }[];

    const opt = (v: string, l: string, sel: boolean) =>
      `<option value="${v}"${sel ? ' selected' : ''}>${l}</option>`;

    const select = (id: string, label: string, icon: string, options: string) => `
      <div class="query__input">
        <label for="${id}" class="query__label">${label}</label>
        <select name="${id}" id="${id}" class="form-select">${options}</select>
        <div class="query__input__icon"><i class="${icon}"></i></div>
      </div>`;

    search.find('.advance__search__wrapper').first().html(
      select(
        'dealType',
        'סוג עסקה',
        'flaticon-calendar',
        opt('', 'הכול', !dealType) + opt('sale', 'למכירה', dealType === 'sale') + opt('rent', 'להשכרה', dealType === 'rent')
      ) +
        select(
          'city',
          'עיר',
          'flaticon-calendar',
          opt('', 'כל הערים', !city) + cities.map((c) => opt(c.value, c.label, city === c.value)).join('')
        ) +
        select(
          'minRooms',
          'חדרים',
          'flaticon-user',
          opt('', 'הכול', !minRooms) +
            content.searchRooms.map((r) => opt(r, `${r}+ חדרים`, minRooms === r)).join('')
        ) +
        `<button type="submit" class="theme-btn btn-style fill no-border search__btn"><span>חיפוש נכסים</span></button>`
    );
  }
  $('.advance__search').slice(1).remove();

  /* ── room grid → listings ─────────────────────────────────────────────── */
  const cards = $('.room__card');
  const prototypeCol = cards.first().closest('[class*="col-"]');
  const grid = prototypeCol.parent();

  if (listings.length === 0) {
    grid.html('<div class="col-12 text-center"><p>לא נמצאו נכסים התואמים לחיפוש.</p></div>');
  } else {
    const colClass = prototypeCol.attr('class') ?? 'col-lg-6 col-xl-4 col-md-6';
    const cardHtml = (p: (typeof listings)[number]) => {
      const href = `/apartments/${p.id}`;
      return `<div class="${colClass}">
        <div class="room__card">
          <div class="room__card__top">
            <div class="room__card__image">
              <a href="${href}"><img src="${firstImage(p.images)}" width="420" height="310" alt="${p.title}"></a>
            </div>
          </div>
          <div class="room__card__meta">
            <a href="${href}" class="room__card__title h5">${p.title}</a>
            <div class="room__card__meta__info">
              ${p.area != null ? `<span><i class="flaticon-construction"></i>${p.area} מ״ר</span>` : ''}
              ${p.rooms != null ? `<span><i class="flaticon-user"></i>${p.rooms} חדרים</span>` : ''}
            </div>
            <div class="room__price__tag"><span class="h6 d-block ltr">₪${formatPrice(String(p.price ?? ''))}</span></div>
            <a href="${href}" class="room__card__link">לפרטים נוספים</a>
          </div>
        </div>
      </div>`;
    };
    grid.html(listings.map(cardHtml).join(''));
  }

  /* ── testimonial band keeps the template's shape, our quotes ──────────── */
  const quote = content.testimonials[0];
  if (quote) {
    $('.slider__text').first().text(quote.text);
    $('.slider__author__info__content h6').first().text(quote.author);
    $('.slider__author__info__content span').first().text(quote.context);
    $('.author__icon img, .slider__author__info__image img').attr('src', quote.avatar);
  }
  // Without the slider plugin only the first slide should show.
  $('.testimonial .swiper-slide').slice(1).remove();

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: extractBody($) }} />
      <SearchFormBinder />
    </>
  );
}
