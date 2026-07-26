import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, KeyRound, Home as HomeIcon, MapPin } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { INK, SLATE, LINE, FOG, CORAL, GREEN, TILE_SLATE, TILE_GREEN, CITIES, firstImage, toV8, TCard, type V8Prop } from './ui';

/* V8 "Trulia" homepage — faithful RTL port of trulia.com's home:
   photo hero + segmented tabs + search bar with coral trigger →
   explore-mosaic (neighborhood photo cards + resident-quote tiles) →
   three-door help section with green CTAs → neighborhood search →
   (deep footer lives in layout). All numbers live from the DB. */

export const revalidate = 60;

export default async function V8Page() {
  const activeWhere = { isActive: true, isSold: false } as const;
  const [latestRaw, hoods, owner] = await Promise.all([
    prisma.property.findMany({
      where: activeWhere,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 4,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, bathrooms: true, area: true, floor: true, dealType: true, category: true, images: true, isPinned: true, createdAt: true },
    }),
    prisma.property.groupBy({
      by: ['neighborhood', 'city'],
      where: { ...activeWhere, neighborhood: { not: null } },
      _count: true,
    }),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } }).catch(() => null),
  ]);

  const latest: V8Prop[] = latestRaw.map(toV8);
  const phone = owner?.phone ?? null;

  // top neighborhoods with a representative photo pulled from their own listings
  const topHoods = hoods.filter((h) => h.neighborhood).sort((a, b) => b._count - a._count).slice(0, 4);
  const hoodCards = await Promise.all(topHoods.map(async (h) => {
    const rep = await prisma.property.findFirst({
      where: { ...activeWhere, neighborhood: h.neighborhood },
      orderBy: { createdAt: 'desc' },
      select: { images: true },
    });
    return { name: h.neighborhood as string, city: h.city, count: h._count, image: firstImage(rep?.images) };
  }));

  return (
    <div dir="rtl">

      {/* ═══ hero: photo + centered headline + segmented tabs + search ═══ */}
      <section className="px-2.5 pt-2.5">
        <div className="relative rounded-lg overflow-hidden" style={{ minHeight: 420 }}>
          <Image src="/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'rgba(20,24,30,0.32)' }} />
          <div className="relative z-10 flex flex-col items-center px-5 pt-20 pb-24 text-center">
            <h1 className="text-white font-extrabold" style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3rem)', lineHeight: 1.2, textShadow: '0 1px 12px rgba(0,0,0,0.35)' }}>
              מצאו מקום
              <br />
              שתאהבו לגור בו
            </h1>

            {/* segmented tabs + search bar (native GET form) */}
            <form action="/v8/apartments" method="GET" className="mt-7 w-full max-w-[480px]">
              <div className="flex justify-center gap-1 mb-0" role="tablist" aria-label="סוג עסקה">
                {([['sale', 'לקנייה'], ['rent', 'להשכרה']] as const).map(([v, l], i) => (
                  <label key={v} className="cursor-pointer">
                    <input type="radio" name="dealType" value={v} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="inline-flex px-5 py-2 rounded-t-md text-[14.5px] font-bold text-white bg-[rgba(20,24,30,0.35)] peer-checked:bg-white peer-checked:text-[#2A2A33] transition-colors">
                      {l}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex bg-white rounded-md overflow-hidden" style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.25)' }}>
                <select
                  name="city" defaultValue="holon" aria-label="עיר"
                  className="flex-1 h-[54px] ps-4 pe-2 text-[15.5px] font-semibold focus:outline-none cursor-pointer bg-white"
                  style={{ color: INK, borderInlineEnd: '1px solid #E8E7EA' }}
                >
                  {CITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <button
                  type="submit"
                  aria-label="חיפוש"
                  className="inline-flex items-center justify-center w-[58px] transition-[filter] hover:brightness-95"
                  style={{ background: CORAL }}
                >
                  <Search size={20} className="text-white" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ═══ explore mosaic: neighborhood photo cards + resident quotes ═══ */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 pt-16 pb-6 text-center">
        <h2 className="text-[26px] md:text-[30px] font-extrabold" style={{ color: INK }}>גלו את השכונות שלנו</h2>
        <p className="mt-2 text-[15px] max-w-[62ch] mx-auto" style={{ color: SLATE }}>
          צלילה לשכונות של חולון והסביבה — תמונות אמיתיות מהנכסים שלנו, מספרים חיים מהמאגר, וחוות דעת של לקוחות.
        </p>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3 text-start">
          {hoodCards.slice(0, 2).map((h) => (
            <Link key={h.name} href={`/v8/apartments?city=${h.city}`} className="group relative rounded-lg overflow-hidden aspect-[4/3]" style={{ background: FOG }}>
              <Image src={h.image} alt={h.name} fill sizes="(max-width:1024px) 46vw, 30vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)' }} />
              <span className="absolute top-3 inset-inline-start-3.5 text-white font-extrabold text-[17px]" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>{h.name}</span>
              <span className="absolute bottom-3 inset-inline-start-3.5 bg-white/95 rounded px-3 py-1.5 text-[12.5px] font-bold" style={{ color: INK }}>
                {h.count} נכסים ←
              </span>
            </Link>
          ))}

          {/* resident-quote tile (slate) — real testimonial from the site data */}
          <div className="rounded-lg p-6 flex flex-col justify-center aspect-[4/3]" style={{ background: TILE_SLATE }}>
            <div>
              <div className="text-white/70 text-[12px] font-bold mb-2">מיכל דרור · ליווי עסקה בחולון</div>
              <p className="text-white text-[14.5px] leading-relaxed">
                ״עברנו כמה מתווכים לפניו — ההבדל היה משמעותי. סדר, ארגון ותחושת ביטחון מהרגע הראשון.״
              </p>
            </div>
          </div>

          {hoodCards.slice(2, 4).map((h) => (
            <Link key={h.name} href={`/v8/apartments?city=${h.city}`} className="group relative rounded-lg overflow-hidden aspect-[4/3]" style={{ background: FOG }}>
              <Image src={h.image} alt={h.name} fill sizes="(max-width:1024px) 46vw, 30vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)' }} />
              <span className="absolute top-3 inset-inline-start-3.5 text-white font-extrabold text-[17px]" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>{h.name}</span>
              <span className="absolute bottom-3 inset-inline-start-3.5 bg-white/95 rounded px-3 py-1.5 text-[12.5px] font-bold" style={{ color: INK }}>
                {h.count} נכסים ←
              </span>
            </Link>
          ))}

          {/* resident-quote tile (green) */}
          <div className="rounded-lg p-6 flex flex-col justify-center aspect-[4/3]" style={{ background: TILE_GREEN }}>
            <div>
              <div className="text-white/70 text-[12px] font-bold mb-2">גל סער · מכירת דירה בחולון</div>
              <p className="text-white text-[14.5px] leading-relaxed">
                ״ניהול משא ומתן חכם והוגן לשני הצדדים. עובדים עם אדם ישר שמכבד גם את המוכרים וגם את הקונים.״
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ latest listings row ═══ */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-8 py-12">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <h2 className="text-[22px] font-extrabold" style={{ color: INK }}>חדשים במאגר</h2>
          <Link href="/v8/apartments" className="text-[14px] font-bold hover:underline underline-offset-4" style={{ color: GREEN }}>
            לכל הנכסים ←
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {latest.map((p, i) => <TCard key={p.id} p={p} priority={i < 4} />)}
        </div>
      </section>

      {/* ═══ three-door help section ═══ */}
      <section className="max-w-[1100px] mx-auto px-5 md:px-8 py-14 text-center">
        <h2 className="text-[26px] md:text-[30px] font-extrabold mb-10" style={{ color: INK }}>איך Aiterra עוזרת לכם</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center">
            <span className="flex items-center justify-center size-14 rounded-2xl mb-4" style={{ background: '#FDE8E6' }} aria-hidden="true">
              <HomeIcon size={26} style={{ color: CORAL }} />
            </span>
            <h3 className="text-[17px] font-extrabold" style={{ color: INK }}>קונים דירה</h3>
            <p className="mt-2 text-[14px] leading-relaxed max-w-[34ch]" style={{ color: SLATE }}>
              כולל נכסים בבלעדיות שלא מפורסמים בשום מקום אחר, בדיקות מקדימות וליווי עד החתימה אצל עורך הדין.
            </p>
            <Link href="/v8/apartments?dealType=sale" className="mt-5 inline-flex px-6 py-2.5 rounded-lg text-white text-[14px] font-bold transition-[filter] hover:brightness-110" style={{ background: GREEN }}>
              לדירות למכירה
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center justify-center size-14 rounded-2xl mb-4" style={{ background: '#EFE9FA' }} aria-hidden="true">
              <KeyRound size={26} style={{ color: '#8D7BC6' }} />
            </span>
            <h3 className="text-[17px] font-extrabold" style={{ color: INK }}>שוכרים דירה</h3>
            <p className="mt-2 text-[14px] leading-relaxed max-w-[34ch]" style={{ color: SLATE }}>
              דירות בדוקות עם חוזים מסודרים. מתאמים סיורים גם בשעות הערב, בתיאום מראש.
            </p>
            <Link href="/v8/apartments?dealType=rent" className="mt-5 inline-flex px-6 py-2.5 rounded-lg text-white text-[14px] font-bold transition-[filter] hover:brightness-110" style={{ background: GREEN }}>
              לדירות להשכרה
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <span className="flex items-center justify-center size-14 rounded-2xl mb-4" style={{ background: '#E3F1EA' }} aria-hidden="true">
              <MapPin size={26} style={{ color: TILE_GREEN }} />
            </span>
            <h3 className="text-[17px] font-extrabold" style={{ color: INK }}>מוכרים נכס</h3>
            <p className="mt-2 text-[14px] leading-relaxed max-w-[34ch]" style={{ color: SLATE }}>
              הערכת שווי לפי עסקאות שנסגרו ברחובות שלכם — בלי עלות. עונים בדרך כלל בתוך שעה, בימי א׳–ה׳.
            </p>
            {phone && (
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="mt-5 inline-flex px-6 py-2.5 rounded-lg text-white text-[14px] font-bold transition-[filter] hover:brightness-110" style={{ background: GREEN }}>
                לתיאום שיחה
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ═══ neighborhood quick search ═══ */}
      <section className="max-w-[640px] mx-auto px-5 pb-16 text-center">
        <h2 className="text-[19px] font-extrabold mb-4" style={{ color: INK }}>בדקו שכונה</h2>
        <form action="/v8/apartments" method="GET" className="flex rounded-md overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
          <select name="city" defaultValue="" aria-label="בחרו עיר" className="flex-1 h-[50px] px-4 text-[14.5px] font-semibold focus:outline-none cursor-pointer bg-white" style={{ color: SLATE }}>
            <option value="">כל הערים — חולון, בת ים, המרכז…</option>
            {CITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button type="submit" aria-label="חיפוש" className="inline-flex items-center justify-center w-[54px] transition-[filter] hover:brightness-95" style={{ background: CORAL }}>
            <Search size={18} className="text-white" aria-hidden="true" />
          </button>
        </form>
      </section>
    </div>
  );
}
