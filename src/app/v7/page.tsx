import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';

/* V7 "Estate" homepage — luxury-realty language: forest hero with a real
   listing plaque over the photo; asymmetric collection (1 large + 4 small,
   cream plaques on a white band); neighborhood text links with live counts;
   serif "sold recently" proof row; restrained cream seller card. */

export const revalidate = 60;

const FOREST = '#17352A';
const CREAM = '#F6F1E7';
const INK = '#1C1A15';
const MUTED = '#756E5E';
const LINE = '#E3DCCB';
const Serif: React.CSSProperties = { fontFamily: 'var(--font-frank), serif' };

const CITY_HE: Record<string, string> = {
  holon: 'חולון', batyam: 'בת ים', rishon: 'ראשון לציון', telaviv: 'תל אביב',
  'ramat-gan': 'רמת גן', givatayim: 'גבעתיים',
};

interface Prop {
  id: number; title: string; location: string; neighborhood: string | null;
  price: string; rooms: string | null; area: number | null; dealType: string;
  image: string; isNew: boolean;
}

function firstImage(val: string | null | undefined): string {
  if (!val) return '/images/hero/sales.jpg';
  try { const a = JSON.parse(val); return Array.isArray(a) && a[0] ? a[0] : '/images/hero/sales.jpg'; }
  catch { return '/images/hero/sales.jpg'; }
}

/* photo + cream plaque underneath — the collection card */
const PlaqueCard: React.FC<{ p: Prop; large?: boolean; priority?: boolean }> = ({ p, large, priority }) => (
  <Link href={`/apartments/${p.id}`} className="group block h-full">
    <div className={`relative overflow-hidden ${large ? 'aspect-[4/3] lg:aspect-auto lg:h-[calc(100%-96px)]' : 'aspect-[4/3]'}`} style={{ background: '#EDE6D6' }}>
      <Image
        src={p.image} alt={p.title} fill
        sizes={large ? '(max-width: 1024px) 92vw, 46vw' : '(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw'}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        {...(priority ? { priority: true } : { loading: 'lazy' as const })}
      />
      <span
        className="absolute top-3 inset-inline-start-3 px-2.5 py-1 text-[10.5px]"
        style={{ background: FOREST, color: CREAM, letterSpacing: '0.14em', fontWeight: 600 }}
      >
        {p.dealType === 'rent' ? 'להשכרה' : 'למכירה'}
      </span>
      {p.isNew && (
        <span
          className="absolute top-3 inset-inline-end-3 px-2.5 py-1 text-[10.5px]"
          style={{ background: CREAM, color: FOREST, fontWeight: 700 }}
        >
          חדש
        </span>
      )}
    </div>
    <div className={`px-4 py-3.5 ${large ? 'lg:h-[96px]' : ''}`} style={{ background: CREAM, borderTop: `1px solid ${LINE}` }}>
      <div className="flex items-baseline justify-between gap-4">
        <span className={`truncate ${large ? 'text-[20px]' : 'text-[16.5px]'}`} style={{ ...Serif, fontWeight: 400, color: INK }}>{p.title}</span>
        <span className="text-[15px] tabular-nums shrink-0" style={{ ...Serif, fontWeight: 500, color: FOREST }} dir="ltr">₪{p.price}</span>
      </div>
      <div className="mt-1 text-[12.5px] truncate" style={{ color: MUTED }}>
        {p.location}{p.neighborhood ? `, ${p.neighborhood}` : ''}
        {[p.rooms && ` · ${p.rooms} חדרים`, p.area && ` · ${p.area} מ״ר`].filter(Boolean).join('')}
      </div>
    </div>
  </Link>
);

