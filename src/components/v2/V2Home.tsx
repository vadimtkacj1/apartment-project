import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Phone } from 'lucide-react';

/* ============================================================
   V2 — "Aiterra Editorial" alternative frontend (route /v2).
   Direction: dark monumental editorial — deep-navy canvas,
   light display type, caption-style chrome, sky accents.
   Structure is portal-grade, not brochure-grade: live counts,
   an editorial LIST of rows, neighborhood chips with counts,
   a sold-proof row, one paper interlude, huge-type finale,
   and a dense link band before the shared footer.
   Palette: ink #04102c, navy #051150, sky #5594F1, paper #FBFCFE.
   Server-rendered; no client JS, no motion gimmicks.
   ============================================================ */

export interface V2Property {
  id: number;
  title: string;
  location: string;
  neighborhood?: string | null;
  price: string;
  rooms?: string | null;
  area?: number | null;
  floor?: number | null;
  dealType: string;
  image: string;
  isNew: boolean;
}

export interface V2SoldItem {
  id: number;
  title: string;
  location: string;
  neighborhood?: string | null;
  image: string;
}

export interface V2Neighborhood {
  name: string;
  city: string; // slug for /apartments?city=
  count: number;
}

export interface V2Counts {
  total: number;
  sale: number;
  rent: number;
}

const INK = '#04102c';        // deepened Aiterra navy — the editorial canvas
const NAVY = '#051150';
const SKY = '#5594f1';
const PAPER = '#fbfcfe';

const DISPLAY: React.CSSProperties = {
  fontFamily: 'var(--font-caramel), sans-serif',
  fontWeight: 300,
};

/* ---------- shared bits ---------- */

const Label: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <span
    className="text-[12px] font-semibold tracking-[0.18em]"
    style={{ color: light ? 'rgba(251,252,254,0.55)' : 'rgba(4,16,44,0.55)' }}
  >
    {children}
  </span>
);

/* ---------- 1. Hero — full-bleed photo, location-first statement ---------- */

const V2Hero: React.FC<{ counts: V2Counts }> = ({ counts }) => (
  <section dir="rtl" className="relative w-full overflow-hidden" style={{ height: '92dvh', background: INK }}>
    <Image
      src="/hero-poster.jpg"
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover"
      style={{ filter: 'saturate(0.7) brightness(0.85)' }}
    />
    {/* icy navy tint + bottom scrim */}
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(4,16,44,0.35) 0%, rgba(4,16,44,0.15) 45%, rgba(4,16,44,0.92) 100%)' }} />

    {/* headline pinned to the lower edge, start-aligned */}
    <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-12 pb-12 md:pb-16">
      <h1
        className="text-white"
        style={{
          ...DISPLAY,
          fontSize: 'clamp(2.6rem, 8vw, 7rem)',
          lineHeight: 1.04,
          letterSpacing: '-0.02em',
          textWrap: 'balance',
          maxWidth: '16ch',
        }}
      >
        חולון. בת ים. המרכז.
      </h1>
      <p className="mt-4 text-[16px] md:text-lg max-w-[46ch]" style={{ color: 'rgba(251,252,254,0.75)' }}>
        תיווך למגורים בערים שאנחנו מכירים רחוב־רחוב.
      </p>
      {counts.total > 0 && (
        <p className="mt-3 text-[13.5px] font-semibold tabular-nums" style={{ color: 'rgba(251,252,254,0.55)' }}>
          {counts.total} נכסים פעילים במאגר
          {counts.sale > 0 ? ` · ${counts.sale} למכירה` : ''}
          {counts.rent > 0 ? ` · ${counts.rent} להשכרה` : ''}
        </p>
      )}
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Link
          href="/apartments"
          className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 font-bold text-base transition-[filter,transform] duration-200 hover:brightness-95 hover:-translate-y-0.5"
          style={{ background: PAPER, color: NAVY }}
        >
          לצפייה בנכסים
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
        <a
          href="#v2-contact"
          className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 font-semibold text-base text-white border transition-colors duration-200 hover:bg-white/10"
          style={{ borderColor: 'rgba(251,252,254,0.4)' }}
        >
          דברו איתנו
        </a>
      </div>
    </div>
  </section>
);

