import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, Handshake, KeySquare, BadgeCheck, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { ICE, NAVY, BLUE, INKV, SLATEV, CITIES, toV9, RoomCard, SectionHead, Pill, type V9Prop } from './ui';

/* V9 "Resort" homepage — Kinsley anatomy, Aiterra content:
   photo hero (stars → headline → booking-style search bar) → feature chips
   overlapping → staggered split panels → centered band → listings carousel →
   3 neighborhood cards with white plates → testimonial → guide cards. */

export const revalidate = 60;

const GUIDES = [
  { href: '/articles/mortgage-guide', title: 'מדריך משכנתא מלא למתחילים', text: 'כמה הון עצמי באמת צריך, איך משווים מסלולים ומה הבנק לא מספר.' },
  { href: '/articles/pre-purchase-checklist', title: 'צ׳קליסט בדיקות לפני קנייה', text: 'הבדיקות שחוסכות מאות אלפי שקלים — מהטאבו ועד המהנדס.' },
  { href: '/articles/holon-neighborhoods', title: 'שכונות חולון — סקירה מלאה', text: 'איפה כדאי לגור, מה המחירים ולאן העיר מתפתחת.' },
];

export default async function V9Page() {
  const [latestRaw, hoods, owner] = await Promise.all([
    prisma.property.findMany({
      where: { isActive: true, isSold: false },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], take: 6,
      select: { id: true, title: true, location: true, neighborhood: true, price: true, rooms: true, area: true, dealType: true, category: true, images: true },
    }),
    prisma.property.groupBy({
      by: ['neighborhood', 'city'],
      where: { isActive: true, isSold: false, neighborhood: { not: null } },
      _count: true,
    }).catch(() => []),
    prisma.owner.findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } }).catch(() => null),
  ]);
  const latest: V9Prop[] = latestRaw.map(toV9);
  const phone = owner?.phone ?? null;

  const topHoods = (hoods as Array<{ neighborhood: string | null; city: string; _count: number }>)
    .filter((h) => h.neighborhood).sort((a, b) => b._count - a._count).slice(0, 3);
  const HOOD_IMAGES = ['/images/v9/street.jpg', '/images/v9/park.jpg', '/images/v9/balcony.jpg'];
  const hoodCards = topHoods.map((h, i) => ({
    name: h.neighborhood as string, city: h.city, count: h._count,
    image: HOOD_IMAGES[i % HOOD_IMAGES.length],
  }));

  const FEATURES = [
    { icon: Handshake, label: 'ליווי אישי של המייסדים' },
    { icon: KeySquare, label: 'נכסים בבלעדיות' },
    { icon: BadgeCheck, label: 'הערכת שווי חינם' },
    { icon: ShieldCheck, label: 'מלווים עסקאות מאז 2002' },
  ];

  return (
    <div dir="rtl">

      {/* ═══ hero: photo + stars + headline + booking-style search bar ═══ */}
      <section className="relative" style={{ background: NAVY }}>
        <div className="relative overflow-hidden" style={{ minHeight: 560 }}>
          <Image src="/images/v9/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover" style={{ opacity: 0.8 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(23,26,45,0.45) 0%, rgba(23,26,45,0.25) 50%, rgba(23,26,45,0.55) 100%)' }} />
          <div className="relative z-10 flex flex-col items-center text-center px-5 pt-24 pb-32">
            <div className="flex gap-1" aria-label="דירוג 5 כוכבים בגוגל">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </div>
            <h1 className="mt-4 text-white font-semibold" style={{ fontSize: 'clamp(2.4rem, 5.4vw, 4.9rem)', lineHeight: 1.1 }}>
              ברוכים הבאים הביתה
            </h1>
            <p className="mt-3 text-[15px] text-white/80 max-w-[52ch]">
              דירות למכירה ולהשכרה בחולון, בת ים והמרכז — עם ליווי אישי עד המפתח.
            </p>

            {/* booking-style bar: labeled selects + circular blue trigger */}
            <form
              action="/v9/apartments"
              method="GET"
              className="mt-9 w-full max-w-[620px] flex items-stretch rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.97)', boxShadow: '0 16px 44px -14px rgba(23,26,45,0.6)' }}
            >
              <label className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 py-3 ps-6 pe-4 text-start">
                <span className="text-[11px] font-bold" style={{ color: SLATEV }}>סוג עסקה</span>
                <select name="dealType" defaultValue="sale" className="bg-transparent text-[14px] font-semibold focus:outline-none cursor-pointer" style={{ color: INKV }}>
                  <option value="sale">לקנייה</option>
                  <option value="rent">להשכרה</option>
                </select>
              </label>
              <span aria-hidden="true" className="self-center h-9 w-px" style={{ background: '#E3EDED' }} />
              <label className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 py-3 ps-5 pe-4 text-start">
                <span className="text-[11px] font-bold" style={{ color: SLATEV }}>עיר</span>
                <select name="city" defaultValue="holon" className="bg-transparent text-[14px] font-semibold focus:outline-none cursor-pointer" style={{ color: INKV }}>
                  <option value="">כל הערים</option>
                  {CITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <div className="flex items-center pe-2.5">
                <button
                  type="submit"
                  aria-label="חיפוש נכסים"
                  className="inline-flex items-center justify-center size-11 rounded-full text-white transition-[filter] hover:brightness-110"
                  style={{ background: BLUE }}
                >
                  <Search size={18} aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* feature chips overlapping the hero bottom */}
        <div className="relative z-20 max-w-[1180px] mx-auto px-5 md:px-8 -mt-14 pb-2">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="bg-white rounded-xl px-4 py-5 text-center" style={{ boxShadow: '0 12px 30px -14px rgba(23,26,45,0.28)' }}>
                <Icon size={26} aria-hidden="true" className="mx-auto" style={{ color: BLUE }} strokeWidth={1.6} />
                <div className="mt-2.5 text-[13px] font-semibold" style={{ color: INKV }}>{label}</div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ staggered split panels ═══ */}
      <section className="max-w-[1180px] mx-auto px-5 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[16/11] rounded-2xl overflow-hidden" style={{ boxShadow: '0 14px 34px -16px rgba(23,26,45,0.3)' }}>
            <Image src="/images/v9/building.jpg" alt="" fill sizes="(max-width:768px) 92vw, 46vw" className="object-cover" loading="lazy" />
          </div>
          <div className="md:ps-6">
            <h2 className="text-[28px] md:text-[36px] font-semibold" style={{ color: INKV, lineHeight: 1.2 }}>
              24 שנות ניסיון,
              <br />
              רחוב אחרי רחוב
            </h2>
            <p className="mt-4 text-[14.5px] leading-[1.8] max-w-[48ch]" style={{ color: SLATEV }}>
              דניאל שרון ויואב אלמוג מלווים משפחות בחולון והסביבה מאז 2002 — מהערכת שווי מדויקת לפי עסקאות אמת, דרך צילום ושיווק, ועד החתימה אצל עורך הדין.
            </p>
            <div className="mt-6"><Pill href="/about">להכיר את המשרד</Pill></div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="md:order-2 relative aspect-[16/11] rounded-2xl overflow-hidden" style={{ boxShadow: '0 14px 34px -16px rgba(23,26,45,0.3)' }}>
            <Image src="/images/v9/keys.jpg" alt="" fill sizes="(max-width:768px) 92vw, 46vw" className="object-cover" loading="lazy" />
          </div>
          <div className="md:order-1 md:pe-6">
            <h2 className="text-[28px] md:text-[36px] font-semibold" style={{ color: INKV, lineHeight: 1.2 }}>
              מוכרים דירה?
              <br />
              נתחיל בהערכת שווי
            </h2>
            <p className="mt-4 text-[14.5px] leading-[1.8] max-w-[48ch]" style={{ color: SLATEV }}>
              הערכה לפי עסקאות שנסגרו ברחובות שלכם — בלי עלות ובלי התחייבות. עונים בדרך כלל בתוך שעה, בימי א׳–ה׳.
            </p>
            {phone && (
              <div className="mt-6">
                <Pill href={`tel:${phone.replace(/[^0-9+]/g, '')}`}>לתיאום שיחה</Pill>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ listings ═══ */}
      <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-14">
        <SectionHead title="הנכסים החמים שלנו" sub="נבחרת הנכסים הפעילים במאגר — מתעדכן כל יום." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.slice(0, 6).map((p, i) => <RoomCard key={p.id} p={p} priority={i < 3} />)}
        </div>
        <div className="mt-9 text-center">
          <Pill href="/v9/apartments" ghost>לכל הנכסים</Pill>
        </div>
      </section>

      {/* ═══ neighborhoods: 3 photo cards with white plates ═══ */}
      {hoodCards.length > 0 && (
        <section className="max-w-[1180px] mx-auto px-5 md:px-8 py-10">
          <SectionHead title="השכונות שלנו" sub="איפה אנחנו הכי חזקים — לפי הנכסים הפעילים במאגר עכשיו." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {hoodCards.map((h) => (
              <Link key={h.name} href={`/v9/apartments?city=${h.city}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4]" style={{ boxShadow: '0 14px 34px -16px rgba(23,26,45,0.3)' }}>
                <Image src={h.image} alt={h.name} fill sizes="(max-width:640px) 92vw, 30vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
                <span className="absolute top-3 inset-inline-start-3 rounded-full px-3 py-1 text-[11.5px] font-bold text-white" style={{ background: BLUE }}>
                  {h.count} נכסים
                </span>
                <span className="absolute bottom-4 inset-inline-start-1/2 translate-x-1/2 bg-white rounded-lg px-6 py-2.5 text-[14.5px] font-semibold whitespace-nowrap" style={{ color: INKV, boxShadow: '0 8px 20px -8px rgba(23,26,45,0.4)' }}>
                  {h.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ testimonial ═══ */}
      <section className="max-w-[760px] mx-auto px-5 py-14 text-center">
        <SectionHead title="מה הלקוחות מספרים" />
        <div className="flex justify-center gap-1 mb-4" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} className="fill-amber-400 text-amber-400" />)}
        </div>
        <blockquote className="text-[17px] leading-[1.8]" style={{ color: INKV }}>
          ״עברנו כמה מתווכים לפניו — ההבדל היה משמעותי. סדר, ארגון ותחושת ביטחון מהרגע הראשון.״
        </blockquote>
        <div className="mt-3 text-[13px] font-semibold" style={{ color: SLATEV }}>מיכל דרור · ליווי עסקה בחולון</div>
      </section>

      {/* ═══ guide cards (blog anatomy) ═══ */}
      <section className="max-w-[1180px] mx-auto px-5 md:px-8 pb-20">
        <SectionHead title="מדריכים שכדאי לקרוא" sub="הידע שחוסך כסף אמיתי בקנייה ובמכירה — מהצוות שלנו." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDES.map((g) => (
            <a key={g.href} href={g.href} className="group bg-white rounded-2xl p-6 transition-transform hover:-translate-y-1 duration-300" style={{ boxShadow: '0 10px 30px -12px rgba(23,26,45,0.18)' }}>
              <h3 className="text-[16.5px] font-semibold" style={{ color: INKV }}>{g.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: SLATEV }}>{g.text}</p>
              <span className="mt-4 inline-block text-[13.5px] font-semibold" style={{ color: BLUE }}>לקריאה ←</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
