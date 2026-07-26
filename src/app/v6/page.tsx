import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';

/* V6 "Broker" homepage — premium-brokerage minimalism (Compass school):
   white canvas, ink #111, Frank Ruhl serif, emerald micro-accent, hairlines.
   Listings as editorial LIST ROWS · sold record strip · quiet neighborhood
   index · inline serif seller sentence. Live counts from DB, no marketing stats. */

export const revalidate = 60;

const INK = '#111111';
const GRAY = '#6b6b66';
const LINE = '#E8E8E4';
const EMERALD = '#14532D';
const Serif: React.CSSProperties = { fontFamily: 'var(--font-frank), serif' };

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

interface Row {
  id: number; title: string; location: string; neighborhood: string | null;
  price: string; rooms: string | null; area: number | null; floor: number | null;
  dealType: string; image: string; isNew: boolean;
}

interface SoldRow {
  id: number; location: string; neighborhood: string | null;
  price: string; rooms: string | null; image: string;
}

function firstImage(val: string | null | undefined): string {
  if (!val) return '/images/hero/sales.jpg';
  try { const a = JSON.parse(val); return Array.isArray(a) && a[0] ? a[0] : '/images/hero/sales.jpg'; }
  catch { return '/images/hero/sales.jpg'; }
}

/* ── editorial list row: thumb start · serif title + facts · price end ── */
const ListingRow: React.FC<{ p: Row; priority?: boolean }> = ({ p, priority }) => (
  <Link
    href={`/apartments/${p.id}`}
    className="group flex items-start gap-5 md:gap-8 py-6 md:py-7"
    style={{ borderBottom: `1px solid ${LINE}` }}
  >
    <div className="relative w-[124px] sm:w-[200px] md:w-[264px] shrink-0 aspect-[3/2] overflow-hidden" style={{ background: '#F1F1ED' }}>
      <Image
        src={p.image} alt={p.title} fill
        sizes="(max-width: 640px) 124px, (max-width: 768px) 200px, 264px"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        {...(priority ? { priority: true } : { loading: 'lazy' as const })}
      />
    </div>
    <div className="flex-1 min-w-0 pt-0.5">
      <div className="flex items-center gap-3 text-[12px] mb-1.5" style={{ fontWeight: 600 }}>
        <span style={{ color: EMERALD }}>{p.dealType === 'rent' ? 'להשכרה' : 'למכירה'}</span>
        {p.isNew && (
          <span className="px-1.5 py-0.5 text-[11px]" style={{ border: `1px solid ${EMERALD}`, color: EMERALD, lineHeight: 1.2 }}>
            חדש
          </span>
        )}
      </div>
      <div className="text-[19px] md:text-[22px] leading-snug" style={{ ...Serif, fontWeight: 400, color: INK }}>
        {p.title}
      </div>
      <div className="mt-1.5 text-[13.5px] leading-[1.6]" style={{ color: GRAY }}>
        {[
          `${p.location}${p.neighborhood ? `, ${p.neighborhood}` : ''}`,
          p.rooms && `${p.rooms} חדרים`,
          p.area && `${p.area} מ״ר`,
          p.floor != null && `קומה ${p.floor}`,
        ].filter(Boolean).join(' · ')}
      </div>
    </div>
    <div className="shrink-0 pt-1 text-[16px] md:text-[18px] tabular-nums" style={{ fontWeight: 700, color: INK }} dir="ltr">
      ₪{p.price}
    </div>
  </Link>
);