/* ---------- 2. Editorial list — rows, hairline separated ---------- */

const ListRow: React.FC<{ p: V2Property }> = ({ p }) => (
  <Link
    href={`/apartments/${p.id}`}
    className="group flex items-center gap-5 md:gap-7 py-5 md:py-6 border-b focus-visible:outline-2 focus-visible:outline-offset-4"
    style={{ borderColor: 'rgba(251,252,254,0.1)', outlineColor: SKY }}
  >
    <div className="relative shrink-0 w-28 md:w-44 aspect-[4/3] overflow-hidden" style={{ background: NAVY }}>
      <Image
        src={p.image}
        alt={p.title}
        fill
        sizes="(max-width: 768px) 112px, 176px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        loading="lazy"
      />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2.5">
        <span className="text-white font-bold text-[15.5px] md:text-lg leading-snug truncate transition-opacity group-hover:opacity-80">
          {p.title}
        </span>
        {p.isNew && (
          <span className="shrink-0 border px-2 py-0.5 text-[11px] font-bold" style={{ borderColor: SKY, color: SKY }}>
            חדש
          </span>
        )}
      </div>
      <div className="mt-1.5 text-[13px] truncate" style={{ color: 'rgba(251,252,254,0.55)' }}>
        {p.location}
        {p.neighborhood ? ` · ${p.neighborhood}` : ''}
        {p.rooms ? ` · ${p.rooms} חד׳` : ''}
        {p.area ? ` · ${p.area} מ״ר` : ''}
        {typeof p.floor === 'number' ? ` · קומה ${p.floor}` : ''}
        {` · ${p.dealType === 'rent' ? 'להשכרה' : 'למכירה'}`}
      </div>
    </div>
    <div className="shrink-0 text-base md:text-lg font-bold tabular-nums" style={{ color: SKY }} dir="ltr">
      ₪{p.price}
    </div>
  </Link>
);

