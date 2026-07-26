import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

/* ============================================================
   V4 — "Residence" frontend, from the Refero Samara style
   reference (b7b0af34): warm parchment canvas, black ink,
   ONE vivid sky-blue action color, whisper-light display type.

   Tokens: parchment #fdfdf7 · ink #000 · graphite #666 ·
   stone #999 · sand #f5f2de · SKY #0096f7 (CTAs/links only)
   Radii: 12px everywhere, 18px specialty cards, pills 24px
   Shadows: subtle short — rgba(0,0,0,0.12) 0 0.5px 2px
   Type: light weights + tight negative tracking at display sizes
   ============================================================ */

export const metadata: Metadata = {
  title: 'Aiterra — נדל״ן למגורים',
  robots: { index: false, follow: false },
};

export default async function V4Layout({ children }: { children: React.ReactNode }) {
  const owner = await prisma.owner
    .findFirst({ where: { isActive: true, phone: { not: null } }, orderBy: { order: 'asc' }, select: { phone: true } })
    .catch(() => null);
  const phone = owner?.phone ?? null;

  return (
    <div dir="rtl" className="min-h-screen flex flex-col" style={{ background: '#fdfdf7', color: '#000', fontFamily: 'var(--font-assistant), Arial, sans-serif' }}>
      <header className="sticky top-0 z-50" style={{ background: 'rgba(253,253,247,0.94)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-[70px] flex items-center justify-between gap-6">
          <Link href="/v4" className="text-[24px]" style={{ fontWeight: 300, letterSpacing: '-0.03em' }}>
            Aiterra<span style={{ color: '#0096f7' }}>.</span>
          </Link>
          <nav aria-label="ניווט" className="hidden md:flex items-center gap-8 text-[14.5px]">
            <a href="/v4#v4-sale" className="hover:opacity-60 transition-opacity" style={{ color: '#000' }}>למכירה</a>
            <a href="/v4#v4-rent" className="hover:opacity-60 transition-opacity" style={{ color: '#000' }}>להשכרה</a>
            <a href="/v4#v4-sell" className="hover:opacity-60 transition-opacity" style={{ color: '#000' }}>מוכרים</a>
          </nav>
          <div className="flex items-center gap-3">
            {phone && (
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hidden sm:block text-[14.5px] hover:opacity-60 transition-opacity" style={{ color: '#000' }} dir="ltr">
                {phone}
              </a>
            )}
            <a
              href="#v4-sell"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-[14px] text-white transition-opacity hover:opacity-85"
              style={{ background: '#0096f7' }}
            >
              הערכת שווי
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 pt-12 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            <nav aria-label="דירות למכירה">
              <div className="text-[13.5px] mb-3.5" style={{ fontWeight: 600 }}>למכירה</div>
              <ul className="space-y-2 text-[13.5px]" style={{ color: '#666' }}>
                <li><Link href="/apartments?dealType=sale&city=holon" className="hover:text-black transition-colors">דירות למכירה בחולון</Link></li>
                <li><Link href="/apartments?dealType=sale&city=batyam" className="hover:text-black transition-colors">דירות למכירה בבת ים</Link></li>
                <li><Link href="/apartments?dealType=sale&city=rishon" className="hover:text-black transition-colors">דירות למכירה בראשון לציון</Link></li>
                <li><Link href="/apartments?dealType=sale&city=telaviv" className="hover:text-black transition-colors">דירות למכירה בתל אביב</Link></li>
                <li><Link href="/apartments?dealType=sale" className="hover:text-black transition-colors">כל הנכסים למכירה</Link></li>
              </ul>
            </nav>
            <nav aria-label="דירות להשכרה">
              <div className="text-[13.5px] mb-3.5" style={{ fontWeight: 600 }}>להשכרה</div>
              <ul className="space-y-2 text-[13.5px]" style={{ color: '#666' }}>
                <li><Link href="/apartments?dealType=rent&city=holon" className="hover:text-black transition-colors">דירות להשכרה בחולון</Link></li>
                <li><Link href="/apartments?dealType=rent&city=batyam" className="hover:text-black transition-colors">דירות להשכרה בבת ים</Link></li>
                <li><Link href="/apartments?dealType=rent&city=rishon" className="hover:text-black transition-colors">דירות להשכרה בראשון לציון</Link></li>
                <li><Link href="/apartments?dealType=rent&city=telaviv" className="hover:text-black transition-colors">דירות להשכרה בתל אביב</Link></li>
                <li><Link href="/apartments?dealType=rent" className="hover:text-black transition-colors">כל הנכסים להשכרה</Link></li>
              </ul>
            </nav>
            <nav aria-label="מדריכים">
              <div className="text-[13.5px] mb-3.5" style={{ fontWeight: 600 }}>מדריכים</div>
              <ul className="space-y-2 text-[13.5px]" style={{ color: '#666' }}>
                <li><Link href="/articles/mortgage-guide" className="hover:text-black transition-colors">מדריך משכנתא</Link></li>
                <li><Link href="/articles/purchase-tax-guide" className="hover:text-black transition-colors">מס רכישה — מה משלמים</Link></li>
                <li><Link href="/articles/holon-neighborhoods" className="hover:text-black transition-colors">שכונות חולון</Link></li>
                <li><Link href="/articles/pre-purchase-checklist" className="hover:text-black transition-colors">בדיקות לפני קנייה</Link></li>
                <li><Link href="/articles/apartment-pricing" className="hover:text-black transition-colors">איך מתמחרים דירה</Link></li>
                <li><Link href="/articles" className="hover:text-black transition-colors">כל המדריכים</Link></li>
              </ul>
            </nav>
            <nav aria-label="Aiterra">
              <div className="text-[13.5px] mb-3.5" style={{ fontWeight: 600 }}>Aiterra</div>
              <ul className="space-y-2 text-[13.5px]" style={{ color: '#666' }}>
                <li><Link href="/about" className="hover:text-black transition-colors">אודות</Link></li>
                <li><Link href="/apartments" className="hover:text-black transition-colors">כל הנכסים</Link></li>
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-black transition-colors" dir="ltr">{phone}</a>
                  </li>
                )}
                <li><Link href="/privacy-policy" className="hover:text-black transition-colors">מדיניות פרטיות</Link></li>
                <li><Link href="/accessibility" className="hover:text-black transition-colors">הצהרת נגישות</Link></li>
              </ul>
            </nav>
          </div>
          <div
            className="mt-12 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
          >
            <div className="text-[18px]" style={{ fontWeight: 300, letterSpacing: '-0.03em' }}>Aiterra<span style={{ color: '#0096f7' }}>.</span></div>
            <div className="text-[12.5px]" style={{ color: '#999' }}>© {new Date().getFullYear()} Aiterra נדל״ן · חולון והמרכז</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