export default async function V6Page() {
  const [raw, soldRaw, totalActive, dealCounts, hoodGroups, owner] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isSold: false },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 8,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, floor: true, dealType: true, category: true, images: true, createdAt: true },
    }),
    prisma.property.findMany({
      where: { isSold: true },
      orderBy: { updatedAt: 'desc' }, take: 3,
      select: { id: true, location: true, neighborhood: true, price: true, rooms: true, images: true },
    }),
    prisma.property.count({ where: { isActive: true, isSold: false } }),
    prisma.property.groupBy({ by: ['dealType'], where: { isActive: true, isSold: false }, _count: true }),
    prisma.property.groupBy({
      by: ['neighborhood'],
      where: { isActive: true, isSold: false, neighborhood: { not: null } },
      _count: true,
    }),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } }).catch(() => null),
  ]);

  const now = Date.now();
  const rows: Row[] = raw.map((p) => ({
    id: p.id, title: p.title, location: p.location, neighborhood: p.neighborhood,
    price: p.price, rooms: p.rooms, area: p.area, floor: p.floor,
    dealType: p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale',
    image: firstImage(p.images),
    isNew: now - p.createdAt.getTime() < NEW_WINDOW_MS,
  }));
  const sold: SoldRow[] = soldRaw.map((p) => ({
    id: p.id, location: p.location, neighborhood: p.neighborhood,
    price: p.price, rooms: p.rooms, image: firstImage(p.images),
  }));

  const saleCount = dealCounts.find((d) => d.dealType === 'sale')?._count ?? 0;
  const rentCount = dealCounts.find((d) => d.dealType === 'rent')?._count ?? 0;
  const hoods = hoodGroups
    .filter((h) => h.neighborhood)
    .sort((a, b) => b._count - a._count)
    .slice(0, 6);

  const phone = owner?.phone ?? null;
  const telHref = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : null;

  return (
    <div dir="rtl">

      {/* ═══ split hero: serif authority one-liner + live counts + underline search · photo ═══ */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 pt-14 md:pt-20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-balance" style={{ ...Serif, fontWeight: 300, fontSize: 'clamp(2.5rem, 5vw, 4.1rem)', lineHeight: 1.14, color: INK }}>
            הכתובת לנדל״ן בחולון והסביבה
          </h1>
          <p className="mt-6 max-w-[52ch] text-[16px] leading-[1.75]" style={{ color: GRAY }}>
            {totalActive} נכסים פעילים כרגע — {saleCount} למכירה ו־{rentCount} להשכרה, בחולון, בת ים וראשון לציון.
            המשרד מלווה קונים ומוכרים מאז 2002. לכל פנייה עונים עד שעה, בימי א׳–ה׳.
          </p>

          {/* underline search */}
          <form action="/apartments" method="GET" className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-end gap-5 max-w-[540px]">
            <label className="flex-1">
              <span className="block text-[11.5px] mb-1.5" style={{ color: GRAY }}>סוג עסקה</span>
              <select name="dealType" defaultValue="sale" className="w-full bg-transparent pb-2 text-[15.5px] focus:outline-none cursor-pointer" style={{ borderBottom: `1px solid ${INK}`, color: INK }}>
                <option value="sale">לקנייה</option>
                <option value="rent">להשכרה</option>
              </select>
            </label>
            <label className="flex-1">
              <span className="block text-[11.5px] mb-1.5" style={{ color: GRAY }}>עיר</span>
              <select name="city" defaultValue="holon" className="w-full bg-transparent pb-2 text-[15.5px] focus:outline-none cursor-pointer" style={{ borderBottom: `1px solid ${INK}`, color: INK }}>
                <option value="holon">חולון</option><option value="batyam">בת ים</option>
                <option value="rishon">ראשון לציון</option><option value="telaviv">תל אביב</option>
                <option value="ramat-gan">רמת גן</option><option value="givatayim">גבעתיים</option>
              </select>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md text-white text-[14.5px] transition-opacity hover:opacity-85 shrink-0"
              style={{ background: INK }}
            >
              חיפוש
            </button>
          </form>
        </div>

        <div className="relative aspect-[4/5] max-w-[560px] w-full ms-auto overflow-hidden hidden lg:block">
          <Image src="/hero-poster.jpg" alt="" fill priority sizes="45vw" className="object-cover" />
        </div>
      </section>

      {/* ═══ listings: editorial list rows on hairlines ═══ */}
      <section className="max-w-[1320px] mx-auto px-6 md:px-10 pb-16" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="flex items-end justify-between gap-6 pt-12 mb-3">
          <h2 style={{ ...Serif, fontWeight: 300, fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)', color: INK }}>
            בשוק עכשיו
            <span className="ms-4 align-middle text-[14px]" style={{ fontFamily: 'var(--font-assistant), Arial, sans-serif', color: GRAY, fontWeight: 400 }}>
              {totalActive} נכסים פעילים
            </span>
          </h2>
          <Link href="/apartments" className="group inline-flex items-center gap-2 text-[13.5px] shrink-0" style={{ color: EMERALD, fontWeight: 600 }}>
            לקטלוג המלא
            <ArrowLeft size={15} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
        <div style={{ borderTop: `1px solid ${LINE}` }}>
          {rows.map((p, i) => <ListingRow key={p.id} p={p} priority={i < 2} />)}
        </div>
      </section>

      {/* ═══ sold record: 3 grayscale thumbs, serif prices ═══ */}
      {sold.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-6 md:px-10 pb-14" style={{ borderTop: `1px solid ${LINE}` }}>
          <h2 className="pt-12 mb-8" style={{ ...Serif, fontWeight: 300, fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)', color: INK }}>
            נמכרו לאחרונה
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-8">
            {sold.map((s) => (
              <div key={s.id}>
                <div className="relative aspect-[3/2] overflow-hidden" style={{ background: '#F1F1ED' }}>
                  <Image
                    src={s.image} alt="" fill loading="lazy"
                    sizes="(max-width: 640px) 92vw, 30vw"
                    className="object-cover grayscale"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="text-[20px]" style={{ ...Serif, fontWeight: 400, color: INK }} dir="ltr">₪{s.price}</span>
                  <span className="text-[12px]" style={{ color: GRAY }}>נמכר</span>
                </div>
                <div className="mt-0.5 text-[13.5px]" style={{ color: GRAY }}>
                  {[`${s.location}${s.neighborhood ? `, ${s.neighborhood}` : ''}`, s.rooms && `${s.rooms} חדרים`].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </div>

          {/* seller moment: single serif sentence, underlined tel link — no band */}
          <p id="v6-sell" className="mt-12 pt-8 max-w-[62ch] text-[19px] md:text-[22px] leading-[1.6]" style={{ ...Serif, fontWeight: 300, color: INK, borderTop: `1px solid ${LINE}` }}>
            גם הדירה שלכם יכולה להופיע כאן. הערכת שווי נקבעת אצלנו לפי מכירות אמת בשכונה —
            {telHref ? (
              <>
                {' '}התקשרו ל־<a href={telHref} className="underline underline-offset-4 decoration-1 hover:opacity-70 transition-opacity" style={{ color: INK }} dir="ltr">{phone}</a>
              </>
            ) : (
              <> דברו איתנו</>
            )}
            {' '}ונקבע פגישה בנכס.
          </p>
        </section>
      )}

      {/* ═══ neighborhoods: quiet two-column text index with live counts ═══ */}
      {hoods.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-6 md:px-10 pb-20" style={{ borderTop: `1px solid ${LINE}` }}>
          <h2 className="pt-12 mb-2" style={{ ...Serif, fontWeight: 300, fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)', color: INK }}>
            לפי שכונה
          </h2>
          <p className="mb-6 text-[14px]" style={{ color: GRAY }}>סיורים מתקיימים גם בשעות הערב, בתיאום מראש.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 max-w-[760px]">
            {hoods.map((h) => (
              <Link
                key={h.neighborhood}
                href="/apartments?city=holon"
                className="flex items-baseline justify-between gap-6 py-3 hover:opacity-60 transition-opacity"
                style={{ borderBottom: `1px solid ${LINE}` }}
              >
                <span className="text-[15px]" style={{ color: INK }}>{h.neighborhood}</span>
                <span className="text-[13px] tabular-nums" style={{ color: GRAY }}>{h._count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
