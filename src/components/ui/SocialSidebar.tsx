"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Instagram, Facebook } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import ContactFormPopup from '@/components/layout/ContactFormPopup';

interface ContactInfo {
  phone: string;
  phoneLink: string;
  facebook: string | null;
  instagram: string | null;
}

const SocialSidebar = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

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

  const phoneNumber = '972501234567';
  const whatsappMessage = 'שלום, אני מעוניין/ת בפרטים נוספים';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const facebook = contactInfo?.facebook || '#';
  const instagram = contactInfo?.instagram || '#';

  const handleWhatsAppClick = () => {
    analytics.trackWhatsAppClick();
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();
    analytics.trackPhoneClick();
    setIsContactPopupOpen(true);
  };

  const handleInstagramClick = () => {
    analytics.trackButtonClick('instagram-sidebar');
  };

  const handleFacebookClick = () => {
    analytics.trackButtonClick('facebook-sidebar');
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg viewBox="0 0 448 512" width="20" height="20" fill="currentColor">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.7 5.5-9.4 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      ),
      href: whatsappUrl,
      bgColor: 'bg-[#25D366]',
      onClick: handleWhatsAppClick,
    },
    {
      name: 'Instagram',
      icon: <Instagram size={20} />,
      href: instagram,
      bgColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
      onClick: handleInstagramClick,
    },
    {
      name: 'Facebook',
      icon: <Facebook size={20} />,
      href: facebook,
      bgColor: 'bg-[#1877F2]',
      onClick: handleFacebookClick,
    },
    {
      name: 'Phone',
      icon: <Phone size={20} />,
      href: '#',
      // UPDATED: Changed from sidebar color to a visible Sky Blue color to create a circle
      bgColor: 'bg-[#0ea5e9]', 
      onClick: handlePhoneClick,
    },
  ];

  return (
    <>
      <ContactFormPopup isOpen={isContactPopupOpen} onClose={() => setIsContactPopupOpen(false)} />

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
      >
        <div className="bg-[#1c3664] rounded-r-3xl shadow-2xl overflow-hidden py-2">
          {/* Social Icons List */}
          <div className="flex flex-col">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.name !== 'Phone' && link.name !== 'WhatsApp' ? '_blank' : undefined}
                rel={link.name !== 'Phone' && link.name !== 'WhatsApp' ? 'noopener noreferrer' : undefined}
                onClick={link.onClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-16 h-16
                  flex items-center justify-center
                  text-white
                  transition-all duration-300
                  group relative
                  ${index > 0 ? 'border-t border-white/10' : ''}
                `}
                aria-label={link.name}
              >
                <div className={`${link.bgColor} w-10 h-10 rounded-full flex items-center justify-center relative`}>
                  {link.icon}
                </div>

                {/* Tooltip */}
                <span className="absolute left-full ml-3 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl">
                  {link.name === 'WhatsApp' && 'צור קשר בוואטסאפ'}
                  {link.name === 'Instagram' && 'עקבו אחרינו באינסטגרם'}
                  {link.name === 'Facebook' && 'עקבו אחרינו בפייסבוק'}
                  {link.name === 'Phone' && 'צור קשר'}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SocialSidebar;