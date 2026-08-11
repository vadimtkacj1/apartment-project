'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Owner {
  id: number;
  name: string;
  title: string;
  image: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  description: string | null;
}

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isOpen && owners.length === 0) {
      fetchOwners();
    }
  }, [isOpen]);

  // Scroll lock (with scrollbar-gutter compensation), focus management,
  // Escape-to-close and a simple Tab trap while the dialog is open.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingInlineEnd = `${scrollbarWidth}px`;
    }
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.body.style.paddingInlineEnd = '';
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/owners', {
        cache: 'no-store'
      });
      const data = await response.json();
      setOwners(data.slice(0, 2)); // Get only first 2 owners
    } catch (error) {
      console.error('Error fetching owners:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatWhatsAppNumber = (num: string): string => {
    const digits = num.replace(/\D/g, '');
    if (digits.startsWith('972')) return digits;
    if (digits.startsWith('0')) return '972' + digits.slice(1);
    return '972' + digits;
  };

  const handleWhatsAppClick = (whatsapp: string | null, name: string) => {
    if (!whatsapp) return;

    const cleanWhatsapp = formatWhatsAppNumber(whatsapp);
    const message = encodeURIComponent(`שלום, אני מעוניין/ת לקבל מידע נוסף`);
    const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${message}`;

    window.open(whatsappUrl, '_blank');
  };

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {/* Stacks directly above the accessibility launcher (Sienna `.asw-menu-btn`),
          which is fixed at left:30px / bottom:30px and is 58×58 on desktop but
          42×42 at ≤768px. We share its 30px left edge, and sit a ~16px gap above
          its top edge — which is at 88px on desktop and 72px on mobile — so the two
          controls read as one tidy vertical stack instead of a crooked, overlapping
          pair. The `md:` breakpoint (≥768px) tracks Sienna's own size switch. */}
      <m.button
        onClick={() => setIsOpen(true)}
        className="fixed left-[30px] bottom-[88px] md:bottom-[104px] z-50 bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </m.button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[1100]"
            />

            {/* Modal Content */}
            <m.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="whatsapp-picker-title"
              dir="rtl"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1150] bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6"
            >
              {/* Close Button */}
              <button
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                className="absolute top-4 end-4 rounded-full text-gray-400 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#354AC4] focus-visible:ring-offset-2"
                aria-label="סגירת חלון בחירת איש קשר"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-6 mt-2">
                <h3 id="whatsapp-picker-title" className="text-2xl font-bold text-gray-800 mb-2">
                  צור קשר ב-WhatsApp
                </h3>
                <p className="text-gray-600">
                  בחר את איש הקשר המועדף עליך
                </p>
              </div>

              {/* Owners List */}
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#25D366]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {owners.map((owner) => (
                    <m.button
                      key={owner.id}
                      type="button"
                      onClick={() => handleWhatsAppClick(owner.whatsapp, owner.name)}
                      disabled={!owner.whatsapp}
                      aria-label={`שליחת הודעת WhatsApp אל ${owner.name}`}
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 text-start transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#354AC4] focus-visible:ring-offset-2 ${
                        owner.whatsapp
                          ? 'hover:border-[#25D366] hover:bg-green-50 cursor-pointer'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* Owner Image */}
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        {owner.image ? (
                          <Image
                            src={owner.image}
                            alt={owner.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                            {owner.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Owner Info */}
                      <div className="flex-1 text-start">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {owner.name}
                        </h4>
                        <p className="text-sm text-gray-600">{owner.title}</p>
                      </div>

                      {/* WhatsApp Icon */}
                      <span
                        aria-hidden="true"
                        className="bg-[#25D366] text-white p-3 rounded-full shrink-0 flex items-center justify-center"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </span>
                    </m.button>
                  ))}

                  {owners.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      אין אנשי קשר זמינים כרגע
                    </div>
                  )}
                </div>
              )}
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