const V2List: React.FC<{ properties: V2Property[]; total: number }> = ({ properties, total }) => {
  if (properties.length === 0) return null;
  return (
    <section dir="rtl" className="px-6 md:px-12 py-16 md:py-24" style={{ background: INK }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-end justify-between gap-6 mb-6 md:mb-8">
          <div>
            <Label light>עכשיו במאגר</Label>
            <h2 className="text-white mt-2" style={{ ...DISPLAY, fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', lineHeight: 1.08 }}>
              נכסים פעילים
            </h2>
          </div>
          <Link href="/apartments" className="inline-flex items-center gap-2 text-[15px] font-semibold transition-colors hover:text-white whitespace-nowrap" style={{ color: SKY }}>
            {total > properties.length ? `כל ${total} הנכסים` : 'כל הנכסים'}
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="border-t" style={{ borderColor: 'rgba(251,252,254,0.1)' }}>
          {properties.map((p) => <ListRow key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  );
};

/* ---------- 3. Neighborhood chips — counts from DB ---------- */

const V2Neighborhoods: React.FC<{ items: V2Neighborhood[] }> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <section dir="rtl" className="px-6 md:px-12 py-14 md:py-16 border-t" style={{ background: INK, borderColor: 'rgba(251,252,254,0.1)' }}>
      <div className="max-w-[1200px] mx-auto">
        <Label light>לפי שכונה</Label>
        <div className="mt-5 flex flex-wrap gap-3">
          {items.map((n) => (
            <Link
              key={`${n.city}-${n.name}`}
              href={`/apartments?city=${n.city}`}
              className="inline-flex items-baseline gap-2 rounded-full border px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-white/10"
              style={{ borderColor: 'rgba(85,148,241,0.45)' }}
            >
              {n.name}
              <span className="tabular-nums text-[13px]" style={{ color: SKY }}>{n.count}</span>
            </Link>
          ))}
          <Link
            href="/apartments"
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[14.5px] font-semibold transition-colors hover:text-white"
            style={{ color: SKY }}
          >
            לכל האזורים
            <ArrowLeft size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ---------- 4. Sold proof — grayscale row ---------- */

const V2Sold: React.FC<{ items: V2SoldItem[] }> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <section dir="rtl" className="px-6 md:px-12 py-16 md:py-24 border-t" style={{ background: INK, borderColor: 'rgba(251,252,254,0.1)' }}>
      <div className="max-w-[1200px] mx-auto">
        <Label light>מהשטח</Label>
        <h2 className="text-white mt-2 mb-8 md:mb-10" style={{ ...DISPLAY, fontSize: 'clamp(1.9rem, 4vw, 3.2rem)', lineHeight: 1.08 }}>
          נמכר לאחרונה
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10">
          {items.map((s) => (
            <figure key={s.id}>
              <div className="relative aspect-[4/3] overflow-hidden" style={{ background: NAVY }}>
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                  style={{ filter: 'grayscale(1) brightness(0.8)' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="border px-4 py-1.5 text-[13px] font-bold tracking-[0.22em] text-white" style={{ borderColor: 'rgba(251,252,254,0.65)', background: 'rgba(4,16,44,0.35)' }}>
                    נמכר
                  </span>
                </div>
              </div>
              <figcaption className="pt-3.5">
                <div className="text-[15px] font-semibold truncate" style={{ color: 'rgba(251,252,254,0.8)' }}>{s.title}</div>
                <div className="mt-1 text-[13px]" style={{ color: 'rgba(251,252,254,0.5)' }}>
                  {s.location}{s.neighborhood ? ` · ${s.neighborhood}` : ''}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- 5. Paper interlude — seller moment, asymmetric two-column ---------- */

const V2Paper: React.FC<{ phone?: string | null }> = ({ phone }) => {
  const tel = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : null;
  return (
    <section dir="rtl" className="px-6 md:px-12 py-20 md:py-28" style={{ background: PAPER }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
        <div>
          <Label>מוכרים דירה</Label>
          <h2
            className="mt-4"
            style={{ ...DISPLAY, fontSize: 'clamp(1.9rem, 3.6vw, 3rem)', lineHeight: 1.15, color: NAVY, textWrap: 'balance' }}
          >
            מחיר פתיחה נכון שווה יותר מפרסום יפה
          </h2>
          <p className="mt-6 text-[16px] leading-relaxed" style={{ color: 'rgba(4,16,44,0.75)' }}>
            לפני שהדירה עולה לפרסום, אנחנו בודקים עסקאות אחרונות ברחוב, מצב תכנוני והיצע מתחרה — וחוזרים אליכם עם טווח מחיר מנומק. בלי התחייבות. אחרי 24 שנים בשוק המקומי למדנו דבר אחד פשוט: תמחור מדויק בהתחלה חוסך חודשים בסוף.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 mt-7 text-[15px] font-bold transition-opacity hover:opacity-70"
            style={{ color: NAVY }}
          >
            קראו על המשרד
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="border p-7 md:p-8" style={{ borderColor: 'rgba(4,16,44,0.15)' }}>
          <Label>איך זה עובד</Label>
          <ol className="mt-5 space-y-4">
            {['שיחת היכרות קצרה על הנכס', 'ביקור במקום והערכת שווי מנומקת', 'שיווק, סינון קונים ומשא ומתן'].map((step, i) => (
              <li key={step} className="flex gap-3.5 text-[15px]" style={{ color: 'rgba(4,16,44,0.8)' }}>
                <span className="tabular-nums font-bold" style={{ color: SKY }} dir="ltr">0{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-6 pt-5 border-t text-[13.5px] leading-relaxed" style={{ borderColor: 'rgba(4,16,44,0.12)', color: 'rgba(4,16,44,0.55)' }}>
            עונים בדרך כלל עד שעה בימי א׳–ה׳. סיורים בנכסים — גם בשעות הערב.
          </p>
          {tel && phone && (
            <a href={tel} className="inline-flex items-center gap-2 mt-4 font-bold text-[15px]" style={{ color: NAVY }}>
              <Phone size={16} aria-hidden="true" />
              <span dir="ltr" className="tabular-nums">{phone}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

/* ---------- 6. Finale — huge type + contact, start-aligned ---------- */

const V2Contact: React.FC<{ phone?: string | null }> = ({ phone }) => {
  const tel = phone ? `tel:${phone.replace(/[^0-9+]/g, '')}` : null;
  const wa = phone ? `https://wa.me/${phone.replace(/\D/g, '').replace(/^0/, '972')}` : null;
  return (
    <section id="v2-contact" dir="rtl" className="px-6 md:px-12 py-24 md:py-32" style={{ background: INK }}>
      <div className="max-w-[1200px] mx-auto">
        <Label light>צרו קשר</Label>
        <h2
          className="text-white mt-4"
          style={{ ...DISPLAY, fontSize: 'clamp(3rem, 9vw, 8rem)', lineHeight: 1, letterSpacing: '-0.02em' }}
        >
          בואו נדבר
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          {tel && (
            <a
              href={tel}
              className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 font-bold text-base transition-[filter,transform] duration-200 hover:brightness-95 hover:-translate-y-0.5"
              style={{ background: PAPER, color: NAVY }}
            >
              <Phone size={18} aria-hidden="true" />
              <span dir="ltr">{phone}</span>
            </a>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 font-semibold text-base text-white border transition-colors duration-200 hover:bg-white/10"
              style={{ borderColor: 'rgba(251,252,254,0.4)' }}
            >
              WhatsApp
            </a>
          )}
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 text-[15px] font-semibold transition-colors hover:text-white"
            style={{ color: SKY }}
          >
            או השאירו פרטים
            <ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ---------- 7. Link band — dense catalog + guide links ---------- */

const LINK_COLS: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: 'דירות למכירה',
    links: [
      ['דירות למכירה בחולון', '/apartments?dealType=sale&city=holon'],
      ['דירות למכירה בבת ים', '/apartments?dealType=sale&city=batyam'],
      ['דירות למכירה בראשון לציון', '/apartments?dealType=sale&city=rishon'],
      ['דירות למכירה בתל אביב', '/apartments?dealType=sale&city=telaviv'],
    ],
  },
  {
    title: 'דירות להשכרה',
    links: [
      ['דירות להשכרה בחולון', '/apartments?dealType=rent&city=holon'],
      ['דירות להשכרה בבת ים', '/apartments?dealType=rent&city=batyam'],
      ['דירות להשכרה בראשון לציון', '/apartments?dealType=rent&city=rishon'],
      ['דירות להשכרה בתל אביב', '/apartments?dealType=rent&city=telaviv'],
    ],
  },
  {
    title: 'מדריכים',
    links: [
      ['מדריך משכנתא', '/articles/mortgage-guide'],
      ['מדריך מס רכישה', '/articles/purchase-tax-guide'],
      ['שכונות חולון', '/articles/holon-neighborhoods'],
      ['התחדשות עירונית בחולון', '/articles/urban-renewal-holon'],
      ['קונים דירה ראשונה', '/articles/first-apartment-guide'],
    ],
  },
  {
    title: 'עוד',
    links: [
      ['כל הנכסים', '/apartments'],
      ['כל המאמרים', '/articles'],
      ['על המשרד', '/about'],
    ],
  },
];

const V2LinkBand: React.FC = () => (
  <section dir="rtl" className="px-6 md:px-12 py-14 md:py-16 border-t" style={{ background: INK, borderColor: 'rgba(251,252,254,0.1)' }}>
    <div className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
      {LINK_COLS.map((col) => (
        <nav key={col.title} aria-label={col.title}>
          <Label light>{col.title}</Label>
          <ul className="mt-4 space-y-2.5">
            {col.links.map(([text, href]) => (
              <li key={href + text}>
                <Link href={href} className="text-[13.5px] transition-colors hover:text-white" style={{ color: 'rgba(251,252,254,0.6)' }}>
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  </section>
);

/* ---------- page assembly ---------- */

const V2Home: React.FC<{
  properties: V2Property[];
  counts: V2Counts;
  neighborhoods: V2Neighborhood[];
  sold: V2SoldItem[];
  phone?: string | null;
}> = ({ properties, counts, neighborhoods, sold, phone }) => (
  <div style={{ background: INK }}>
    <V2Hero counts={counts} />
    <V2List properties={properties} total={counts.total} />
    <V2Neighborhoods items={neighborhoods} />
    <V2Sold items={sold} />
    <V2Paper phone={phone} />
    <V2Contact phone={phone} />
    <V2LinkBand />
  </div>
);

export default V2Home;
