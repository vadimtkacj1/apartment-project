import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';

/* V4 "Residence" homepage — Samara reference: parchment canvas, whisper-light
   display headline, sunlit photo band, quiet white cards, sky-blue actions.
   Structure: hero+search → asymmetric featured composition → rent list rows →
   neighborhood text index → recently-sold proof → seller side card. */

export const revalidate = 60;

const SKY = '#0096f7';
const SAND = '#f5f2de';
const SHADOW = 'rgba(0,0,0,0.12) 0px 0.5px 2px 0px';

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

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

const NewBadge: React.FC = () => (
  <span
    className="absolute top-3 rounded-lg px-2.5 py-1 text-[12px] bg-white"
    style={{ insetInlineStart: '0.75rem', fontWeight: 600, color: SKY, boxShadow: SHADOW }}
  >
    חדש
  </span>
);

const Card: React.FC<{ p: Prop; priority?: boolean }> = ({ p, priority }) => (
  <Link
    href={`/apartments/${p.id}`}
    className="group block bg-white rounded-xl overflow-hidden transition-shadow"
    style={{ boxShadow: SHADOW }}
  >
    <div className="relative aspect-[4/3] overflow-hidden" style={{ background: '#eceadf' }}>
      <Image
        src={p.image} alt={p.title} fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        {...(priority ? { priority: true } : { loading: 'lazy' as const })}
      />
      {p.isNew && <NewBadge />}
    </div>
    <div className="p-5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[16px] truncate" style={{ fontWeight: 600 }}>{p.title}</span>
        <span className="shrink-0 text-[15px] tabular-nums" style={{ fontWeight: 600, color: SKY }} dir="ltr">₪{p.price}</span>
      </div>
      <div className="mt-1 text-[13.5px]" style={{ color: '#666' }}>
        {p.location}{p.neighborhood ? ` · ${p.neighborhood}` : ''}
      </div>
      <div className="mt-2.5 pt-2.5 text-[13px]" style={{ borderTop: '1px solid rgba(0,0,0,0.07)', color: '#666' }}>
        {[p.rooms && `${p.rooms} חדרים`, p.area && `${p.area} מ״ר`, p.dealType === 'rent' ? 'להשכרה' : 'למכירה'].filter(Boolean).join(' · ')}
      </div>
    </div>
  </Link>
);

/* Wide featured listing — 16:9, spans two grid columns, white fact plaque
   overlaid at the bottom-start corner. */
const FeaturedCard: React.FC<{ p: Prop }> = ({ p }) => (
  <Link
    href={`/apartments/${p.id}`}
    className="group relative block sm:col-span-2 rounded-xl overflow-hidden"
    style={{ boxShadow: SHADOW }}
  >
    <div className="relative aspect-[4/3] sm:aspect-[16/9]" style={{ background: '#eceadf' }}>
      <Image
        src={p.image} alt={p.title} fill priority
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 92vw, 62vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
      {p.isNew && <NewBadge />}
    </div>
    <div
      className="absolute bottom-3 sm:bottom-4 bg-white rounded-xl px-4 py-3.5 sm:px-5 sm:py-4 max-w-[85%]"
      style={{ insetInlineStart: '0.75rem', boxShadow: 'rgba(0,0,0,0.18) 0px 1px 4px 0px' }}
    >
      <div className="text-[17px] tabular-nums" style={{ fontWeight: 600, color: SKY }} dir="ltr">₪{p.price}</div>
      <div className="mt-0.5 text-[15px] truncate" style={{ fontWeight: 600 }}>{p.title}</div>
      <div className="mt-0.5 text-[13px]" style={{ color: '#666' }}>
        {[p.location, p.rooms && `${p.rooms} חדרים`, p.area && `${p.area} מ״ר`].filter(Boolean).join(' · ')}
      </div>
    </div>
  </Link>
);

