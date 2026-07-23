"use client";
import React, { useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ContactFormFields from './ContactFormFields';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface ContactFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ContactFormPopup: React.FC<ContactFormPopupProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

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
        onClose();
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
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Custom Scrollbar Styles applied only to the content area */}
          <style jsx global>{`
            .form-scroll-area::-webkit-scrollbar {
              width: 6px;
            }
            .form-scroll-area::-webkit-scrollbar-track {
              background: transparent;
              margin: 10px 0;
            }
            .form-scroll-area::-webkit-scrollbar-thumb {
              background-color: #354ac4;
              border-radius: 10px;
            }
            .form-scroll-area {
              scrollbar-width: thin;
              scrollbar-color: #354ac4 transparent;
            }
          `}</style>

          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100]"
            onClick={onClose}
          />

          {/* Modal Positioning */}
          <m.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[1150] flex items-center justify-center p-4 pointer-events-none"
          >
            {/* Main Container */}
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-popup-title"
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed at the top, no scrollbar here */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-[#E4E8F2] bg-white z-20">
                <h2 id="contact-popup-title" className="text-3xl font-black text-[#051150]" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
                  צור קשר
                </h2>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  aria-label="סגירת חלון יצירת הקשר"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#354AC4] focus-visible:ring-offset-2"
                >
                  <X size={24} className="text-[#051150]" />
                </button>
              </div>

              {/* Scrollable Content Area - Scrollbar starts here */}
              <div className="overflow-y-auto form-scroll-area px-8 pt-8 pb-8">
                <ContactFormFields
                  idPrefix="popup-"
                  resetOnSubmit={true}
                  onSubmitSuccess={onClose}
                />
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactFormPopup;