import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ArrowLeft, BedDouble, Maximize, Phone } from 'lucide-react';
import { prisma } from '@/lib/prisma';

/* V5 "Sunny" homepage — Apron reference: charcoal-overlay photo hero with
   chunky headline + amber pill search, warm canvas, rounded cards.
   Structure: hero → three doors (buy/rent/sell) → snap-scroll listings →
   neighborhood chips → recently-sold list rows. */

export const revalidate = 60;

const CHAR = '#23201A';
const AMBER = '#FFB300';
const MUTED = '#7A7264';
const LINE = '#EFE6CC';

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

interface Prop {
  id: number; title: string; location: string; neighborhood: string | null;
  price: string; rooms: string | null; area: number | null; dealType: string;
  image: string; isNew: boolean;
}

interface SoldProp {
  id: number; title: string; location: string; neighborhood: string | null;
  price: string; rooms: string | null; area: number | null; image: string;
}

function firstImage(val: string | null | undefined): string {
  if (!val) return '/images/hero/sales.jpg';
  try { const a = JSON.parse(val); return Array.isArray(a) && a[0] ? a[0] : '/images/hero/sales.jpg'; }
  catch { return '/images/hero/sales.jpg'; }
}

const Card: React.FC<{ p: Prop; priority?: boolean }> = ({ p, priority }) => (
  <Link
    href={`/apartments/${p.id}`}
    className="group block bg-white rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 duration-300 snap-start shrink-0 w-[280px] sm:w-[320px]"
    style={{ border: `1px solid ${LINE}`, boxShadow: '0 2px 10px rgba(35,32,26,0.06)' }}
  >
    <div className="relative aspect-[4/3] overflow-hidden" style={{ background: '#F3ECD9' }}>
      <Image
        src={p.image} alt={p.title} fill
        sizes="(max-width: 640px) 280px, 320px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        {...(priority ? { priority: true } : { loading: 'lazy' as const })}
      />
      <div className="absolute top-3 inset-inline-start-3 flex items-center gap-1.5">
        {p.isNew && (
          <span className="px-3 py-1 rounded-full text-[12px] font-bold" style={{ background: AMBER, color: CHAR }}>
            חדש
          </span>
        )}
        <span className="px-3 py-1 rounded-full text-[12px] font-bold" style={{ background: '#fff', color: CHAR }}>
          {p.dealType === 'rent' ? 'להשכרה' : 'למכירה'}
        </span>
      </div>
    </div>
    <div className="p-5">
      <div className="text-[20px] font-extrabold tabular-nums" style={{ color: CHAR }} dir="ltr">₪{p.price}</div>
      <div className="mt-1 text-[15px] font-bold truncate" style={{ color: CHAR }}>{p.title}</div>
      <div className="mt-0.5 text-[13.5px] truncate" style={{ color: MUTED }}>
        {p.location}{p.neighborhood ? `, ${p.neighborhood}` : ''}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[13px] font-semibold" style={{ color: MUTED }}>
        {p.rooms && <span className="inline-flex items-center gap-1.5"><BedDouble size={14} aria-hidden="true" style={{ color: CHAR }} />{p.rooms} חד׳</span>}
        {p.area && <span className="inline-flex items-center gap-1.5"><Maximize size={14} aria-hidden="true" style={{ color: CHAR }} />{p.area} מ״ר</span>}
      </div>
    </div>
  </Link>
);