export default async function V4Page() {
  const now = Date.now();
  const [saleRaw, rentRaw, owner, totalActive, saleCount, rentCount, hoodGroups, soldRaw] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isSold: false, OR: [{ dealType: 'sale' }, { category: 'sales' }] },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 5,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, dealType: true, category: true, images: true, createdAt: true },
    }),
    prisma.property.findMany({
      where: { isActive: true, isSold: false, OR: [{ dealType: 'rent' }, { category: 'rentals' }] },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 4,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, dealType: true, category: true, images: true, createdAt: true },
    }),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } }).catch(() => null),
    prisma.property.count({ where: { isActive: true, isSold: false } }),
    prisma.property.count({ where: { isActive: true, isSold: false, OR: [{ dealType: 'sale' }, { category: 'sales' }] } }),
    prisma.property.count({ where: { isActive: true, isSold: false, OR: [{ dealType: 'rent' }, { category: 'rentals' }] } }),
    prisma.property.groupBy({
      by: ['city', 'neighborhood'],
      where: { isActive: true, isSold: false, neighborhood: { not: null } },
      _count: true,
    }),
    prisma.property.findMany({
      where: { isSold: true },
      orderBy: { updatedAt: 'desc' }, take: 3,
      select: { id: true, title: true, location: true, rooms: true, images: true },
    }),
  ]);

  const map = (p: (typeof saleRaw)[number]): Prop => ({
    id: p.id, title: p.title, location: p.location, neighborhood: p.neighborhood,
    price: p.price, rooms: p.rooms, area: p.area,
    dealType: p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale',
    image: firstImage(p.images),
    isNew: now - p.createdAt.getTime() < NEW_WINDOW_MS,
  });
  const sale = saleRaw.map(map);
  const rent = rentRaw.map(map);
  const featured = sale[0];
  const saleRest = sale.slice(1);
  const phone = owner?.phone ?? null;
  const hoods = [...hoodGroups]
    .sort((a, b) => (b._count as number) - (a._count as number))
    .slice(0, 6);
  const sold = soldRaw.map((p) => ({ ...p, image: firstImage(p.images) }));

  return (
    <div dir="rtl">

      {/* ═══ hero: whisper-light display + search bar + sunlit photo band ═══ */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-10 pt-14 md:pt-20">
        <h1
          className="text-balance"
          style={{ fontWeight: 200, fontSize: 'clamp(2.6rem, 6.5vw, 5.5rem)', lineHeight: 1.02, letterSpacing: '-0.035em' }}
        >
          דירה שטוב לחיות בה,
          <br />
          לא רק לראות בתמונות
        </h1>
        <p className="mt-6 max-w-[54ch] text-[16.5px] leading-[1.7]" style={{ color: '#666' }}>
          {totalActive} נכסים פעילים כרגע בחולון, בת ים והסביבה.
          מתאמים סיור תוך יום, ועונים לרוב בתוך שעה בימי א׳–ה׳.
        </p>

        {/* rectangular search — 12px radius, quiet border, sky action */}
        <form action="/apartments" method="GET" className="mt-9 flex flex-col sm:flex-row gap-2.5 max-w-[620px]">
          <select
            name="dealType" defaultValue="sale" aria-label="סוג עסקה"
            className="h-[52px] px-4 rounded-xl bg-white text-[15px] focus:outline-none cursor-pointer sm:w-[150px]"
            style={{ border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <option value="sale">לקנייה</option>
            <option value="rent">להשכרה</option>
          </select>
          <select
            name="city" defaultValue="holon" aria-label="עיר"
            className="h-[52px] px-4 rounded-xl bg-white text-[15px] focus:outline-none cursor-pointer flex-1"
            style={{ border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <option value="holon">חולון</option><option value="batyam">בת ים</option>
            <option value="rishon">ראשון לציון</option><option value="telaviv">תל אביב</option>
            <option value="ramat-gan">רמת גן</option><option value="givatayim">גבעתיים</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-xl text-white text-[15px] transition-opacity hover:opacity-85"
            style={{ background: SKY, fontWeight: 600 }}
          >
            <Search size={17} aria-hidden="true" />
            חיפוש
          </button>
        </form>

        <div className="relative mt-12 aspect-[21/9] rounded-[18px] overflow-hidden" style={{ boxShadow: 'rgba(0,0,0,0.2) 0px 2px 4px 0px' }}>
          <Image src="/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" style={{ filter: 'brightness(1.02) saturate(1.02)' }} />
        </div>
      </section>

      {/* ═══ sale: one wide featured listing + four standard cards ═══ */}
      {featured && (
        <section id="v4-sale" className="max-w-[1280px] mx-auto px-6 md:px-10 pt-20 md:pt-24">
          <div className="flex items-end justify-between gap-6 mb-7">
            <div>
              <h2 style={{ fontWeight: 300, fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                למכירה
              </h2>
              <div className="mt-1.5 text-[14px]" style={{ color: '#999' }}>{saleCount} נכסים פעילים</div>
            </div>
            <Link href="/apartments?dealType=sale" className="group inline-flex items-center gap-1.5 text-[14.5px] shrink-0" style={{ color: SKY, fontWeight: 600 }}>
              כל הנכסים למכירה
              <ArrowLeft size={15} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeaturedCard p={featured} />
            {saleRest.map((p, i) => <Card key={p.id} p={p} priority={i === 0} />)}
          </div>
        </section>
      )}

      {/* ═══ rent: quiet list rows, hairline separated ═══ */}
      {rent.length > 0 && (
        <section id="v4-rent" className="max-w-[1280px] mx-auto px-6 md:px-10 pt-16 md:pt-20">
          <div className="flex items-end justify-between gap-6 mb-4">
            <div>
              <h2 style={{ fontWeight: 300, fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                להשכרה
              </h2>
              <div className="mt-1.5 text-[14px]" style={{ color: '#999' }}>{rentCount} נכסים פעילים</div>
            </div>
            <Link href="/apartments?dealType=rent" className="group inline-flex items-center gap-1.5 text-[14.5px] shrink-0" style={{ color: SKY, fontWeight: 600 }}>
              לכל ההשכרות
              <ArrowLeft size={15} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: SHADOW }}>
            {rent.map((p, i) => (
              <Link
                key={p.id}
                href={`/apartments/${p.id}`}
                className="flex items-center gap-4 sm:gap-5 px-4 sm:px-5 py-4 hover:bg-black/[0.025] transition-colors"
                style={i > 0 ? { borderTop: '1px solid rgba(0,0,0,0.07)' } : undefined}
              >
                <div className="relative w-[92px] h-[64px] sm:w-[120px] sm:h-[80px] shrink-0 rounded-lg overflow-hidden" style={{ background: '#eceadf' }}>
                  <Image src={p.image} alt={p.title} fill sizes="120px" loading="lazy" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] truncate" style={{ fontWeight: 600 }}>{p.title}</span>
                    {p.isNew && (
                      <span className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px]" style={{ background: 'rgba(0,150,247,0.1)', color: SKY, fontWeight: 600 }}>
                        חדש
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[13px] truncate" style={{ color: '#666' }}>
                    {[p.location, p.neighborhood, p.rooms && `${p.rooms} חדרים`, p.area && `${p.area} מ״ר`].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <span className="shrink-0 text-[15px] tabular-nums" style={{ fontWeight: 600, color: SKY }} dir="ltr">₪{p.price}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ neighborhoods: plain text index with live counts ═══ */}
      {hoods.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 pt-16 md:pt-20">
          <h2 className="mb-5" style={{ fontWeight: 300, fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            נכסים לפי שכונה
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 max-w-[640px]">
            {hoods.map((g) => (
              <li key={`${g.city}-${g.neighborhood}`} style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                <Link
                  href={`/apartments?city=${encodeURIComponent(g.city)}`}
                  className="flex items-baseline justify-between gap-4 py-2.5 text-[14.5px] hover:opacity-60 transition-opacity"
                  style={{ color: '#333' }}
                >
                  <span>{g.neighborhood}</span>
                  <span className="tabular-nums" style={{ color: '#999' }}>{g._count as number}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ═══ recently sold: small grayscale proof row ═══ */}
      {sold.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 pt-16 md:pt-20">
          <h2 className="mb-5" style={{ fontWeight: 300, fontSize: 'clamp(1.4rem, 2.6vw, 1.9rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            נמכר לאחרונה
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {sold.map((p) => (
              <div key={p.id} className="flex items-center gap-3.5">
                <div className="relative w-[76px] h-[56px] shrink-0 rounded-lg overflow-hidden" style={{ background: '#eceadf' }}>
                  <Image src={p.image} alt="" fill sizes="76px" loading="lazy" className="object-cover" style={{ filter: 'grayscale(1) brightness(1.04)' }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] truncate" style={{ fontWeight: 600, color: '#333' }}>{p.title}</div>
                  <div className="mt-0.5 text-[12.5px]" style={{ color: '#999' }}>
                    {[p.location, p.rooms && `${p.rooms} חדרים`].filter(Boolean).join(' · ')} · נמכר
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ seller moment: short paragraph + warm-sand side card ═══ */}
      <section id="v4-sell" className="max-w-[1280px] mx-auto px-6 md:px-10 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-start">
          <div className="max-w-[58ch]">
            <h2 style={{ fontWeight: 300, fontSize: 'clamp(1.8rem, 3.6vw, 2.7rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              לפני שמפרסמים מודעה, כדאי לדעת מה הדירה באמת שווה
            </h2>
            <p className="mt-5 text-[16px] leading-[1.75]" style={{ color: '#666' }}>
              מחיר שיווקי גבוה מדי משאיר דירה חודשים בלוחות. נמוך מדי — ואיבדתם כסף.
              אנחנו בונים את ההערכה מעסקאות סגורות באזור שלכם, לא ממודעות שעדיין מחכות לקונה.
              אחרי ההערכה תקבלו מסמך מסודר, וההחלטה נשארת אצלכם.
            </p>
          </div>
          <div className="rounded-[18px] p-7 sm:p-8" style={{ background: SAND, boxShadow: SHADOW }}>
            <div className="text-[18px]" style={{ fontWeight: 600 }}>הערכת שווי ללא עלות</div>
            <p className="mt-2 text-[14px] leading-[1.65]" style={{ color: '#666' }}>
              שיחה קצרה, ביקור בנכס אם צריך — סיורי הערכה מתקיימים גם בשעות הערב.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white text-[15px] transition-opacity hover:opacity-85"
                  style={{ background: SKY, fontWeight: 600 }}
                >
                  התקשרו — <span dir="ltr">&nbsp;{phone}</span>
                </a>
              )}
              {phone && (
                <a
                  href={`https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '972')}`}
                  target="_blank" rel="noopener"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-[15px] bg-white transition-colors hover:bg-black/5"
                  style={{ color: '#000', fontWeight: 600, border: '1px solid rgba(0,0,0,0.08)' }}
                >
                  לכתוב ב־WhatsApp
                </a>
              )}
            </div>
            <div className="mt-4 text-[12.5px]" style={{ color: '#999' }}>ללא התחייבות מצדכם</div>
          </div>
        </div>
      </section>
    </div>
  );
}