export default async function V7Page() {
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const activeWhere = { isActive: true, isSold: false } as const;

  const [raw, soldRaw, totalActive, saleCount, rentCount, hoodsRaw, owner] = await Promise.all([
    prisma.property.findMany({
      where: activeWhere,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 6,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, dealType: true, category: true, images: true, createdAt: true },
    }),
    prisma.property.findMany({
      where: { isSold: true },
      orderBy: { updatedAt: 'desc' }, take: 3,
      select: { id: true, title: true, location: true, price: true, images: true },
    }),
    prisma.property.count({ where: activeWhere }),
    prisma.property.count({ where: { ...activeWhere, dealType: 'sale' } }),
    prisma.property.count({ where: { ...activeWhere, dealType: 'rent' } }),
    prisma.property.groupBy({
      by: ['neighborhood', 'city'],
      where: { ...activeWhere, neighborhood: { not: null } },
      _count: true,
    }).catch(() => []),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } }).catch(() => null),
  ]);

  const props: Prop[] = raw.map((p) => ({
    id: p.id, title: p.title, location: p.location, neighborhood: p.neighborhood,
    price: p.price, rooms: p.rooms, area: p.area,
    dealType: p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale',
    image: firstImage(p.images),
    isNew: p.createdAt >= twoWeeksAgo,
  }));
  const plaqueProp = props[0] ?? null;
  const featured = props[1] ?? null;
  const small = props.slice(2, 6);
  const sold = soldRaw.map((p) => ({ id: p.id, title: p.title, location: p.location, price: p.price, image: firstImage(p.images) }));
  const hoods = [...hoodsRaw]
    .sort((a, b) => (b._count as number) - (a._count as number))
    .slice(0, 6);
  const phone = owner?.phone ?? null;
  const telHref = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : null;
  const waHref = phone ? `https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '972')}` : null;

  return (
    <div dir="rtl">

      {/* ═══ forest hero: serif stewardship statement + live counts + search;
             photo carries a real listing plaque ═══ */}
      <section style={{ background: FOREST }}>
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-balance" style={{ ...Serif, fontWeight: 300, fontSize: 'clamp(2.4rem, 5vw, 4rem)', lineHeight: 1.14, color: CREAM }}>
              אנחנו שומרים על הנכס שלכם
              <br />
              כמו על שלנו
            </h1>
            <p className="mt-5 max-w-[48ch] text-[15.5px] leading-[1.75]" style={{ color: 'rgba(246,241,231,0.72)' }}>
              משרד בוטיק בחולון ובת ים. הערכת שווי לפי עסקאות אמת מהאזור, שיווק מוקפד וליווי אישי של המייסדים — כבר 24 שנים, עסקה אחת בכל פעם.
            </p>
            <p className="mt-4 text-[13px] tabular-nums" style={{ color: 'rgba(246,241,231,0.55)' }}>
              כרגע בטיפול המשרד: {totalActive} נכסים · {saleCount} למכירה · {rentCount} להשכרה
            </p>

            {/* cream search card */}
            <form action="/apartments" method="GET" className="mt-8 p-2.5 flex flex-col sm:flex-row gap-2 max-w-[560px]" style={{ background: CREAM }}>
              <select
                name="dealType" defaultValue="sale" aria-label="סוג עסקה"
                className="h-[48px] px-4 bg-white text-[14.5px] focus:outline-none cursor-pointer sm:w-[140px]"
                style={{ border: `1px solid ${LINE}`, color: INK }}
              >
                <option value="sale">לקנייה</option>
                <option value="rent">להשכרה</option>
              </select>
              <select
                name="city" defaultValue="holon" aria-label="עיר"
                className="h-[48px] px-4 bg-white text-[14.5px] focus:outline-none cursor-pointer flex-1"
                style={{ border: `1px solid ${LINE}`, color: INK }}
              >
                <option value="holon">חולון</option><option value="batyam">בת ים</option>
                <option value="rishon">ראשון לציון</option><option value="telaviv">תל אביב</option>
                <option value="ramat-gan">רמת גן</option><option value="givatayim">גבעתיים</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 h-[48px] px-7 text-[14.5px] transition-opacity hover:opacity-90"
                style={{ background: FOREST, color: CREAM, fontWeight: 600, letterSpacing: '0.04em' }}
              >
                <Search size={16} aria-hidden="true" />
                חיפוש
              </button>
            </form>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden hidden lg:block">
            <Image
              src={plaqueProp ? plaqueProp.image : '/hero-poster.jpg'}
              alt={plaqueProp ? plaqueProp.title : ''}
              fill priority sizes="45vw" className="object-cover"
            />
            {plaqueProp && (
              <Link
                href={`/apartments/${plaqueProp.id}`}
                className="absolute bottom-5 inset-inline-start-5 inset-inline-end-5 block p-4 transition-transform hover:-translate-y-0.5"
                style={{ background: CREAM, boxShadow: '0 8px 28px rgba(0,0,0,0.28)' }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[18px] truncate" style={{ ...Serif, fontWeight: 400, color: INK }}>{plaqueProp.title}</span>
                  <span className="text-[16px] tabular-nums shrink-0" style={{ ...Serif, fontWeight: 500, color: FOREST }} dir="ltr">₪{plaqueProp.price}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-4 text-[12.5px]">
                  <span className="truncate" style={{ color: MUTED }}>
                    {plaqueProp.location}{plaqueProp.neighborhood ? `, ${plaqueProp.neighborhood}` : ''}
                    {plaqueProp.rooms ? ` · ${plaqueProp.rooms} חדרים` : ''}
                  </span>
                  <span className="shrink-0" style={{ color: FOREST, fontWeight: 600 }}>לצפייה בנכס ←</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══ collection on white band: 1 large + 4 small, cream plaques ═══ */}
      <section style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="flex items-end justify-between gap-6 mb-9">
            <div>
              <h2 style={{ ...Serif, fontWeight: 300, fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)', color: INK }}>
                הקולקציה הנוכחית
              </h2>
              <p className="mt-2 text-[13.5px] tabular-nums" style={{ color: MUTED }}>
                נבחרת מתוך {totalActive} נכסים פעילים
              </p>
            </div>
            <Link href="/apartments" className="group inline-flex items-center gap-2 text-[13.5px] shrink-0" style={{ color: FOREST, fontWeight: 600 }}>
              לקטלוג המלא
              <ArrowLeft size={15} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ gridAutoRows: 'auto' }}>
            {featured && (
              <div className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
                <PlaqueCard p={featured} large priority />
              </div>
            )}
            {small.map((p, i) => <PlaqueCard key={p.id} p={p} priority={i < 2} />)}
          </div>
        </div>
      </section>

      {/* ═══ neighborhoods as forest text links with live counts ═══ */}
      {hoods.length > 0 && (
        <section className="max-w-[1300px] mx-auto px-6 md:px-10 py-14 md:py-16">
          <h2 className="mb-6" style={{ ...Serif, fontWeight: 300, fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', color: INK }}>
            שכונות שאנחנו מלווים
          </h2>
          <div className="flex flex-wrap items-baseline gap-x-9 gap-y-4">
            {hoods.map((h) => (
              <Link
                key={`${h.city}-${h.neighborhood}`}
                href={CITY_HE[h.city] ? `/apartments?city=${h.city}` : '/apartments'}
                className="group inline-flex items-baseline gap-2 text-[16px] transition-colors"
                style={{ color: FOREST }}
              >
                <span className="group-hover:underline underline-offset-4" style={{ ...Serif, fontWeight: 400 }}>
                  {h.neighborhood}{CITY_HE[h.city] ? `, ${CITY_HE[h.city]}` : ''}
                </span>
                <span className="text-[13px] tabular-nums" style={{ color: MUTED }}>· {h._count as number}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ proof row: sold recently, grayscale thumbs, hairline rows ═══ */}
      {sold.length > 0 && (
        <section className="max-w-[1300px] mx-auto px-6 md:px-10 pb-16 md:pb-20">
          <div className="pt-10" style={{ borderTop: `1px solid ${LINE}` }}>
            <h2 className="mb-7" style={{ ...Serif, fontWeight: 300, fontSize: 'clamp(1.5rem, 2.6vw, 2rem)', color: INK }}>
              נמכר לאחרונה
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-5">
              {sold.map((s) => (
                <li key={s.id} className="flex items-center gap-4 pb-5 md:pb-0" style={{ borderBottom: `1px solid ${LINE}` }}>
                  <div className="relative w-[76px] h-[76px] shrink-0 overflow-hidden" style={{ background: '#EDE6D6' }}>
                    <Image src={s.image} alt={s.title} fill sizes="76px" loading="lazy" className="object-cover grayscale" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[16px] truncate" style={{ ...Serif, fontWeight: 400, color: INK }}>{s.title}</div>
                    <div className="text-[12.5px] truncate" style={{ color: MUTED }}>{s.location}</div>
                    <div className="mt-1 text-[13px]">
                      <span className="tabular-nums" style={{ ...Serif, color: FOREST }} dir="ltr">₪{s.price}</span>
                      <span className="ms-2" style={{ color: MUTED }}>· נמכר</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ═══ seller moment: restrained cream card on white band ═══ */}
      <section id="v7-sell" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-14 items-center" style={{ background: CREAM, border: `1px solid ${LINE}` }}>
            <div>
              <h2 className="text-balance" style={{ ...Serif, fontWeight: 300, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', lineHeight: 1.2, color: INK }}>
                חושבים למכור? נתחיל בשיחה שקטה
              </h2>
              <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.75]" style={{ color: MUTED }}>
                בלי שלט ובלי התחייבות — פגישת הערכה בנכס, סקירת עסקאות אמת מהרחובות הסמוכים והמלצה כנה אם זה הזמן הנכון למכור.
              </p>
              <p className="mt-3 text-[13.5px]" style={{ color: MUTED }}>
                עונים בדרך כלל תוך שעה בימי א׳–ה׳, 9:00–19:00 · סיורי הערכה מתואמים גם בערב
              </p>
            </div>
            {phone && telHref && (
              <div className="flex flex-col items-start md:items-center gap-3 shrink-0">
                <a
                  href={telHref}
                  className="inline-flex items-center px-8 py-3.5 text-[15px] transition-opacity hover:opacity-90"
                  style={{ background: FOREST, color: CREAM, fontWeight: 600 }}
                >
                  לתיאום שיחה — <span dir="ltr">&nbsp;{phone}</span>
                </a>
                {waHref && (
                  <a
                    href={waHref} target="_blank" rel="noopener"
                    className="text-[13.5px] underline underline-offset-4 hover:opacity-80 transition-opacity"
                    style={{ color: FOREST }}
                  >
                    או כתבו לנו ב־WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
