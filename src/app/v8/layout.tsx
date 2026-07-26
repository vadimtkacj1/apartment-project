import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { INK, SLATE, LINE } from './ui';

/* V8 "Trulia" chrome — faithful RTL port of trulia.com's header/footer:
   slim white header (lowercase wordmark, quiet nav, outlined action),
   deep footer: 4 link columns → legal block → flat house-shapes strip. */

export const metadata: Metadata = {
  title: 'Aiterra — מצאו מקום שתאהבו לגור בו',
  robots: { index: false, follow: false },
};

export default async function V8Layout({ children }: { children: React.ReactNode }) {
  const owner = await prisma.owner
    .findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } })
    .catch(() => null);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-white" style={{ color: INK, fontFamily: 'var(--font-assistant), Arial, sans-serif' }}>
      {/* ---- slim header ---- */}
      <header className="sticky top-0 z-50 bg-white" style={{ borderBottom: `1px solid ${LINE}` }}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 h-[64px] flex items-center gap-7">
          <Link href="/v8" className="text-[24px] font-extrabold tracking-tight shrink-0" style={{ color: INK }}>
            aiterra
          </Link>
          <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-6 text-[14px] font-semibold">
            <Link href="/v8/apartments?dealType=sale" className="hover:opacity-70 transition-opacity">לקנייה</Link>
            <Link href="/v8/apartments?dealType=rent" className="hover:opacity-70 transition-opacity">להשכרה</Link>
            <a href="/articles" className="hover:opacity-70 transition-opacity">מדריכים</a>
          </nav>
          <div className="flex items-center gap-5 ms-auto">
            {phone && (
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hidden sm:block text-[14px] font-semibold hover:opacity-70 transition-opacity" dir="ltr">
                {phone}
              </a>
            )}
            <a
              href="#v8-contact"
              className="inline-flex items-center px-5 py-2 rounded-lg text-[14px] font-bold transition-colors hover:bg-[#F7F7F8]"
              style={{ border: `1px solid ${INK}`, color: INK }}
            >
              דברו איתנו
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ---- deep Trulia footer ---- */}
      <footer id="v8-contact" style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <nav aria-label="חיפושים פופולריים">
              <h3 className="text-[13.5px] font-extrabold mb-3">חיפושים פופולריים</h3>
              <ul className="space-y-2 text-[13px]" style={{ color: SLATE }}>
                <li><a href="/v8/apartments?dealType=sale&city=holon" className="hover:underline">דירות למכירה בחולון</a></li>
                <li><a href="/v8/apartments?dealType=sale&city=batyam" className="hover:underline">דירות למכירה בבת ים</a></li>
                <li><a href="/v8/apartments?dealType=sale&city=rishon" className="hover:underline">דירות למכירה בראשון לציון</a></li>
                <li><a href="/v8/apartments?dealType=sale" className="hover:underline">כל הדירות למכירה</a></li>
              </ul>
            </nav>
            <nav aria-label="חיפושי שכירות">
              <h3 className="text-[13.5px] font-extrabold mb-3">חיפושי שכירות</h3>
              <ul className="space-y-2 text-[13px]" style={{ color: SLATE }}>
                <li><a href="/v8/apartments?dealType=rent&city=holon" className="hover:underline">דירות להשכרה בחולון</a></li>
                <li><a href="/v8/apartments?dealType=rent&city=batyam" className="hover:underline">דירות להשכרה בבת ים</a></li>
                <li><a href="/v8/apartments?dealType=rent&city=telaviv" className="hover:underline">דירות להשכרה בתל אביב</a></li>
                <li><a href="/v8/apartments?dealType=rent" className="hover:underline">כל הדירות להשכרה</a></li>
              </ul>
            </nav>
            <nav aria-label="מידע ומדריכים">
              <h3 className="text-[13.5px] font-extrabold mb-3">מידע ומדריכים</h3>
              <ul className="space-y-2 text-[13px]" style={{ color: SLATE }}>
                <li><a href="/articles/mortgage-guide" className="hover:underline">מדריך משכנתא</a></li>
                <li><a href="/articles/purchase-tax-guide" className="hover:underline">מס רכישה</a></li>
                <li><a href="/articles/holon-neighborhoods" className="hover:underline">שכונות חולון</a></li>
                <li><a href="/articles" className="hover:underline">כל המדריכים</a></li>
              </ul>
            </nav>
            <nav aria-label="המשרד">
              <h3 className="text-[13.5px] font-extrabold mb-3">המשרד</h3>
              <ul className="space-y-2 text-[13px]" style={{ color: SLATE }}>
                <li><a href="/about" className="hover:underline">אודות Aiterra</a></li>
                {phone && <li><a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:underline" dir="ltr">{phone}</a></li>}
                <li><a href="/privacy-policy" className="hover:underline">מדיניות פרטיות</a></li>
                <li><a href="/accessibility" className="hover:underline">הצהרת נגישות</a></li>
              </ul>
            </nav>
          </div>

          <div className="mt-10 pt-6 text-[12px] leading-relaxed" style={{ borderTop: `1px solid ${LINE}`, color: SLATE }}>
            Aiterra נדל״ן · משרד תיווך ושיווק נכסים, פועל בחולון, בת ים והמרכז משנת 2002 · רישיונות תיווך מס׳ 3072851, 3184627
            <br />© {new Date().getFullYear()} Aiterra. כל הזכויות שמורות.
          </div>
        </div>

        {/* flat house-shapes strip (Trulia's illustrated footer) */}
        <div aria-hidden="true" className="overflow-hidden" style={{ background: '#fff' }}>
          <svg viewBox="0 0 1200 90" className="w-full block" preserveAspectRatio="xMidYMax meet">
            <rect x="140" y="38" width="70" height="52" fill="#F1483C" opacity="0.85" />
            <polygon points="140,38 175,14 210,38" fill="#D93A2F" />
            <rect x="300" y="26" width="56" height="64" fill="#8D7BC6" />
            <rect x="440" y="46" width="86" height="44" fill="#F5B62E" />
            <polygon points="440,46 483,22 526,46" fill="#DDA01F" />
            <rect x="610" y="18" width="48" height="72" fill="#1E5F46" />
            <rect x="740" y="42" width="72" height="48" fill="#67B7A4" />
            <polygon points="740,42 776,20 812,42" fill="#4E9E8B" />
            <rect x="900" y="30" width="54" height="60" fill="#44525C" />
            <rect x="1030" y="50" width="64" height="40" fill="#F1483C" opacity="0.7" />
            <circle cx="260" cy="76" r="14" fill="#9CCB86" />
            <circle cx="580" cy="78" r="12" fill="#9CCB86" />
            <circle cx="870" cy="80" r="10" fill="#9CCB86" />
          </svg>
        </div>
      </footer>
    </div>
  );
}
