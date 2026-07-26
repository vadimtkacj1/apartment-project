import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { prisma } from '@/lib/prisma';

/* ============================================================
   V3 — "Marketplace" frontend, faithful to the Refero Airbnb
   style reference (style afd145ca): warm near-white canvas with
   ONE ceremonial coral accent.

   Tokens (from the reference):
     canvas #f7f7f7 · surface #ffffff · ink #222222 · slate #6a6a6a
     mist #ebebeb · silver #c1c1c1 · CORAL #ff385c (logo, search
     trigger, active states ONLY — never text/decoration)
   Radii: cards 20 · buttons 8 · pills 32/full · badges 4
   Shadows: layered rgba stacks on ELEVATED containers only;
   listing cards carry NO shadow. Weights 400–700, never 800+.
   ============================================================ */

export const metadata: Metadata = {
  title: 'Aiterra — דירות למכירה ולהשכרה',
  robots: { index: false, follow: false },
};

const NAV = [
  { href: '/v3', label: 'נכסים', active: true },
  { href: '/v3/apartments?dealType=sale', label: 'למכירה', active: false },
  { href: '/v3/apartments?dealType=rent', label: 'להשכרה', active: false },
];

export default async function V3Layout({ children }: { children: React.ReactNode }) {
  const owner = await prisma.owner
    .findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } })
    .catch(() => null);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: '#f7f7f7', color: '#222222', fontFamily: 'var(--font-assistant), Arial, sans-serif' }}>
      {/* ---- header: white bar, mist hairline, coral wordmark, underline tabs ---- */}
      <header className="sticky top-0 z-50 bg-white" style={{ borderBottom: '1px solid #ebebeb' }}>
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 h-[76px] flex items-center gap-6">
          <Link href="/v3" className="flex items-center gap-2 shrink-0">
            {/* coral brand mark — the single chromatic signature */}
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#ff385c" aria-hidden="true">
              <path d="M12 2.5c1.1 0 2 .6 2.6 1.6l6.6 12.3c.9 1.8.4 3.9-1.3 5-1.6 1-3.7.7-4.9-.8L12 17.2l-3 3.4c-1.2 1.5-3.3 1.8-4.9.8-1.7-1.1-2.2-3.2-1.3-5L9.4 4.1C10 3.1 10.9 2.5 12 2.5Zm0 7.1-2.4 4.5L12 16.9l2.4-2.8L12 9.6Z"/>
            </svg>
            <span className="text-[21px] font-bold" style={{ color: '#ff385c', letterSpacing: '-0.02em' }}>aiterra</span>
          </Link>

          <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-7 mx-auto">
            {NAV.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="relative py-2 text-[14.5px] transition-colors"
                style={{ color: l.active ? '#222222' : '#6a6a6a', fontWeight: 600 }}
              >
                {l.label}
                {l.active && <span className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: '#222222' }} aria-hidden="true" />}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 ms-auto md:ms-0 shrink-0">
            <a
              href="#v3-sell"
              className="hidden sm:inline-flex items-center px-3.5 py-2.5 rounded-lg text-[14px] transition-colors hover:bg-[#f7f7f7]"
              style={{ color: '#222222', fontWeight: 600 }}
            >
              מוכרים דירה?
            </a>
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                aria-label="התקשרו אלינו"
                className="inline-flex items-center justify-center size-10 rounded-full transition-colors hover:bg-[#f7f7f7]"
                style={{ border: '1px solid #ebebeb', color: '#222222' }}
              >
                <Phone size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ---- footer: fog canvas, deep quiet link farm (portal-style) ---- */}
      <footer style={{ background: '#f7f7f7', borderTop: '1px solid #ebebeb' }}>
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            <nav aria-label="דירות למכירה לפי עיר">
              <h3 className="text-[13.5px] mb-3.5" style={{ fontWeight: 700, color: '#222222' }}>דירות למכירה</h3>
              <ul className="space-y-2.5 text-[13.5px]" style={{ color: '#6a6a6a' }}>
                <li><a href="/v3/apartments?dealType=sale&city=holon" className="hover:underline underline-offset-4">דירות למכירה בחולון</a></li>
                <li><a href="/v3/apartments?dealType=sale&city=batyam" className="hover:underline underline-offset-4">דירות למכירה בבת ים</a></li>
                <li><a href="/v3/apartments?dealType=sale&city=rishon" className="hover:underline underline-offset-4">דירות למכירה בראשון לציון</a></li>
                <li><a href="/v3/apartments?dealType=sale&city=telaviv" className="hover:underline underline-offset-4">דירות למכירה בתל אביב</a></li>
                <li><a href="/v3/apartments?dealType=sale" className="hover:underline underline-offset-4">כל הדירות למכירה</a></li>
              </ul>
            </nav>
            <nav aria-label="דירות להשכרה לפי עיר">
              <h3 className="text-[13.5px] mb-3.5" style={{ fontWeight: 700, color: '#222222' }}>דירות להשכרה</h3>
              <ul className="space-y-2.5 text-[13.5px]" style={{ color: '#6a6a6a' }}>
                <li><a href="/v3/apartments?dealType=rent&city=holon" className="hover:underline underline-offset-4">דירות להשכרה בחולון</a></li>
                <li><a href="/v3/apartments?dealType=rent&city=batyam" className="hover:underline underline-offset-4">דירות להשכרה בבת ים</a></li>
                <li><a href="/v3/apartments?dealType=rent&city=rishon" className="hover:underline underline-offset-4">דירות להשכרה בראשון לציון</a></li>
                <li><a href="/v3/apartments?dealType=rent&city=telaviv" className="hover:underline underline-offset-4">דירות להשכרה בתל אביב</a></li>
                <li><a href="/v3/apartments?dealType=rent" className="hover:underline underline-offset-4">כל הדירות להשכרה</a></li>
              </ul>
            </nav>
            <nav aria-label="מדריכים">
              <h3 className="text-[13.5px] mb-3.5" style={{ fontWeight: 700, color: '#222222' }}>מדריכים</h3>
              <ul className="space-y-2.5 text-[13.5px]" style={{ color: '#6a6a6a' }}>
                <li><a href="/articles/mortgage-guide" className="hover:underline underline-offset-4">מדריך משכנתא למתחילים</a></li>
                <li><a href="/articles/purchase-tax-guide" className="hover:underline underline-offset-4">מדריך מס רכישה</a></li>
                <li><a href="/articles/holon-neighborhoods" className="hover:underline underline-offset-4">שכונות חולון — סקירה</a></li>
                <li><a href="/articles" className="hover:underline underline-offset-4">כל המדריכים</a></li>
              </ul>
            </nav>
            <nav aria-label="Aiterra">
              <h3 className="text-[13.5px] mb-3.5" style={{ fontWeight: 700, color: '#222222' }}>Aiterra</h3>
              <ul className="space-y-2.5 text-[13.5px]" style={{ color: '#6a6a6a' }}>
                <li><a href="/about" className="hover:underline underline-offset-4">אודות המשרד</a></li>
                <li><a href="/v3#v3-sell" className="hover:underline underline-offset-4">מוכרים דירה</a></li>
                <li><a href="/privacy-policy" className="hover:underline underline-offset-4">מדיניות פרטיות</a></li>
                <li><a href="/accessibility" className="hover:underline underline-offset-4">הצהרת נגישות</a></li>
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:underline underline-offset-4" dir="ltr">{phone}</a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
          <div className="mt-10 pt-6 flex flex-wrap items-center gap-3 text-[13.5px]" style={{ borderTop: '1px solid #ebebeb', color: '#6a6a6a' }}>
            <span style={{ fontWeight: 600, color: '#222222' }}>© {new Date().getFullYear()} Aiterra נדל״ן</span>
            <span aria-hidden="true">·</span>
            <span>חולון · בת ים · המרכז</span>
            {phone && (
              <>
                <span aria-hidden="true">·</span>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:underline underline-offset-4" style={{ fontWeight: 600, color: '#222222' }} dir="ltr">{phone}</a>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
