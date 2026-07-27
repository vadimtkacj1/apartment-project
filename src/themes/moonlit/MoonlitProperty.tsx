import React from 'react';

import { prisma } from '@/lib/prisma';
import { firstImage, formatPrice } from './kit';
import LeadFormBinder from './LeadFormBinder';
import { extractBody, loadTemplatePage } from './template-html';

/**
 * Property page — the template's `room-details-1.html` itself, with our data
 * swapped in. Nothing is re-drawn by hand, so every wrapper, shape and class of
 * the original page survives; only text, images and repeated items change.
 *
 * The booking sidebar keeps the template's own markup; LeadFormBinder attaches
 * the submit handler, so the DOM is never cut apart.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MoonlitPropertyProps {
  property: Record<string, any>;
  title: string;
  description: string;
}

const FALLBACK = '/images/hero/sales.jpg';

const PARKING_LABELS: Record<string, string> = {
  none: 'ללא חניה', single: 'חניה אחת', double: 'שתי חניות',
  multiple: 'מספר חניות', shared: 'חניה משותפת',
};
const FURNITURE_LABELS: Record<string, string> = {
  none: 'ללא ריהוט', partial: 'ריהוט חלקי', full: 'ריהוט מלא',
};
const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'דירה', penthouse: 'פנטהאוז', garden: 'דירת גן', duplex: 'דופלקס',
  studio: 'סטודיו', house: 'בית פרטי', cottage: 'קוטג׳', land: 'מגרש', commercial: 'נכס מסחרי',
};

/** Amenity → the closest icon shipped with the template. */
const AMENITIES: { key: string; label: string; icon: string }[] = [
  { key: 'ac', label: 'מיזוג אוויר', icon: 'snow.svg' },
  { key: 'elevator', label: 'מעלית', icon: 'support.svg' },
  { key: 'sunBalcony', label: 'מרפסת שמש', icon: 'balcony.svg' },
  { key: 'mamad', label: 'ממ״ד', icon: 'security.svg' },
  { key: 'storage', label: 'מחסן', icon: 'room.svg' },
  { key: 'boiler', label: 'דוד שמש', icon: 'shower.svg' },
  { key: 'handicap', label: 'גישה לנכים', icon: 'check-fill.svg' },
  { key: 'bars', label: 'סורגים', icon: 'check-fill.svg' },
  { key: 'mamak', label: 'מחסן דירתי', icon: 'refrigerator.svg' },
  { key: 'solarHeater', label: 'דוד חשמלי', icon: 'hot-coffe.svg' },
];

