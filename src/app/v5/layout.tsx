import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

/* ============================================================
   V5 — "Sunny" frontend, from the Refero Apron style reference
   (11fe119c): soft pale-yellow canvas, bold amber accent,
   charcoal-overlay photo hero with chunky display type,
   rounded pill actions. Optimistic, warm, businesslike.

   Tokens: canvas #FFF7E0 · surface #fff · charcoal #23201A ·
   muted #7A7264 · AMBER #FFB300 (primary actions) · line #EFE6CC
   Radii: pills 9999 for actions, 16px cards
   ============================================================ */

export const metadata: Metadata = {
  title: 'Aiterra — דירות למכירה ולהשכרה בחולון והמרכז',
  robots: { index: false, follow: false },
};

const CHAR = '#23201A';
const AMBER = '#FFB300';

export default async function V5Layout({ children }: { children: React.ReactNode }) {
  const owner = await prisma.owner
    .findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } })
    .catch(() => null);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: '#FFF7E0', color: CHAR, fontFamily: 'var(--font-assistant), Arial, sans-serif' }}>
      <header className="sticky top-0 z-50" style={{ background: 'rgba(255,247,224,0.94)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #EFE6CC' }}>
        <div className="max-w-[1240px] mx-auto px-6 md:px-10 h-[70px] flex items-center justify-between gap-6">
          <Link href="/v5" className="text-[23px] font-extrabold tracking-tight" style={{ color: CHAR }}>
            aiterra<span style={{ color: AMBER }}>*</span>
          </Link>
          <nav aria-label="ניווט" className="hidden md:flex items-center gap-7 text-[14.5px] font-semibold">
            <a href="/apartments?dealType=sale" className="hover:opacity-60 transition-opacity" style={{ color: CHAR }}>למכירה</a>
            <a href="/apartments?dealType=rent" className="hover:opacity-60 transition-opacity" style={{ color: CHAR }}>להשכרה</a>
            <a href="/v5#v5-sell" className="hover:opacity-60 transition-opacity" style={{ color: CHAR }}>מוכרים דירה</a>
          </nav>
          <div className="flex items-center gap-2.5">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full text-[14px] font-bold transition-colors hover:bg-black/5"
                style={{ border: `1.5px solid ${CHAR}`, color: CHAR }}
                dir="ltr"
              >
                {phone}
              </a>
            )}
            <a
              href="#v5-sell"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-[14px] font-bold transition-[filter] hover:brightness-95"
              style={{ background: AMBER, color: CHAR }}
            >
              הערכת שווי חינם
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ background: CHAR, color: '#FFF7E0' }}>
        <div className="max-w-[1240px] mx-auto px-6 md:px-10 pt-14 pb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            <div className="col-span-2 md:col-span-1">
              <div className="text-[21px] font-extrabold">aiterra<span style={{ color: AMBER }}>*</span></div>
              <p className="mt-3 text-[13.5px] leading-relaxed max-w-[28ch]" style={{ color: 'rgba(255,247,224,0.6)' }}>
                משרד תיווך מקומי. עסקאות מכירה, השכרה וליווי מוכרים בחולון, בת ים והסביבה.
              </p>
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                  className="mt-4 inline-flex text-[14.5px] font-bold hover:text-white transition-colors"
                  style={{ color: '#FFF7E0' }}
                  dir="ltr"
                >
                  {phone}
                </a>
              )}
            </div>

            <nav aria-label="דירות למכירה">
              <div className="text-[13px] font-bold mb-3" style={{ color: 'rgba(255,247,224,0.5)' }}>דירות למכירה</div>
              <ul className="space-y-2 text-[13.5px]" style={{ color: 'rgba(255,247,224,0.75)' }}>
                <li><a href="/apartments?dealType=sale&city=holon" className="hover:text-white transition-colors">דירות למכירה בחולון</a></li>
                <li><a href="/apartments?dealType=sale&city=batyam" className="hover:text-white transition-colors">דירות למכירה בבת ים</a></li>
                <li><a href="/apartments?dealType=sale&city=rishon" className="hover:text-white transition-colors">דירות למכירה בראשון לציון</a></li>
                <li><a href="/apartments?dealType=sale&city=telaviv" className="hover:text-white transition-colors">דירות למכירה בתל אביב</a></li>
              </ul>
            </nav>

            <nav aria-label="דירות להשכרה">
              <div className="text-[13px] font-bold mb-3" style={{ color: 'rgba(255,247,224,0.5)' }}>דירות להשכרה</div>
              <ul className="space-y-2 text-[13.5px]" style={{ color: 'rgba(255,247,224,0.75)' }}>
                <li><a href="/apartments?dealType=rent&city=holon" className="hover:text-white transition-colors">דירות להשכרה בחולון</a></li>
                <li><a href="/apartments?dealType=rent&city=batyam" className="hover:text-white transition-colors">דירות להשכרה בבת ים</a></li>
                <li><a href="/apartments?dealType=rent&city=rishon" className="hover:text-white transition-colors">דירות להשכרה בראשון לציון</a></li>
                <li><a href="/apartments?dealType=rent&city=telaviv" className="hover:text-white transition-colors">דירות להשכרה בתל אביב</a></li>
              </ul>
            </nav>

            <nav aria-label="מדריכים ומידע">
              <div className="text-[13px] font-bold mb-3" style={{ color: 'rgba(255,247,224,0.5)' }}>מדריכים ומידע</div>
              <ul className="space-y-2 text-[13.5px]" style={{ color: 'rgba(255,247,224,0.75)' }}>
                <li><a href="/articles/mortgage-guide" className="hover:text-white transition-colors">מדריך משכנתא למתחילים</a></li>
                <li><a href="/articles/purchase-tax-guide" className="hover:text-white transition-colors">מס רכישה — מה משלמים</a></li>
                <li><a href="/articles/holon-neighborhoods" className="hover:text-white transition-colors">שכונות חולון — סקירה</a></li>
                <li><a href="/apartments" className="hover:text-white transition-colors">כל הנכסים</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">אודות המשרד</a></li>
              </ul>
            </nav>
          </div>

          <div
            className="mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12.5px]"
            style={{ borderTop: '1px solid rgba(255,247,224,0.14)', color: 'rgba(255,247,224,0.5)' }}
          >
            <div>© {new Date().getFullYear()} Aiterra נדל״ן · חולון והמרכז</div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <a href="/privacy-policy" className="hover:text-white transition-colors">פרטיות</a>
              <a href="/accessibility" className="hover:text-white transition-colors">נגישות</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