export default async function V5Page() {
  const newCutoff = new Date(Date.now() - NEW_WINDOW_MS);

  const [raw, owner, totalActive, dealCounts, hoodGroups, newCount, soldRaw] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isSold: false },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 10,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, dealType: true, category: true, images: true, createdAt: true },
    }),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } }).catch(() => null),
    prisma.property.count({ where: { isActive: true, isSold: false } }),
    prisma.property.groupBy({ by: ['dealType'], where: { isActive: true, isSold: false }, _count: true }),
    prisma.property.groupBy({
      by: ['neighborhood'],
      where: { isActive: true, isSold: false, neighborhood: { not: null } },
      _count: true,
    }),
    prisma.property.count({ where: { isActive: true, isSold: false, createdAt: { gte: newCutoff } } }),
    prisma.property.findMany({
      where: { isSold: true },
      orderBy: { updatedAt: 'desc' }, take: 3,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, images: true },
    }),
  ]);

  const props: Prop[] = raw.map((p) => ({
    id: p.id, title: p.title, location: p.location, neighborhood: p.neighborhood,
    price: p.price, rooms: p.rooms, area: p.area,
    dealType: p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale',
    image: firstImage(p.images),
    isNew: p.createdAt.getTime() >= newCutoff.getTime(),
  }));

  const sold: SoldProp[] = soldRaw.map((p) => ({
    id: p.id, title: p.title, location: p.location, neighborhood: p.neighborhood,
    price: p.price, rooms: p.rooms, area: p.area, image: firstImage(p.images),
  }));

  const saleCount = dealCounts.filter((d) => d.dealType !== 'rent').reduce((s, d) => s + d._count, 0);
  const rentCount = dealCounts.find((d) => d.dealType === 'rent')?._count ?? 0;

  const hoods = hoodGroups
    .filter((h): h is typeof h & { neighborhood: string } => Boolean(h.neighborhood))
    .sort((a, b) => b._count - a._count)
    .slice(0, 6);

  const phone = owner?.phone ?? null;
  const telHref = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : null;
  const waHref = phone ? `https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '972')}` : null;

  return (
    <div dir="rtl">

      {/* ═══ charcoal-overlay photo hero + chunky headline + amber search ═══ */}
      <section className="px-4 md:px-6 pt-4">
        <div className="relative max-w-[1400px] mx-auto rounded-[24px] overflow-hidden" style={{ minHeight: '520px' }}>
          <Image src="/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(35,32,26,0.62)' }} />
          <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 md:py-28">
            <h1 className="text-white text-balance" style={{ fontWeight: 800, fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              מחפשים דירה
              <br />
              בחולון והסביבה?
            </h1>
            <p className="mt-4 text-[16.5px] font-medium" style={{ color: 'rgba(255,247,224,0.85)' }}>
              {totalActive} נכסים פעילים באתר עכשיו — למכירה ולהשכרה. מתחילים מחיפוש קצר.
            </p>

            {/* pill search */}
            <form action="/apartments" method="GET" className="mt-9 flex flex-col sm:flex-row items-stretch gap-2 w-full max-w-[620px] bg-white rounded-[28px] sm:rounded-full p-2">
              <select
                name="dealType" defaultValue="sale" aria-label="סוג עסקה"
                className="h-[48px] px-4 rounded-full bg-transparent text-[15px] font-bold focus:outline-none cursor-pointer sm:w-[140px]"
                style={{ color: CHAR }}
              >
                <option value="sale">לקנייה</option>
                <option value="rent">להשכרה</option>
              </select>
              <span aria-hidden="true" className="hidden sm:block self-center h-7 w-px" style={{ background: LINE }} />
              <select
                name="city" defaultValue="holon" aria-label="עיר"
                className="h-[48px] px-4 rounded-full bg-transparent text-[15px] font-bold focus:outline-none cursor-pointer flex-1"
                style={{ color: CHAR }}
              >
                <option value="holon">חולון</option><option value="batyam">בת ים</option>
                <option value="rishon">ראשון לציון</option><option value="telaviv">תל אביב</option>
                <option value="ramat-gan">רמת גן</option><option value="givatayim">גבעתיים</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-full text-[15.5px] font-bold transition-[filter] hover:brightness-95"
                style={{ background: AMBER, color: CHAR }}
              >
                <Search size={17} aria-hidden="true" />
                חיפוש
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══ three doors: buyers / renters / sellers (seller moment lives here) ═══ */}
      <section id="v5-sell" className="max-w-[1240px] mx-auto px-6 md:px-10 pt-14 md:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* door 1 — buyers, amber */}
          <div className="rounded-[20px] p-7 flex flex-col" style={{ background: AMBER }}>
            <div className="text-[13px] font-bold" style={{ color: 'rgba(35,32,26,0.65)' }}>
              {saleCount} נכסים למכירה
            </div>
            <h2 className="mt-1.5 text-[24px] font-extrabold tracking-tight" style={{ color: CHAR }}>קונים דירה</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed flex-1" style={{ color: 'rgba(35,32,26,0.8)' }}>
              דירות, דירות גן וקוטג׳ים בחולון, בת ים והסביבה. מסננים לפי חדרים, קומה ותקציב.
            </p>
            <Link
              href="/apartments?dealType=sale"
              className="mt-5 inline-flex items-center gap-1.5 self-start px-5 py-2.5 rounded-full text-[14px] font-bold transition-[filter] hover:brightness-110"
              style={{ background: CHAR, color: '#FFF7E0' }}
            >
              לעיון בנכסים
              <ArrowLeft size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* door 2 — renters, white */}
          <div className="rounded-[20px] p-7 flex flex-col bg-white" style={{ border: `1px solid ${LINE}` }}>
            <div className="text-[13px] font-bold" style={{ color: MUTED }}>
              {rentCount} דירות להשכרה
            </div>
            <h2 className="mt-1.5 text-[24px] font-extrabold tracking-tight" style={{ color: CHAR }}>שוכרים דירה</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed flex-1" style={{ color: MUTED }}>
              דירות מוכנות לכניסה, חלקן מרוהטות. תיאום ביקור בדרך כלל בתוך יום־יומיים, סיורים גם בערב.
            </p>
            <Link
              href="/apartments?dealType=rent"
              className="mt-5 inline-flex items-center gap-1.5 self-start px-5 py-2.5 rounded-full text-[14px] font-bold transition-colors hover:bg-black/5"
              style={{ border: `1.5px solid ${CHAR}`, color: CHAR }}
            >
              לצפייה בדירות
              <ArrowLeft size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* door 3 — sellers, charcoal (the seller moment) */}
          <div className="rounded-[20px] p-7 flex flex-col" style={{ background: CHAR }}>
            <div className="text-[13px] font-bold" style={{ color: 'rgba(255,247,224,0.55)' }}>
              הערכת שווי ללא עלות
            </div>
            <h2 className="mt-1.5 text-[24px] font-extrabold tracking-tight" style={{ color: '#FFF7E0' }}>מוכרים דירה</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed flex-1" style={{ color: 'rgba(255,247,224,0.75)' }}>
              משווים לעסקאות אמת מהאזור לפני שקובעים מחיר. המשרד פועל בחולון למעלה מעשור, ועונים עד שעה בימי א׳–ה׳, 9:00–19:00.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              {telHref && (
                <a
                  href={telHref}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[14px] font-bold transition-[filter] hover:brightness-95"
                  style={{ background: AMBER, color: CHAR }}
                >
                  <Phone size={14} aria-hidden="true" />
                  לתיאום שיחה
                </a>
              )}
              {waHref && (
                <a
                  href={waHref} target="_blank" rel="noopener"
                  className="inline-flex items-center px-5 py-2.5 rounded-full text-[14px] font-bold transition-colors hover:bg-white/10"
                  style={{ border: '1.5px solid rgba(255,247,224,0.45)', color: '#FFF7E0' }}
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ listings — horizontal snap row ═══ */}
      <section className="py-14 md:py-16">
        <div className="max-w-[1240px] mx-auto px-6 md:px-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-6">
          <div>
            <h2 className="text-[26px] md:text-[30px] font-extrabold tracking-tight" style={{ color: CHAR }}>
              חדש באתר
            </h2>
            <p className="mt-1 text-[14px] font-semibold" style={{ color: MUTED }}>
              {newCount > 0 ? `${newCount} נכסים נוספו ב־14 הימים האחרונים` : `${totalActive} נכסים פעילים כרגע`}
            </p>
          </div>
          <Link href="/apartments" className="group inline-flex items-center gap-1.5 text-[14.5px] font-bold shrink-0" style={{ color: CHAR }}>
            לכל {totalActive} הנכסים
            <ArrowLeft size={15} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
        <div className="overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: 'thin' }}>
          <div className="flex gap-5 px-6 md:px-10 max-w-[1240px] mx-auto w-max min-w-full">
            {props.map((p, i) => <Card key={p.id} p={p} priority={i < 2} />)}
          </div>
        </div>
      </section>

      {/* ═══ neighborhoods — amber-outline chips with live counts ═══ */}
      {hoods.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-6 md:px-10 pb-14 md:pb-16">
          <h2 className="text-[22px] md:text-[26px] font-extrabold tracking-tight" style={{ color: CHAR }}>
            חיפוש לפי שכונה
          </h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {hoods.map((h) => (
              <Link
                key={h.neighborhood}
                href={`/apartments?neighborhood=${encodeURIComponent(h.neighborhood)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-bold transition-colors hover:bg-white"
                style={{ border: `1.5px solid ${AMBER}`, color: CHAR }}
              >
                {h.neighborhood}
                <span className="text-[13px] font-semibold" style={{ color: MUTED }}>· {h._count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ recently sold — hairline list rows, grayscale thumbs ═══ */}
      {sold.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-6 md:px-10 pb-20">
          <h2 className="text-[22px] md:text-[26px] font-extrabold tracking-tight" style={{ color: CHAR }}>
            נמכר לאחרונה
          </h2>
          <p className="mt-1 text-[14px] font-semibold" style={{ color: MUTED }}>
            עסקאות שנסגרו דרך המשרד
          </p>
          <div className="mt-5 bg-white rounded-2xl overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
            {sold.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-4 px-4 sm:px-5 py-4"
                style={i > 0 ? { borderTop: `1px solid ${LINE}` } : undefined}
              >
                <div className="relative w-[84px] h-[62px] rounded-xl overflow-hidden shrink-0" style={{ background: '#F3ECD9' }}>
                  <Image src={p.image} alt={p.title} fill sizes="84px" loading="lazy" className="object-cover grayscale" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-bold truncate" style={{ color: CHAR }}>{p.title}</div>
                  <div className="mt-0.5 text-[13px] truncate" style={{ color: MUTED }}>
                    {p.location}{p.neighborhood ? `, ${p.neighborhood}` : ''}
                    {p.rooms ? ` · ${p.rooms} חד׳` : ''}{p.area ? ` · ${p.area} מ״ר` : ''}
                  </div>
                </div>
                <div className="shrink-0 text-end">
                  <div className="text-[15px] font-extrabold tabular-nums" style={{ color: CHAR }} dir="ltr">₪{p.price}</div>
                  <div className="text-[12px] font-bold" style={{ color: MUTED }}>נמכר</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
