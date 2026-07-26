import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, RowHead, CITIES, INK, SLATE, MIST, FOG, CORAL, PILL_SHADOW, toV3Prop, firstImage } from './ui';

/* V3 "Marketplace" homepage — inventory-first: search pill → sale row (live count)
   → neighborhood chips (live groupBy counts) → rent row (freshness note) →
   recently-sold list rows → quiet inline seller moment. Everything routes inside /v3. */

export const revalidate = 60;

const LIST_SELECT = {
  id: true, title: true, location: true, neighborhood: true, price: true, rooms: true,
  area: true, dealType: true, category: true, images: true, isPinned: true,
  createdAt: true, updatedAt: true,
} as const;

function freshnessNote(dates: Date[]): string | null {
  if (dates.length === 0) return null;
  const latest = dates.reduce((m, d) => (d > m ? d : m), dates[0]);
  const now = new Date();
  if (latest.toDateString() === now.toDateString()) return 'עודכן היום';
  if (latest.toDateString() === new Date(now.getTime() - 86400000).toDateString()) return 'עודכן אתמול';
  return `עודכן ${latest.toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })}`;
}

export default async function V3Page() {
  const [saleRaw, rentRaw, totalActive, saleCount, hoodsRaw, soldRaw, owner] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isSold: false, OR: [{ dealType: 'sale' }, { category: 'sales' }] },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 8,
      select: LIST_SELECT,
    }),
    prisma.property.findMany({
      where: { isActive: true, isSold: false, OR: [{ dealType: 'rent' }, { category: 'rentals' }] },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 8,
      select: LIST_SELECT,
    }),
    prisma.property.count({ where: { isActive: true, isSold: false } }),
    prisma.property.count({ where: { isActive: true, isSold: false, OR: [{ dealType: 'sale' }, { category: 'sales' }] } }),
    prisma.property.groupBy({
      by: ['neighborhood'],
      where: { isActive: true, isSold: false, neighborhood: { not: null } },
      _count: true,
    }),
    prisma.property.findMany({
      where: { isSold: true },
      orderBy: { updatedAt: 'desc' }, take: 3,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, images: true },
    }),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } }).catch(() => null),
  ]);

  const sale = saleRaw.map(toV3Prop);
  const rent = rentRaw.map(toV3Prop);
  const phone = owner?.phone ?? null;
  const rentFreshness = freshnessNote(rentRaw.map((p) => p.updatedAt));
  const hoods = hoodsRaw
    .filter((h) => h.neighborhood && h.neighborhood.trim())
    .sort((a, b) => b._count - a._count)
    .slice(0, 6);

  return (
    <div dir="rtl">

      {/* ═══ search hero — inventory-first ═══ */}
      <section className="px-6 md:px-10 pt-12 md:pt-16 pb-10">
        <div className="max-w-[860px] mx-auto text-center">
          <h1 className="text-balance" style={{ fontWeight: 700, fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)', lineHeight: 1.2, color: INK, letterSpacing: '-0.02em' }}>
            מה חדש השבוע בחולון והמרכז
          </h1>
          <p className="mt-2.5 text-[15.5px]" style={{ color: SLATE }}>
            <span dir="ltr">{totalActive}</span> נכסים פעילים כרגע · המבחר מתעדכן כל יום
          </p>

          <form
            action="/v3/apartments"
            method="GET"
            className="mt-8 mx-auto flex items-stretch bg-white rounded-full max-w-[640px]"
            style={{ boxShadow: PILL_SHADOW }}
          >
            <label className="flex-1 min-w-0 flex flex-col justify-center ps-7 pe-4 py-3 text-start rounded-s-full">
              <span className="text-[12px]" style={{ fontWeight: 600, color: INK }}>סוג עסקה</span>
              <select name="dealType" defaultValue="sale" className="bg-transparent text-[14px] focus:outline-none cursor-pointer" style={{ color: SLATE }}>
                <option value="sale">לקנייה</option>
                <option value="rent">להשכרה</option>
              </select>
            </label>
            <span aria-hidden="true" className="self-center h-8 w-px" style={{ background: MIST }} />
            <label className="flex-1 min-w-0 flex flex-col justify-center ps-6 pe-4 py-3 text-start">
              <span className="text-[12px]" style={{ fontWeight: 600, color: INK }}>איפה</span>
              <select name="city" defaultValue="holon" className="bg-transparent text-[14px] focus:outline-none cursor-pointer" style={{ color: SLATE }}>
                {CITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <div className="flex items-center pe-2.5 ps-1">
              <button
                type="submit"
                aria-label="חיפוש נכסים"
                className="inline-flex items-center justify-center size-12 rounded-full text-white transition-[filter] hover:brightness-95"
                style={{ background: CORAL }}
              >
                <Search size={19} aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ═══ sale row — header carries the live count ═══ */}
      <section className="max-w-[1760px] mx-auto px-6 md:px-10 pb-4">
        <RowHead
          title="דירות למכירה"
          href="/v3/apartments?dealType=sale"
          note={<><span dir="ltr">{saleCount}</span> נכסים</>}
        />
        <div className="flex gap-4 overflow-x-auto snap-x pb-4 scrollbar-hide">
          {sale.map((p, i) => <Card key={p.id} p={p} fixed priority={i < 4} />)}
        </div>
      </section>

      {/* ═══ neighborhood chips — real counts from groupBy ═══ */}
      {hoods.length > 0 && (
        <section className="max-w-[1760px] mx-auto px-6 md:px-10 py-6">
          <h2 className="text-[22px] mb-4" style={{ fontWeight: 600, color: INK, letterSpacing: '-0.2px' }}>
            חיפוש לפי שכונה
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {hoods.map((h) => (
              <Link
                key={h.neighborhood}
                href={`/v3/apartments?neighborhood=${encodeURIComponent(h.neighborhood!)}`}
                className="inline-flex items-baseline gap-1.5 bg-white rounded-full px-4 py-2.5 text-[14px] transition-colors hover:bg-[#f0f0f0]"
                style={{ border: `1px solid ${MIST}` }}
              >
                <span style={{ fontWeight: 600, color: INK }}>{h.neighborhood}</span>
                <span style={{ color: SLATE }}>· <span dir="ltr">{h._count}</span></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ rent row — header carries a freshness note instead of a count ═══ */}
      {rent.length > 0 && (
        <section className="max-w-[1760px] mx-auto px-6 md:px-10 py-6">
          <RowHead title="דירות להשכרה" href="/v3/apartments?dealType=rent" note={rentFreshness ?? undefined} />
          <div className="flex gap-4 overflow-x-auto snap-x pb-4 scrollbar-hide">
            {rent.map((p) => <Card key={p.id} p={p} fixed />)}
          </div>
        </section>
      )}

      {/* ═══ recently sold — quiet list rows, grayscale thumbs ═══ */}
      {soldRaw.length > 0 && (
        <section className="max-w-[1760px] mx-auto px-6 md:px-10 py-6">
          <div className="max-w-[720px]">
            <h2 className="text-[22px] mb-4" style={{ fontWeight: 600, color: INK, letterSpacing: '-0.2px' }}>
              נמכר לאחרונה
            </h2>
            <div className="bg-white rounded-[20px] overflow-hidden" style={{ border: `1px solid ${MIST}` }}>
              {soldRaw.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 px-5 py-4"
                  style={i > 0 ? { borderTop: `1px solid ${MIST}` } : undefined}
                >
                  <div className="relative size-14 rounded-xl overflow-hidden shrink-0" style={{ background: '#dddddd' }}>
                    <Image src={firstImage(s.images)} alt="" fill sizes="56px" className="object-cover grayscale" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[14.5px] truncate" style={{ fontWeight: 600, color: INK }}>{s.title}</span>
                    <span className="block mt-0.5 text-[13px] truncate" style={{ color: SLATE }}>
                      {[
                        `${s.location}${s.neighborhood ? ` · ${s.neighborhood}` : ''}`,
                        s.rooms && `${s.rooms} חדרים`,
                        s.area && `${s.area} מ״ר`,
                      ].filter(Boolean).join(' · ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:block text-[13.5px]" style={{ color: SLATE }} dir="ltr">₪{s.price}</span>
                    <span className="text-[11px] rounded px-2 py-1" style={{ background: FOG, color: SLATE, fontWeight: 600, letterSpacing: '0.04em' }}>
                      נמכר
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ seller moment — quiet inline row, not a band ═══ */}
      <section id="v3-sell" className="max-w-[1760px] mx-auto px-6 md:px-10 pt-6 pb-16">
        <div
          className="pt-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-10 justify-between"
          style={{ borderTop: `1px solid ${MIST}` }}
        >
          <p className="text-[15px] leading-relaxed max-w-[62ch]" style={{ color: SLATE }}>
            <span style={{ fontWeight: 600, color: INK }}>מוכרים דירה באזור?</span>{' '}
            נכין הערכת שווי לפי עסקאות שנסגרו ברחובות שלכם, בלי עלות ובלי התחייבות.
            משרד מקומי שפועל בחולון משנת 2002. עונים בדרך כלל בתוך שעה, בימי א׳–ה׳.
          </p>
          {phone && (
            <div className="flex items-center gap-5 shrink-0 text-[14.5px]" style={{ fontWeight: 600 }}>
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="underline underline-offset-4"
                style={{ color: INK }}
              >
                התקשרו <span dir="ltr">{phone}</span>
              </a>
              <a
                href={`https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '972')}`}
                target="_blank"
                rel="noopener"
                className="underline underline-offset-4"
                style={{ color: INK }}
              >
                WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
