"use client";
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ContactFormFields from './ContactFormFields';

interface ContactFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormPopup: React.FC<ContactFormPopupProps> = ({ isOpen, onClose }) => {
  // Prevent background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
              background-color: #C19A6B;
              border-radius: 10px;
            }
            .form-scroll-area {
              scrollbar-width: thin;
              scrollbar-color: #C19A6B transparent;
            }
          `}</style>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Positioning */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            {/* Main Container */}
            <div 
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col pointer-events-auto overflow-hidden" 
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - Fixed at the top, no scrollbar here */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100 bg-white z-20">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                  צור קשר
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                >
                  <X size={24} className="text-gray-900" />
                </button>
              </div>

              {/* Scrollable Content Area - Scrollbar starts here */}
              <div className="flex-1 overflow-y-auto form-scroll-area p-8">
                <ContactFormFields 
                  idPrefix="popup-" 
                  resetOnSubmit={true}
                  onSubmitSuccess={onClose}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactFormPopup;