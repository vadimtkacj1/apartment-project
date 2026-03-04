"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Instagram, Facebook, ChevronRight, ChevronLeft, X, Mail } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import ContactFormPopup from '@/components/layout/ContactFormPopup';

interface ContactInfo {
  phone: string;
  phoneLink: string;
  phoneName?: string | null;
  phone2?: string | null;
  phoneLink2?: string | null;
  phoneName2?: string | null;
  facebook: string | null;
  facebookName?: string | null;
  facebook2?: string | null;
  facebookName2?: string | null;
  instagram: string | null;
  instagramName?: string | null;
  instagram2?: string | null;
  instagramName2?: string | null;
}

interface Owner {
  id: number;
  name: string;
  whatsapp: string | null;
}

type ContactType = 'whatsapp' | 'instagram' | 'facebook' | 'phone' | 'contact';

const SocialSidebar = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [choiceModal, setChoiceModal] = useState<{ type: ContactType; isOpen: boolean }>({
    type: 'whatsapp',
    isOpen: false,
  });

  useEffect(() => {
    setMounted(true);
    fetchContactInfo();
    fetchOwners();
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

  const fetchOwners = async () => {
    try {
      const response = await fetch('/api/owners');
      if (response.ok) {
        const data = await response.json();
        setOwners(data.slice(0, 2)); // Get first 2 owners
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  const handleContactClick = (type: ContactType, e: React.MouseEvent) => {
    e.preventDefault();

    // Contact form always opens directly without choice
    if (type === 'contact') {
      setIsContactPopupOpen(true);
      return;
    }

    const hasSecondContact =
      (type === 'whatsapp' && owners.length > 1 && owners[1].whatsapp) ||
      (type === 'instagram' && contactInfo?.instagram2) ||
      (type === 'facebook' && contactInfo?.facebook2) ||
      (type === 'phone' && contactInfo?.phone2);

    if (hasSecondContact) {
      setChoiceModal({ type, isOpen: true });
    } else {
      // Open directly if no second contact
      if (type === 'whatsapp' && owners.length > 0 && owners[0].whatsapp) {
        analytics.trackWhatsAppClick();
        const cleanNumber = owners[0].whatsapp.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent('שלום, אני מעוניין בפרטים נוספים')}`, '_blank');
      } else if (type === 'instagram' && contactInfo?.instagram) {
        analytics.trackButtonClick('instagram-sidebar');
        window.open(contactInfo.instagram, '_blank');
      } else if (type === 'facebook' && contactInfo?.facebook) {
        analytics.trackButtonClick('facebook-sidebar');
        window.open(contactInfo.facebook, '_blank');
      } else if (type === 'phone' && contactInfo?.phoneLink) {
        analytics.trackPhoneClick();
        window.location.href = contactInfo.phoneLink;
      }
    }
  };

  const handleChoice = (type: ContactType, choice: 1 | 2) => {
    setChoiceModal({ type, isOpen: false });

    if (type === 'whatsapp') {
      const owner = owners[choice - 1];
      if (owner && owner.whatsapp) {
        analytics.trackWhatsAppClick();
        const cleanNumber = owner.whatsapp.replace(/\D/g, '');
        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent('שלום, אני מעוניין בפרטים נוספים')}`, '_blank');
      }
    } else if (type === 'instagram') {
      const url = choice === 1 ? contactInfo?.instagram : contactInfo?.instagram2;
      if (url) {
        analytics.trackButtonClick('instagram-sidebar');
        window.open(url, '_blank');
      }
    } else if (type === 'facebook') {
      const url = choice === 1 ? contactInfo?.facebook : contactInfo?.facebook2;
      if (url) {
        analytics.trackButtonClick('facebook-sidebar');
        window.open(url, '_blank');
      }
    } else if (type === 'phone') {
      const number = choice === 1 ? contactInfo?.phoneLink : contactInfo?.phoneLink2;
      if (number) {
        analytics.trackPhoneClick();
        window.location.href = number;
      }
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      type: 'whatsapp' as ContactType,
      icon: (
        <svg viewBox="0 0 448 512" className="w-4 h-4 md:w-5 md:h-5" fill="currentColor">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.7 5.5-9.4 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      ),
      bgColor: 'bg-[#25D366]',
    },
    {
      name: 'Instagram',
      type: 'instagram' as ContactType,
      icon: <Instagram className="w-4 h-4 md:w-5 md:h-5" />,
      bgColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
    },
    {
      name: 'Facebook',
      type: 'facebook' as ContactType,
      icon: <Facebook className="w-4 h-4 md:w-5 md:h-5" />,
      bgColor: 'bg-[#1877F2]',
    },
    {
      name: 'Phone',
      type: 'phone' as ContactType,
      icon: <Phone className="w-4 h-4 md:w-5 md:h-5" />,
      bgColor: 'bg-[#0ea5e9]',
    },
    {
      name: 'Contact Form',
      type: 'contact' as ContactType,
      icon: <Mail className="w-4 h-4 md:w-5 md:h-5" />,
      bgColor: 'bg-[#8b5cf6]',
    },
  ];

  // Prevent hydration mismatch by only rendering after mount
  if (!mounted) return null;

  // sidebarWidth matches the w-12 (48px) defined in Tailwind
  const sidebarWidth = 48;

  const getContactLabel = (type: ContactType) => {
    switch (type) {
      case 'whatsapp': return 'WhatsApp';
      case 'instagram': return 'Instagram';
      case 'facebook': return 'Facebook';
      case 'phone': return 'טלפון';
      default: return '';
    }
  };

  return (
    <>
      <ContactFormPopup isOpen={isContactPopupOpen} onClose={() => setIsContactPopupOpen(false)} />

      {/* Choice Modal */}
      <AnimatePresence>
        {choiceModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[900] flex items-center justify-center p-4"
            onClick={() => setChoiceModal({ ...choiceModal, isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
              dir="rtl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  בחר {getContactLabel(choiceModal.type)}
                </h3>
                <button
                  onClick={() => setChoiceModal({ ...choiceModal, isOpen: false })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleChoice(choiceModal.type, 1)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-colors"
                >
                  {choiceModal.type === 'whatsapp' && owners[0] && (
                    <div className="text-center">
                      <div className="text-lg font-bold mb-1">{owners[0].name}</div>
                      {owners[0].whatsapp && (
                        <div className="text-sm opacity-90">{owners[0].whatsapp}</div>
                      )}
                    </div>
                  )}
                  {choiceModal.type === 'instagram' && (
                    <div className="text-lg">{contactInfo?.instagramName || 'Instagram 1'}</div>
                  )}
                  {choiceModal.type === 'facebook' && (
                    <div className="text-lg">{contactInfo?.facebookName || 'Facebook 1'}</div>
                  )}
                  {choiceModal.type === 'phone' && (
                    <div className="text-center">
                      {contactInfo?.phoneName && (
                        <div className="text-lg font-bold mb-1">{contactInfo.phoneName}</div>
                      )}
                      {contactInfo?.phone && (
                        <div className="text-sm opacity-90">{contactInfo.phone}</div>
                      )}
                    </div>
                  )}
                </button>

                <button
                  onClick={() => handleChoice(choiceModal.type, 2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
                >
                  {choiceModal.type === 'whatsapp' && owners[1] && (
                    <div className="text-center">
                      <div className="text-lg font-bold mb-1">{owners[1].name}</div>
                      {owners[1].whatsapp && (
                        <div className="text-sm opacity-90">{owners[1].whatsapp}</div>
                      )}
                    </div>
                  )}
                  {choiceModal.type === 'instagram' && (
                    <div className="text-lg">{contactInfo?.instagramName2 || 'Instagram 2'}</div>
                  )}
                  {choiceModal.type === 'facebook' && (
                    <div className="text-lg">{contactInfo?.facebookName2 || 'Facebook 2'}</div>
                  )}
                  {choiceModal.type === 'phone' && (
                    <div className="text-center">
                      {contactInfo?.phoneName2 && (
                        <div className="text-lg font-bold mb-1">{contactInfo.phoneName2}</div>
                      )}
                      {contactInfo?.phone2 && (
                        <div className="text-sm opacity-90">{contactInfo.phone2}</div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[50] flex items-center"
        initial={false}
        animate={{
          /* On mobile (width < 768), if menu is closed, shift the container left 
             by the exact width of the icons panel (48px) to hide it.
          */
          x: window.innerWidth < 768 
             ? (isMobileMenuOpen ? 0 : -sidebarWidth) 
             : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Main Icons Panel */}
        <div className="bg-[#1c3664] rounded-r-2xl shadow-xl py-2 flex flex-col items-center w-12 md:w-16">
          {socialLinks.map((link, index) => (
            <button
              key={link.name}
              onClick={(e) => handleContactClick(link.type, e)}
              className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white group ${index > 0 ? 'border-t border-white/5' : ''}`}
            >
              <div className={`${link.bgColor} w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                {link.icon}
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Toggle Button - Connected to the panel without gaps */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden bg-[#1c3664] text-white p-2 h-10 flex items-center justify-center rounded-r-lg shadow-lg border-l border-white/10"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </motion.div>
    </>
  );
};

export default SocialSidebar;