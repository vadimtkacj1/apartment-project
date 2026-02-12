"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

interface ContactInfo {
  phone: string;
  phoneLink: string;
  email: string;
  emailLink: string;
  address: string;
  city: string;
  weekdayHours: string;
  fridayHours: string;
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  // ערכי ברירת מחדל לפי התמונה שלך
  const phone = contactInfo?.phone || '03-5551234';
  const phoneLink = contactInfo?.phoneLink || 'tel:+97235551234';
  const email = contactInfo?.email || 'info@apartment-realty.co.il';
  const emailLink = contactInfo?.emailLink || 'mailto:info@apartment-realty.co.il';
  const address = contactInfo?.address || 'רחוב סוקולוב 50';
  const city = contactInfo?.city || 'חולון';
  const weekdayHours = contactInfo?.weekdayHours || 'ראשון - חמישי: 9:00 - 18:00';
  const fridayHours = contactInfo?.fridayHours || 'שישי: 9:00 - 13:00';
  const facebook = contactInfo?.facebook || '#';
  const instagram = contactInfo?.instagram || '#';
  const linkedin = contactInfo?.linkedin || '#';

  return (
    <footer dir="rtl" className="bg-[#0a101f] text-white py-12 px-6 lg:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Grid ראשי - 4 עמודות */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
          
          {/* 1. לוגו ואודות (צד ימין בתמונה) */}
          <div className="space-y-6">
            <div className="flex flex-col items-start gap-4">
              <div className="bg-white rounded-full p-2 w-20 h-20 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="H&R Logo"
                  width={65}
                  height={65}
                  className="rounded-full object-contain"
                />
              </div>
              <p className="text-gray-400 text-sm font-medium">מומחים בתחום הנדל"ן</p>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-[280px]">
              משרד תיווך ושיווק נכסים ופרויקטים של לדל״י ג׳ זיווג למכירה והשכרה, בחולון, בת-ים, יפו ודרום תל אביב.
            </p>
          </div>

          {/* 2. קישורים מהירים */}
          <div className="lg:pr-8">
            <h4 className="text-lg font-bold mb-6">קישורים מהירים</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">דף הבית</Link></li>
              <li><Link href="/apartments" className="hover:text-white transition-colors">נכסים למכירה</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">אודות</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">שאלות ותשובות</Link></li>
              <li><Link href="/#contact" className="hover:text-white transition-colors">צור קשר</Link></li>
            </ul>
          </div>

          {/* 2.5. קישורים שימושיים */}
          <div className="lg:pr-8">
            <h4 className="text-lg font-bold mb-6">קישורים שימושיים</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/links" className="hover:text-white transition-colors">
                  קישורים שימושיים
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. צור קשר */}
          <div>
            <h4 className="text-lg font-bold mb-6">צור קשר</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-gray-300">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <a href={phoneLink} className="hover:text-white">{phone}</a>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a href={emailLink} className="hover:text-white break-all">{email}</a>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                <span>{address}, {city}</span>
              </li>
            </ul>
          </div>

          {/* 4. עקבו אחרינו (צד שמאל בתמונה) */}
          <div className="flex flex-col items-start lg:items-center">
            <h4 className="text-lg font-bold mb-6 w-full lg:text-right">עקבו אחרינו</h4>
            <div className="flex gap-3 mb-8">
              <a href={facebook} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all border border-white/10"><Facebook size={18} /></a>
              <a href={instagram} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600 transition-all border border-white/10"><Instagram size={18} /></a>
              <a href={linkedin} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-700 transition-all border border-white/10"><Linkedin size={18} /></a>
            </div>
            
            {/* קופסת שעות פעילות */}
            <div className="bg-[#161d2b] border border-white/5 rounded-xl p-4 w-full">
              <h5 className="text-xs font-bold text-white mb-3 tracking-wider">שעות פעילות</h5>
              <div className="space-y-1 text-xs text-gray-400">
                <p>{weekdayHours}</p>
                <p>{fridayHours}</p>
              </div>
            </div>
          </div>

        </div>

        {/* פס תחתון */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} כל הזכויות שמורות ל-H&R נדל"ן.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-300">תנאי שימוש</Link>
            <Link href="#" className="hover:text-gray-300">מדיניות פרטיות</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}