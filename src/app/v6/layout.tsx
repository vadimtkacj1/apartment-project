import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { Frank_Ruhl_Libre } from 'next/font/google';
import { prisma } from '@/lib/prisma';

/* ============================================================
   V6 — "Broker" frontend: premium-brokerage minimalism
   (Compass-school): pure white canvas, near-black ink, Hebrew
   serif display, ONE deep-emerald accent used sparingly.

   Tokens: white #fff · ink #111111 · gray #6b6b66 ·
   hairline #E8E8E4 · EMERALD #14532D (links/labels only)
   Buttons: black filled, sharp 6px. Serif: Frank Ruhl Libre.
   ============================================================ */

const frank = Frank_Ruhl_Libre({
  weight: ['300', '400', '500'],
  subsets: ['hebrew', 'latin'],
  display: 'swap',
  variable: '--font-frank',
  fallback: ['Georgia', 'serif'],
});

export const metadata: Metadata = {
  title: 'Aiterra — נדל״ן במיטבו',
  robots: { index: false, follow: false },
};

export default async function V6Layout({ children }: { children: React.ReactNode }) {
  const owner = await prisma.owner
    .findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } })
    .catch(() => null);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl" className={`${frank.variable} min-h-screen flex flex-col bg-white`} style={{ color: '#111111', fontFamily: 'var(--font-assistant), Arial, sans-serif' }}>
      <header className="sticky top-0 z-50 bg-white/95" style={{ backdropFilter: 'blur(8px)', borderBottom: '1px solid #E8E8E4' }}>
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between gap-6">
          <Link href="/v6" className="text-[20px]" style={{ fontFamily: 'var(--font-frank), serif', fontWeight: 500, letterSpacing: '0.22em' }}>
            AITERRA
          </Link>
          <nav aria-label="ניווט" className="hidden md:flex items-center gap-8 text-[13.5px]" style={{ letterSpacing: '0.04em' }}>
            <a href="/apartments?dealType=sale" className="hover:opacity-60 transition-opacity">למכירה</a>
            <a href="/apartments?dealType=rent" className="hover:opacity-60 transition-opacity">להשכרה</a>
            <a href="/v6#v6-sell" className="hover:opacity-60 transition-opacity">מוכרים</a>
            <a href="/about" className="hover:opacity-60 transition-opacity">המשרד</a>
          </nav>
          <div className="flex items-center gap-4">
            {phone && (
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hidden sm:block text-[13.5px] hover:opacity-60 transition-opacity" dir="ltr" style={{ letterSpacing: '0.02em' }}>
                {phone}
              </a>
            )}
            <a
              href="#v6-sell"
              className="inline-flex items-center px-6 py-2.5 rounded-md text-[13.5px] text-white transition-opacity hover:opacity-85"
              style={{ background: '#111111', letterSpacing: '0.04em' }}
            >
              הערכת שווי
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ borderTop: '1px solid #E8E8E4' }}>
        <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-10">
          <div className="col-span-2 md:col-span-1">
            <div style={{ fontFamily: 'var(--font-frank), serif', fontWeight: 500, letterSpacing: '0.22em', fontSize: 17 }}>AITERRA</div>
            <p className="mt-3 text-[13px] leading-[1.7] max-w-[30ch]" style={{ color: '#6b6b66' }}>
              משרד תיווך בחולון. מלווים קונים ומוכרים בחולון, בת ים, ראשון לציון ותל אביב.
            </p>
            {phone && (
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="mt-3 inline-block text-[13.5px] hover:opacity-60 transition-opacity" dir="ltr">
                {phone}
              </a>
            )}
          </div>

          <nav aria-label="דירות למכירה">
            <div className="text-[12.5px] mb-3" style={{ fontWeight: 600 }}>למכירה</div>
            <ul className="space-y-2 text-[13px]" style={{ color: '#6b6b66' }}>
              <li><a href="/apartments?dealType=sale&city=holon" className="hover:text-black transition-colors">דירות למכירה בחולון</a></li>
              <li><a href="/apartments?dealType=sale&city=batyam" className="hover:text-black transition-colors">דירות למכירה בבת ים</a></li>
              <li><a href="/apartments?dealType=sale&city=rishon" className="hover:text-black transition-colors">דירות למכירה בראשון לציון</a></li>
              <li><a href="/apartments?dealType=sale&city=telaviv" className="hover:text-black transition-colors">דירות למכירה בתל אביב</a></li>
              <li><a href="/apartments?dealType=sale" className="hover:text-black transition-colors">כל הנכסים למכירה</a></li>
            </ul>
          </nav>

          <nav aria-label="דירות להשכרה">
            <div className="text-[12.5px] mb-3" style={{ fontWeight: 600 }}>להשכרה</div>
            <ul className="space-y-2 text-[13px]" style={{ color: '#6b6b66' }}>
              <li><a href="/apartments?dealType=rent&city=holon" className="hover:text-black transition-colors">דירות להשכרה בחולון</a></li>
              <li><a href="/apartments?dealType=rent&city=batyam" className="hover:text-black transition-colors">דירות להשכרה בבת ים</a></li>
              <li><a href="/apartments?dealType=rent&city=rishon" className="hover:text-black transition-colors">דירות להשכרה בראשון לציון</a></li>
              <li><a href="/apartments?dealType=rent&city=telaviv" className="hover:text-black transition-colors">דירות להשכרה בתל אביב</a></li>
              <li><a href="/apartments?dealType=rent" className="hover:text-black transition-colors">כל הנכסים להשכרה</a></li>
            </ul>
          </nav>

          <nav aria-label="מדריכים ומידע">
            <div className="text-[12.5px] mb-3" style={{ fontWeight: 600 }}>מדריכים ומידע</div>
            <ul className="space-y-2 text-[13px]" style={{ color: '#6b6b66' }}>
              <li><a href="/articles/mortgage-guide" className="hover:text-black transition-colors">מדריך משכנתא</a></li>
              <li><a href="/articles/purchase-tax-guide" className="hover:text-black transition-colors">מדריך מס רכישה</a></li>
              <li><a href="/articles/holon-neighborhoods" className="hover:text-black transition-colors">שכונות חולון</a></li>
              <li><a href="/about" className="hover:text-black transition-colors">המשרד</a></li>
              <li><a href="/apartments" className="hover:text-black transition-colors">כל הנכסים</a></li>
            </ul>
          </nav>
        </div>

        <div style={{ borderTop: '1px solid #E8E8E4' }}>
          <div className="max-w-[1320px] mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-[12.5px]" style={{ color: '#6b6b66' }}>
              © {new Date().getFullYear()} Aiterra נדל״ן · חולון והמרכז
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[12.5px]" style={{ color: '#6b6b66' }}>
              <a href="/privacy-policy" className="hover:text-black transition-colors">פרטיות</a>
              <a href="/accessibility" className="hover:text-black transition-colors">נגישות</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