export default async function MoonlitProperty({ property, title, description }: MoonlitPropertyProps) {
  const images: string[] =
    Array.isArray(property.images) && property.images.length > 0 ? property.images : [FALLBACK];

  const isRent = property.dealType === 'rent' || property.category === 'rentals';
  const priceLabel = `₪${formatPrice(String(property.price ?? ''))}${isRent ? ' / חודש' : ''}`;

  const similarRaw = await prisma.property
    .findMany({
      where: {
        isActive: true, isSold: false, id: { not: property.id },
        ...(property.city ? { city: property.city } : {}),
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: 3,
      select: { id: true, title: true, price: true, rooms: true, area: true, images: true },
    })
    .catch(() => []);

  const $ = await loadTemplatePage('room-details-1.html');

  /* ── page hero: the listing's own photo ───────────────────────────────── */
  $('.page__hero__bg').attr('style', `background-image: url(${images[0]});`);
  $('.page__hero__content h1').text(title);
  $('.page__hero__content p').text(
    [property.neighborhood, property.location].filter(Boolean).join(' · ')
  );

  /* ── headline block ───────────────────────────────────────────────────── */
  $('.room__details .price').first().text(priceLabel).addClass('ltr');
  $('.room__details .room__title').first().text(title);

  const metaHtml = [
    property.area ? `<span><i class="flaticon-construction"></i>${property.area} מ״ר</span>` : '',
    property.bedrooms != null ? `<span><i class="flaticon-user"></i>${property.bedrooms} חדרים</span>` : '',
    property.floor != null ? `<span><i class="flaticon-hotel-room"></i>קומה ${property.floor}</span>` : '',
  ].join('');
  $('.room__details .room__meta').first().html(metaHtml);

  // The template's intro paragraph carries the listing description.
  $('.room__details > p').first().html(
    (description || '').replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>')
  );

  /* ── image pair ───────────────────────────────────────────────────────── */
  const pair = images.slice(1, 3);
  $('.room__image__group .room__image__item').each((i, el) => {
    if (pair[i]) $(el).find('img').attr('src', pair[i]).attr('alt', title);
    else $(el).remove();
  });
  if (pair.length === 0) $('.room__image__group').remove();

  /* ── amenities: the template's 3-per-row grid ─────────────────────────── */
  const amenities = AMENITIES.filter((a) => property.amenities?.[a.key]);
  const amenityBox = $('.room__amenity').first();
  if (amenities.length === 0) {
    amenityBox.prev('span.h4').remove();
    amenityBox.remove();
  } else {
    const rows: string[] = [];
    for (let i = 0; i < amenities.length; i += 3) {
      const items = amenities
        .slice(i, i + 3)
        .map(
          (a) =>
            `<div class="single__item"><img src="/moonlit/images/icon/${a.icon}" height="30" width="36" alt=""><span>${a.label}</span></div>`
        )
        .join('');
      rows.push(`<div class="group__row">${items}</div>`);
    }
    amenityBox.html(rows.join(''));
    amenityBox.prev('span.h4').text('מה יש בנכס');
  }

  /* ── features: photo + spec list ──────────────────────────────────────── */
  const specs = [
    property.propertyType && PROPERTY_TYPE_LABELS[property.propertyType]
      ? `סוג הנכס: ${PROPERTY_TYPE_LABELS[property.propertyType]}` : null,
    property.floor != null
      ? `קומה ${property.floor}${property.totalFloors ? ` מתוך ${property.totalFloors}` : ''}` : null,
    property.bedrooms != null ? `${property.bedrooms} חדרים` : null,
    property.bathrooms != null ? `${property.bathrooms} חדרי רחצה` : null,
    property.area ? `${property.area} מ״ר` : null,
    property.builtArea ? `${property.builtArea} מ״ר בנוי` : null,
    property.parking && PARKING_LABELS[property.parking] ? PARKING_LABELS[property.parking] : null,
    property.furniture && FURNITURE_LABELS[property.furniture] ? FURNITURE_LABELS[property.furniture] : null,
    property.neighborhood ? `שכונה: ${property.neighborhood}` : null,
    property.vacancyDate ? `פינוי: ${property.vacancyDate}` : null,
  ].filter(Boolean) as string[];

  const featureBox = $('.room__feature').first();
  if (images[3]) featureBox.find('.room__feature__image img').attr('src', images[3]).attr('alt', title);
  else featureBox.find('.room__feature__image').remove();
  featureBox.find('.list__item').first().html(specs.map((s) => `<li>${s}</li>`).join(''));
  featureBox.find('.list__item').slice(1).remove();
  featureBox.prev('span.h4').text('פרטי הנכס');

  // The template closes with a second paragraph — reuse it as the CTA line.
  $('.room__details > p').slice(1).first().text('רוצים לראות את הנכס? השאירו פרטים בטופס ונחזור אליכם.');

  /* ── booking sidebar → viewing request ────────────────────────────────── */
  const form = $('.rts__booking__form form').first();
  form.attr('id', 'moonlit-lead-form').removeAttr('action').removeAttr('method');
  form.find('h5').text('תיאום ביקור בנכס');

  const field = (id: string, label: string, ph: string, icon: string, type = 'text', dir = '') => `
    <div class="query__input">
      <label for="${id}" class="query__label">${label}</label>
      <div class="query__input__position">
        <input type="${type}" id="${id}" name="${id}" placeholder="${ph}"${dir ? ` dir="${dir}"` : ''} required>
        <div class="query__input__icon"><i class="${icon}"></i></div>
      </div>
    </div>`;

  const wrapper = form.find('.advance__search__wrapper').first();
  wrapper.html(
    field('name', 'שם מלא', 'השם שלכם', 'flaticon-user') +
      field('phone', 'טלפון', '050-0000000', 'flaticon-phone-flip', 'tel', 'ltr') +
      `<div class="query__input">
        <label for="message" class="query__label">הודעה</label>
        <div class="query__input__position">
          <input type="text" id="message" name="message" placeholder="מתי נוח לכם לראות את הנכס?">
          <div class="query__input__icon"><i class="flaticon-envelope"></i></div>
        </div>
      </div>` +
      `<div class="total__price">
        <span class="total h6 mb-0">מחיר מבוקש</span>
        <span class="price h6 m-0 ltr">${priceLabel}</span>
      </div>` +
      `<button type="submit" class="theme-btn btn-style fill no-border"><span>שלחו לי פרטים</span></button>` +
      `<p id="moonlit-lead-note" class="mt-15 mb-0"></p>`
  );

  /* ── similar rooms ────────────────────────────────────────────────────── */
  const cards = $('.room__card');
  if (similarRaw.length === 0) {
    cards.closest('.rts__section').remove();
  } else {
    cards.each((i, el) => {
      const p = similarRaw[i];
      if (!p) {
        $(el).closest('[class*="col-"]').remove();
        return;
      }
      const href = `/apartments/${p.id}`;
      const card = $(el);
      card.find('a').attr('href', href);
      card.find('.room__card__image img').attr('src', firstImage(p.images)).attr('alt', p.title);
      card.find('.room__card__title').text(p.title);
      card.find('.room__card__meta__info').html(
        [
          p.area != null ? `<span><i class="flaticon-construction"></i>${p.area} מ״ר</span>` : '',
          p.rooms != null ? `<span><i class="flaticon-user"></i>${p.rooms} חדרים</span>` : '',
        ].join('')
      );
      card.find('.room__price__tag span').text(`₪${formatPrice(String(p.price ?? ''))}`).addClass('ltr');
      card.find('.room__card__link').text('לפרטים נוספים');
    });
    const section = cards.first().closest('.rts__section');
    section.find('.subtitle__icon__three').text('נכסים דומים');
    section.find('.section__title').text('נכסים דומים');
  }

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: extractBody($) }} />
      <LeadFormBinder propertyId={property.id} title={title} />
    </>
  );
}
