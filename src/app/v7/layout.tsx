import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { Frank_Ruhl_Libre } from 'next/font/google';
import { prisma } from '@/lib/prisma';

/* ============================================================
   V7 — "Estate" frontend: international luxury-realty school
   (Sotheby's/Christie's language): cream canvas, deep forest-
   green brand surfaces, Hebrew serif display, restrained gold.

   Tokens: cream #F6F1E7 · forest #17352A · ink #1C1A15 ·
   muted #756E5E · GOLD #C9A227 (rules/details only) · line #E3DCCB
   ============================================================ */

const frank = Frank_Ruhl_Libre({
  weight: ['300', '400', '500'],
  subsets: ['hebrew', 'latin'],
  display: 'swap',
  variable: '--font-frank',
  fallback: ['Georgia', 'serif'],
});

export const metadata: Metadata = {
  title: 'Aiterra Estates — נדל״ן יוקרתי',
  robots: { index: false, follow: false },
};

const FOREST = '#17352A';
const CREAM = '#F6F1E7';
const GOLD = '#C9A227';

export default async function V7Layout({ children }: { children: React.ReactNode }) {
  const owner = await prisma.owner
    .findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } })
    .catch(() => null);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl" className={`${frank.variable} min-h-screen flex flex-col`} style={{ background: CREAM, color: '#1C1A15', fontFamily: 'var(--font-assistant), Arial, sans-serif' }}>
      <header className="sticky top-0 z-50" style={{ background: FOREST }}>
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 h-[74px] flex items-center justify-between gap-6">
          <Link href="/v7" className="flex flex-col leading-none">
            <span className="text-[21px]" style={{ fontFamily: 'var(--font-frank), serif', fontWeight: 500, color: CREAM, letterSpacing: '0.14em' }}>
              AITERRA
            </span>
            <span className="text-[9.5px] mt-1" style={{ color: GOLD, letterSpacing: '0.42em' }}>ESTATES</span>
          </Link>
          <nav aria-label="ניווט" className="hidden md:flex items-center gap-8 text-[13.5px]" style={{ color: 'rgba(246,241,231,0.8)', letterSpacing: '0.05em' }}>
            <a href="/apartments?dealType=sale" className="hover:text-white transition-colors">למכירה</a>
            <a href="/apartments?dealType=rent" className="hover:text-white transition-colors">להשכרה</a>
            <a href="/v7#v7-sell" className="hover:text-white transition-colors">מוכרים</a>
          </nav>
          <div className="flex items-center gap-4">
            {phone && (
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hidden sm:block text-[13.5px] transition-colors hover:text-white" style={{ color: 'rgba(246,241,231,0.8)' }} dir="ltr">
                {phone}
              </a>
            )}
            <a
              href="#v7-sell"
              className="inline-flex items-center px-6 py-2.5 text-[13.5px] transition-opacity hover:opacity-90"
              style={{ background: CREAM, color: FOREST, fontWeight: 600, letterSpacing: '0.05em' }}
            >
              הערכת שווי
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ background: FOREST, color: CREAM }}>
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 pt-14 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            <nav aria-label="דירות למכירה">
              <h3 className="text-[13px] mb-4" style={{ color: CREAM, fontWeight: 600 }}>דירות למכירה</h3>
              <ul className="space-y-2.5 text-[13px]" style={{ color: 'rgba(246,241,231,0.65)' }}>
                <li><a href="/apartments?dealType=sale&city=holon" className="hover:text-white transition-colors">דירות למכירה בחולון</a></li>
                <li><a href="/apartments?dealType=sale&city=batyam" className="hover:text-white transition-colors">דירות למכירה בבת ים</a></li>
                <li><a href="/apartments?dealType=sale&city=rishon" className="hover:text-white transition-colors">דירות למכירה בראשון לציון</a></li>
                <li><a href="/apartments?dealType=sale&city=telaviv" className="hover:text-white transition-colors">דירות למכירה בתל אביב</a></li>
              </ul>
            </nav>
            <nav aria-label="דירות להשכרה">
              <h3 className="text-[13px] mb-4" style={{ color: CREAM, fontWeight: 600 }}>דירות להשכרה</h3>
              <ul className="space-y-2.5 text-[13px]" style={{ color: 'rgba(246,241,231,0.65)' }}>
                <li><a href="/apartments?dealType=rent&city=holon" className="hover:text-white transition-colors">דירות להשכרה בחולון</a></li>
                <li><a href="/apartments?dealType=rent&city=batyam" className="hover:text-white transition-colors">דירות להשכרה בבת ים</a></li>
                <li><a href="/apartments?dealType=rent&city=rishon" className="hover:text-white transition-colors">דירות להשכרה בראשון לציון</a></li>
                <li><a href="/apartments?dealType=rent&city=telaviv" className="hover:text-white transition-colors">דירות להשכרה בתל אביב</a></li>
              </ul>
            </nav>
            <nav aria-label="מדריכים">
              <h3 className="text-[13px] mb-4" style={{ color: CREAM, fontWeight: 600 }}>מדריכים</h3>
              <ul className="space-y-2.5 text-[13px]" style={{ color: 'rgba(246,241,231,0.65)' }}>
                <li><a href="/articles/mortgage-guide" className="hover:text-white transition-colors">מדריך משכנתא</a></li>
                <li><a href="/articles/purchase-tax-guide" className="hover:text-white transition-colors">מדריך מס רכישה</a></li>
                <li><a href="/articles/holon-neighborhoods" className="hover:text-white transition-colors">שכונות חולון — סקירה</a></li>
              </ul>
            </nav>
            <nav aria-label="המשרד">
              <h3 className="text-[13px] mb-4" style={{ color: CREAM, fontWeight: 600 }}>המשרד</h3>
              <ul className="space-y-2.5 text-[13px]" style={{ color: 'rgba(246,241,231,0.65)' }}>
                <li><a href="/apartments" className="hover:text-white transition-colors">כל הנכסים</a></li>
                <li><a href="/v7#v7-sell" className="hover:text-white transition-colors">מוכרים נכס</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">אודות</a></li>
                <li><a href="/privacy-policy" className="hover:text-white transition-colors">פרטיות</a></li>
                <li><a href="/accessibility" className="hover:text-white transition-colors">נגישות</a></li>
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors" dir="ltr">{phone}</a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(246,241,231,0.15)' }}>
            <div className="flex flex-col leading-none">
              <span style={{ fontFamily: 'var(--font-frank), serif', fontWeight: 500, letterSpacing: '0.14em', fontSize: 18 }}>AITERRA</span>
              <span className="text-[9px] mt-1" style={{ color: GOLD, letterSpacing: '0.42em' }}>ESTATES</span>
            </div>
            <div className="text-[12px]" style={{ color: 'rgba(246,241,231,0.5)' }}>© {new Date().getFullYear()} Aiterra נדל״ן · חולון ובת ים</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
