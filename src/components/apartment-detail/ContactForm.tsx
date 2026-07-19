import React from 'react';
import { Phone, CheckCircle2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import ContactFormFields from '@/components/layout/ContactFormFields';
import { analytics } from '@/lib/analytics';
import { DealType } from '@/types/property.types';

interface Owner {
  id: number;
  name: string;
  phone?: string;
  whatsapp?: string;
}

interface ContactFormProps {
  propertyId: string;
  isSold: boolean;
  owners?: Owner[];
  dealType?: DealType;
}

function formatWhatsAppNumber(num: string): string {
  const digits = num.replace(/\D/g, '');
  if (digits.startsWith('972')) return digits;
  if (digits.startsWith('0')) return '972' + digits.slice(1);
  return '972' + digits;
}

export function ContactForm({ propertyId, isSold, owners = [], dealType }: ContactFormProps) {
  // Single primary contact for the consolidated phone + WhatsApp row (the full
  // per-agent list lives in PropertyAgentBlock — this avoids the duplicated
  // phone list that used to sit at the bottom of this card).
  const primaryContact = owners.find((o) => o.phone || o.whatsapp);
  const contactPhone = primaryContact?.phone || primaryContact?.whatsapp || '';
  const whatsappRaw = primaryContact?.whatsapp || primaryContact?.phone || '';
  const whatsappLink = whatsappRaw ? `https://wa.me/${formatWhatsAppNumber(whatsappRaw)}` : null;

  return (
    <div className={`rounded-2xl p-8 shadow-xl border ${
      isSold
        ? 'bg-gray-100 border-gray-300 opacity-75'
        : 'bg-white border-gray-100'
    }`}>
      <h3 className={`text-2xl font-black mb-6 ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`} style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
        מעוניין? צור קשר
      </h3>
      {isSold ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 bg-red-100 text-red-700 px-6 py-4 rounded-lg font-bold mb-4">
            <CheckCircle2 size={24} aria-hidden="true" />
            <span>הנכס {dealType === 'rent' ? 'מושכר' : 'נמכר'}</span>
          </div>
          <p className="text-gray-500">לא ניתן ליצור קשר לגבי נכס זה</p>
        </div>
      ) : (
        <>
          {/* Real async POST to /api/contact (disabled-while-submitting, success/
              error status, reset, §16ג consent) — analytics fire on success only,
              attributed to this property via propertyId. */}
          <ContactFormFields
            idPrefix="property-"
            propertyId={propertyId}
            source="property_detail"
            resetOnSubmit
          />

          {(contactPhone || whatsappLink) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-600 mb-3 text-center">או דברו איתנו ישירות</p>
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                {contactPhone && (
                  <a
                    href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                    onClick={() => analytics.trackPhoneClick(propertyId)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#354AC4] text-[#354AC4] font-bold hover:bg-[#354AC4] hover:text-white transition-colors"
                  >
                    <Phone size={20} aria-hidden="true" />
                    <span dir="ltr">{contactPhone}</span>
                  </a>
                )}
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analytics.trackWhatsAppClick(propertyId)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-colors shadow-md"
                  >
                    <FaWhatsapp size={20} aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
