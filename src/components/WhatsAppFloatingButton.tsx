'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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

  useEffect(() => {
    if (isOpen && owners.length === 0) {
      fetchOwners();
    }
  }, [isOpen]);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/owners');
      const data = await response.json();
      setOwners(data.slice(0, 2)); // Get only first 2 owners
    } catch (error) {
      console.error('Error fetching owners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = (whatsapp: string | null, name: string) => {
    if (!whatsapp) return;

    // Remove any non-digit characters from whatsapp
    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
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
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed left-6 bottom-24 z-50 bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-colors duration-300"
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
      </motion.button>

      {/* Popup Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-[800]"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[850] bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="סגור"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-6 mt-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
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
                    <motion.div
                      key={owner.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-[#25D366] hover:bg-green-50 transition-all duration-300"
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
                      <div className="flex-1 text-right">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {owner.name}
                        </h4>
                        <p className="text-sm text-gray-600">{owner.title}</p>
                      </div>

                      {/* WhatsApp Button */}
                      <button
                        onClick={() => handleWhatsAppClick(owner.whatsapp, owner.name)}
                        disabled={!owner.whatsapp}
                        className={`bg-[#25D366] text-white p-3 rounded-full hover:bg-[#20BA5A] transition-colors duration-300 shrink-0 ${
                          !owner.whatsapp ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        aria-label={`WhatsApp ${owner.name}`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </button>
                    </motion.div>
                  ))}

                  {owners.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      אין אנשי קשר זמינים כרגע
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
