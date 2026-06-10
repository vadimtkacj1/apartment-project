import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, CheckCircle2 } from 'lucide-react';
import { ContactFormData } from './types';
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
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.trackContactForm(propertyId);
  };

  return (
    <div className={`rounded-2xl p-8 shadow-xl border ${
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">שם מלא *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#1c3664] focus:bg-white focus:outline-none transition-all"
                placeholder="הזן שם מלא"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">טלפון *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#1c3664] focus:bg-white focus:outline-none transition-all"
                placeholder="050-123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">הודעה</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-[#1c3664] focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="ספר לנו עוד..."
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-[#1c3664] text-white font-black text-lg uppercase rounded-xl shadow-lg hover:bg-[#152a4f] transition-all flex items-center justify-center gap-2"
            >
              <span>שלח הודעה</span>
              <Send size={20} className="transform rotate-180" />
            </motion.button>
          </form>
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
                      className="inline-flex items-center justify-center gap-2 text-xl font-black text-[#1c3664] hover:text-gray-900 transition-colors"
                    >
                      <Phone size={20} />
                      <span>{owner.name} - {contactPhone}</span>
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
