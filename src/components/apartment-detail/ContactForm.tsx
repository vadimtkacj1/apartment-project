"use client";
import React from 'react';
import { Phone, CheckCircle2 } from 'lucide-react';
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

export function ContactForm({ propertyId, isSold, owners = [], dealType }: ContactFormProps) {
  return (
    <div className={`rounded-2xl p-6 md:p-8 shadow-xl border ${
      isSold
        ? 'bg-gray-100 border-gray-300 opacity-75'
        : 'bg-white border-gray-100'
    }`}>
      <h3 className={`text-2xl font-black mb-6 uppercase ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`} style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
        מעוניין? צור קשר
      </h3>
      {isSold ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 bg-red-100 text-red-700 px-6 py-4 rounded-lg font-bold mb-4">
            <CheckCircle2 size={24} />
            <span>הנכס {dealType === 'rent' ? 'מושכר' : 'נמכר'}</span>
          </div>
          <p className="text-gray-500">לא ניתן ליצור קשר לגבי נכס זה</p>
        </div>
      ) : (
        <>
          <ContactFormFields
            idPrefix={`property-${propertyId}-`}
            propertyId={propertyId}
            source="property_page"
            compact
            resetOnSubmit
            messagePlaceholder="אשמח לקבל פרטים נוספים על הנכס... (אופציונלי)"
          />
          {owners.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm font-semibold text-gray-600 mb-3">או התקשר ישירות:</p>
              <div className="flex flex-col gap-2">
                {owners.map((owner) => {
                  const contactPhone = owner.phone || owner.whatsapp || '';
                  if (!contactPhone) return null;
                  return (
                    <a
                      key={owner.id}
                      href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                      onClick={() => analytics.trackPhoneClick(propertyId)}
                      className="inline-flex items-center justify-center gap-2 text-lg md:text-xl font-black text-[#1c3664] hover:text-gray-900 transition-colors"
                    >
                      <Phone size={20} />
                      <span>{owner.name} - <span dir="ltr">{contactPhone}</span></span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
