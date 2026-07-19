import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface Owner {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  licenceNumber: string | null;
}

interface ContactInfo {
  facebook: string | null;
  instagram: string | null;
}

async function getOwners(): Promise<Owner[]> {
  try {
    const owners = await prisma.owner.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        whatsapp: true,
        licenceNumber: true,
      },
      orderBy: { order: 'asc' },
    });
    return owners;
  } catch (error) {
    console.error('Error fetching owners:', error);
    return [];
  }
}

async function getSocialLinks(): Promise<ContactInfo | null> {
  try {
    const contactInfo = await prisma.contactInfo.findFirst({
      select: {
        facebook: true,
        instagram: true,
      },
    });
    return contactInfo;
  } catch (error) {
    console.error('Error fetching social links:', error);
    return null;
  }
}

export default async function Footer() {
  const [owners, socialLinks] = await Promise.all([getOwners(), getSocialLinks()]);

  // Broker license numbers (מספר רישיון תיווך) — surfaced only when present in the data
  const licenceNumbers = owners
    .map((owner) => owner.licenceNumber?.trim())
    .filter((n): n is string => Boolean(n));

  return (
    <footer dir="rtl" className="bg-[#051150] text-white pt-12 pb-10 px-6 lg:px-20 2xl:px-24 relative min-h-70 overflow-hidden flex flex-col items-start justify-start">
      
      {/* City Background - High Visibility Version */}
      <div
        className="absolute bottom-0 left-0 w-full h-[220px] pointer-events-none z-0 hidden md:block"
        style={{
          backgroundImage: `
            linear-gradient(to top, rgba(5,17,80,1) 0%, rgba(5,17,80,0) 30%),
            url('/footer-city-bg.svg')
          `,
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          opacity: '0.9', // Increased opacity for better visibility
          filter: 'brightness(1.5) grayscale(1) contrast(1.2)', // Sharp white lines, no green glow
        }}
      />

      <div className="max-w-7xl 2xl:max-w-600 mx-auto w-full relative z-10 px-4 2xl:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 2xl:gap-12 items-start">

          {/* For Renters Section */}
          <div>
            <div className="text-xl font-bold mb-4 text-white">עבור שוכרים</div>
            <ul className="space-y-2 text-gray-300 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
              <li><Link href="/apartments" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">דירות להשכרה</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">שאלות ותשובות</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">אודותינו</Link></li>
            </ul>
          </div>

          {/* For Owners Section */}
          <div>
            <div className="text-xl font-bold mb-4 text-white">קונים ומוכרים</div>
            <ul className="space-y-2 text-gray-300 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
              <li><Link href="/selling-apartment" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">מכירת נכס</Link></li>
              <li><Link href="/buying-apartment" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">רכישת נכס</Link></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <div className="text-xl font-bold mb-4 text-white">משאבים</div>
            <ul className="space-y-2 text-gray-300 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
              <li><Link href="/articles" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">מאמרים</Link></li>
              <li><Link href="/articles/mortgage-guide" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">מדריך משכנתא</Link></li>
              <li><Link href="/articles/purchase-tax-guide" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">מס רכישה</Link></li>
              <li><Link href="/articles/pre-purchase-checklist" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">בדיקות לפני קנייה</Link></li>
              <li><Link href="/articles/holon-neighborhoods" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">שכונות חולון</Link></li>
              <li><Link href="/articles/selling-alone" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">למכור לבד?</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">מרכז עזרה</Link></li>
              <li><Link href="/links" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">קישורים שימושיים</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <div className="text-xl font-bold mb-4 text-white">החברה</div>
            <ul className="space-y-2 text-gray-300 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
              <li><Link href="/about" className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">אודותינו</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <div>
              <div className="text-xl font-bold mb-2 text-white" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>צור קשר</div>
              <div className="space-y-2 text-gray-400 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
                {owners.map((owner) => (
                  <div key={owner.id} className="space-y-1">
                    <p className="text-white font-semibold">{owner.name}</p>
                    {owner.phone && (
                      <p>
                        <a href={`tel:${owner.phone}`} className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">
                          <span dir="ltr">{owner.phone}</span>
                        </a>
                      </p>
                    )}
                    {owner.email && (
                      <p>
                        <a href={`mailto:${owner.email}`} className="hover:text-white transition-colors underline decoration-gray-500 hover:decoration-white underline-offset-2">
                          <span dir="ltr">{owner.email}</span>
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              {owners[0]?.whatsapp && (
                <SocialIcon
                  icon={<MessageCircle className="w-5 h-5 2xl:w-6 2xl:h-6" />}
                  href={`https://wa.me/${owners[0].whatsapp.replace(/[^0-9]/g, '')}`}
                  hoverClass="hover:bg-[#25D366] hover:text-white"
                  label="WhatsApp"
                />
              )}
              {socialLinks?.instagram && (
                <SocialIcon
                  icon={<Instagram className="w-5 h-5 2xl:w-6 2xl:h-6" />}
                  href={socialLinks.instagram}
                  hoverClass="hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:to-[#ee2a7b] hover:text-white"
                  label="Instagram"
                />
              )}
              {socialLinks?.facebook && (
                <SocialIcon
                  icon={<Facebook className="w-5 h-5 2xl:w-6 2xl:h-6" />}
                  href={socialLinks.facebook}
                  hoverClass="hover:bg-[#1877F2] hover:text-white"
                  label="Facebook"
                />
              )}
            </div>
          </div>
        </div>

        {/* SEO Service Links */}
        <nav aria-label="שירותי המשרד" className="mt-10 pt-8 border-t border-white/10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 justify-center" dir="rtl">
            {[
              { label: 'קניית דירה בחולון', href: '/buying-apartment' },
              { label: 'מכירת דירה בחולון', href: '/selling-apartment' },
              { label: 'דירות להשכרה בחולון', href: '/apartments?dealType=rent' },
              { label: 'דירות למכירה בחולון', href: '/apartments?dealType=sale' },
              { label: 'מדריכים ומאמרים', href: '/articles' },
              { label: 'שאלות ותשובות', href: '/faq' },
              { label: 'אודות המשרד', href: '/about' },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-gray-400 hover:text-gray-300 transition-colors font-medium" style={{ fontSize: 'clamp(11px, 0.85vw, 13px)' }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Legal Content Section */}
        <div className="mt-8 pt-8 border-t-2 border-[#5594f1]/30 text-center">
          <div className="text-[#5594f1] font-bold text-sm uppercase tracking-wide mb-4">
            תוכן משפטי
          </div>

          <p className="text-gray-400 font-medium mb-3" style={{ fontSize: 'clamp(12px, 0.9vw, 15px)' }}>
            © {new Date().getFullYear()} Aiterra נדל"ן בע"מ. כל הזכויות שמורות.
          </p>

          {licenceNumbers.length > 0 && (
            <p className="text-gray-400 font-medium mb-3" style={{ fontSize: 'clamp(12px, 0.9vw, 15px)' }}>
              {licenceNumbers.length > 1 ? 'רישיונות תיווך מס׳ ' : 'רישיון תיווך מס׳ '}
              <span dir="ltr">{licenceNumbers.join(', ')}</span>
            </p>
          )}

          <div className="flex items-center justify-center gap-3 text-gray-400 flex-wrap" style={{ fontSize: 'clamp(12px, 0.85vw, 14px)' }}>
            <Link href="/privacy-policy" className="hover:text-[#5594f1] transition-colors font-medium">
              מדיניות פרטיות
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/accessibility" className="hover:text-[#5594f1] transition-colors font-medium">
              נגישות
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/sitemap.xml" className="hover:text-[#5594f1] transition-colors font-medium">
              מפת האתר
            </Link>
          </div>

          <p className="text-gray-400 font-medium mt-4" style={{ fontSize: 'clamp(11px, 0.85vw, 13px)' }}>
            נבנה על ידי <a href="https://aiterra.co.il/" target="_blank" rel="noopener noreferrer" className="text-gray-300 underline hover:text-[#5594f1] transition-colors">Aiterra</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

{/* Reusable Social Icon Component */}
function SocialIcon({ icon, href, hoverClass, label }: { icon: React.ReactNode, href: string, hoverClass: string, label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`w-10 h-10 2xl:w-12 2xl:h-12 rounded-full bg-[#0c1d63] flex items-center justify-center text-gray-300 transition-all border border-white/10 shadow-lg ${hoverClass}`}
    >
      {icon}
    </a>
  );
}