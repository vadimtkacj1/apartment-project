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
  const owners = await getOwners();
  const socialLinks = await getSocialLinks();

  return (
    <footer dir="rtl" className="bg-[#1a1a1a] text-white pt-12 pb-10 px-6 lg:px-20 2xl:px-24 relative min-h-70 overflow-hidden flex flex-col items-start justify-start">
      
      {/* City Background - High Visibility Version */}
      <div
        className="absolute bottom-0 left-0 w-full h-[220px] pointer-events-none z-0 hidden md:block"
        style={{
          backgroundImage: `
            linear-gradient(to top, rgba(26,26,26,1) 0%, rgba(26,26,26,0) 30%),
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
            <h4 className="text-xl font-bold mb-4 text-white">עבור שוכרים</h4>
            <ul className="space-y-2 text-gray-400 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
              <li><Link href="/apartments" className="hover:text-white transition-colors">דירות להשכרה</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">שאלות ותשובות</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">אודותינו</Link></li>
            </ul>
          </div>

          {/* For Owners Section */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-white">עבור משכירים</h4>
            <ul className="space-y-2 text-gray-400 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
              <li><Link href="/selling-apartment" className="hover:text-white transition-colors">מכירת נכס</Link></li>
              <li><Link href="/buying-apartment" className="hover:text-white transition-colors">רכישת נכס</Link></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-white">משאבים</h4>
            <ul className="space-y-2 text-gray-400 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
              <li><Link href="/articles" className="hover:text-white transition-colors">מאמרים</Link></li>
              <li><Link href="/articles/selling-alone" className="hover:text-white transition-colors">למכור לבד?</Link></li>
              <li><Link href="/articles/foreign-investors" className="hover:text-white transition-colors">משקיעים זרים</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">מרכז עזרה</Link></li>
              <li><Link href="/links" className="hover:text-white transition-colors">קישורים שימושיים</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-xl font-bold mb-4 text-white">החברה</h4>
            <ul className="space-y-2 text-gray-400 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
              <li><Link href="/about" className="hover:text-white transition-colors">אודותינו</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">מדיניות פרטיות</Link></li>
              <li><Link href="/accessibility" className="hover:text-white transition-colors">הצהרת נגישות</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-4">
            <div>
              <h4 className="text-xl font-bold mb-2 text-white" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>צור קשר</h4>
              <div className="space-y-2 text-gray-400 font-medium" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>
                {owners.map((owner) => (
                  <div key={owner.id} className="space-y-1">
                    <p className="text-white font-semibold">{owner.name}</p>
                    {owner.phone && (
                      <p>
                        <a href={`tel:${owner.phone}`} className="hover:text-white transition-colors">
                          {owner.phone}
                        </a>
                      </p>
                    )}
                    {owner.email && (
                      <p>
                        <a href={`mailto:${owner.email}`} className="hover:text-white transition-colors">
                          {owner.email}
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
                />
              )}
              {socialLinks?.instagram && (
                <SocialIcon
                  icon={<Instagram className="w-5 h-5 2xl:w-6 2xl:h-6" />}
                  href={socialLinks.instagram}
                  hoverClass="hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:to-[#ee2a7b] hover:text-white"
                />
              )}
              {socialLinks?.facebook && (
                <SocialIcon
                  icon={<Facebook className="w-5 h-5 2xl:w-6 2xl:h-6" />}
                  href={socialLinks.facebook}
                  hoverClass="hover:bg-[#1877F2] hover:text-white"
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom / Copyright */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-500 font-medium" style={{ fontSize: 'clamp(12px, 0.9vw, 16px)' }}>
            © {new Date().getFullYear()} H&R נדל"ן בע"מ
          </p>
        </div>
      </div>
    </footer>
  );
}

{/* Reusable Social Icon Component */}
function SocialIcon({ icon, href, hoverClass }: { icon: React.ReactNode, href: string, hoverClass: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-10 h-10 2xl:w-12 2xl:h-12 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-300 transition-all border border-white/5 shadow-lg ${hoverClass}`}
    >
      {icon}
    </a>
  );
}