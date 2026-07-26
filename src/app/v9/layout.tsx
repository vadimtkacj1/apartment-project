import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ICE, NAVY, BLUE } from './ui';

/* V9 "Resort" chrome — dark-navy top bar with centered nav + blue booking
   pill; dark footer with blurb, menu columns and a photo grid. */

export const metadata: Metadata = {
  title: 'Aiterra — ברוכים הבאים הביתה',
  robots: { index: false, follow: false },
};

export default async function V9Layout({ children }: { children: React.ReactNode }) {
  const owner = await prisma.owner
    .findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } })
    .catch(() => null);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: ICE, color: '#383A4E', fontFamily: 'var(--font-assistant), Arial, sans-serif' }}>
      {/* ---- dark top bar ---- */}
      <header className="sticky top-0 z-50" style={{ background: NAVY }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-[64px] flex items-center gap-8">
          <Link href="/v9" className="shrink-0">
            <img src="/aiterra-white-logo.png" alt="Aiterra" style={{ display: 'block', height: 32, width: 'auto' }} />
          </Link>
          <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-7 mx-auto text-[13.5px] font-medium">
            <Link href="/v9" className="text-white">ראשי</Link>
            <Link href="/v9/apartments?dealType=sale" className="text-white/70 hover:text-white transition-colors">למכירה</Link>
            <Link href="/v9/apartments?dealType=rent" className="text-white/70 hover:text-white transition-colors">להשכרה</Link>
            <a href="/articles" className="text-white/70 hover:text-white transition-colors">מדריכים</a>
            <a href="/about" className="text-white/70 hover:text-white transition-colors">אודות</a>
          </nav>
          <div className="ms-auto md:ms-0 shrink-0">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center rounded-full px-6 py-2 text-[13.5px] font-semibold text-white transition-[filter] hover:brightness-110"
                style={{ background: BLUE }}
              >
                <span dir="ltr">{phone}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* ---- dark footer ---- */}
      <footer style={{ background: NAVY, color: 'rgba(255,255,255,0.72)' }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <img src="/aiterra-white-logo.png" alt="Aiterra" style={{ display: 'block', height: 30, width: 'auto' }} />
            <p className="mt-3 text-[13px] leading-relaxed max-w-[30ch]">
              תיווך נדל״ן למגורים בחולון, בת ים והמרכז — מאז 2002. ליווי אישי מהסיור הראשון ועד המפתח.
            </p>
          </div>
          <nav aria-label="תפריט" className="text-[13.5px]">
            <h3 className="text-white font-semibold mb-3">תפריט</h3>
            <ul className="space-y-2">
              <li><Link href="/v9" className="hover:text-white transition-colors">ראשי</Link></li>
              <li><Link href="/v9/apartments?dealType=sale" className="hover:text-white transition-colors">דירות למכירה</Link></li>
              <li><Link href="/v9/apartments?dealType=rent" className="hover:text-white transition-colors">דירות להשכרה</Link></li>
              <li><a href="/about" className="hover:text-white transition-colors">אודות המשרד</a></li>
            </ul>
          </nav>
          <nav aria-label="מידע" className="text-[13.5px]">
            <h3 className="text-white font-semibold mb-3">מידע</h3>
            <ul className="space-y-2">
              <li><a href="/articles/mortgage-guide" className="hover:text-white transition-colors">מדריך משכנתא</a></li>
              <li><a href="/articles/holon-neighborhoods" className="hover:text-white transition-colors">שכונות חולון</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">מדיניות פרטיות</a></li>
              <li><a href="/accessibility" className="hover:text-white transition-colors">נגישות</a></li>
            </ul>
          </nav>
          <div className="text-[13.5px]">
            <h3 className="text-white font-semibold mb-3">צרו קשר</h3>
            <ul className="space-y-2">
              {phone && <li><a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors" dir="ltr">{phone}</a></li>}
              <li>עונים בימי א׳–ה׳, 9:00–19:00</li>
              <li>חולון · בת ים · המרכז</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-4 text-[12px]">
            © {new Date().getFullYear()} Aiterra נדל״ן · רישיונות תיווך 3072851, 3184627
          </div>
        </div>
      </footer>
    </div>
  );
}
