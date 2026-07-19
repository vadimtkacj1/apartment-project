"use client";
import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Send, Phone } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface ContactFormFieldsProps {
  onSubmitSuccess?: () => void;
  resetOnSubmit?: boolean;
  idPrefix?: string;
  /** When set, the lead is attributed to this property in /api/contact + analytics. */
  propertyId?: string | number;
  /** Lead source label persisted with the inquiry (defaults server-side to "contact_form"). */
  source?: string;
}

export interface FormData {
  name: string;
  phone: string;
  message: string;
  consent: boolean;
}

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({
  onSubmitSuccess,
  resetOnSubmit = false,
  idPrefix = '',
  propertyId,
  source
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    message: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      setSubmitStatus({
        type: 'error',
        message: 'יש לאשר את תנאי השימוש והסכמה'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          // Attribute the lead to a specific property when this form is rendered
          // on a detail page. The API only persists integer propertyIds.
          ...(propertyId != null && propertyId !== ''
            ? { propertyId: Number(propertyId) }
            : {}),
          ...(source ? { source } : {}),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'הפנייה נשלחה בהצלחה! נחזור אליך בקרוב'
        });

        // Track contact form submission (success branch only), attributed to the
        // property when a propertyId was threaded in.
        analytics.trackContactForm(propertyId);

        // Reset form state if enabled
        if (resetOnSubmit) {
          setFormData({ name: '', phone: '', message: '', consent: false });
        }

        // Trigger callback on successful submission
        if (onSubmitSuccess) {
          setTimeout(() => {
            onSubmitSuccess();
          }, 1500);
        }
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'אירעה שגיאה בשליחת הטופס'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'אירעה שגיאה בשליחת הטופס. אנא נסה שוב'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Удаляем все нецифровые символы
    const phoneNumber = value.replace(/[^\d]/g, '');

    // Не форматируем если пусто
    if (!phoneNumber) return '';

    // Форматируем для израильских номеров
    // 05X-XXX-XXXX или 0X-XXX-XXXX
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'phone') {
      // Разрешаем только цифры
      const digitsOnly = value.replace(/[^\d]/g, '');
      // Автоформатирование телефона
      const formattedPhone = formatPhoneNumber(digitsOnly);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name Field */}
      <div>
        <label htmlFor={`${idPrefix}name`} className="block text-lg font-bold text-gray-900 mb-3">
          שם מלא <span className="text-[#051150]">*</span>
        </label>
        <input
          type="text"
          id={`${idPrefix}name`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-[#354ac4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#354ac4]/20 transition-all duration-300"
          placeholder="הזן את שמך המלא"
        />
      </div>

      {/* Phone Number Field */}
      <div>
        <label htmlFor={`${idPrefix}phone`} className="block text-lg font-bold text-gray-900 mb-3">
          טלפון <span className="text-[#051150]">*</span>
        </label>
        <div className="relative">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Phone size={20} className="text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="tel"
            id={`${idPrefix}phone`}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            maxLength={12}
            inputMode="numeric"
            pattern="[0-9-]*"
            className="w-full pr-12 pl-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-[#354ac4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#354ac4]/20 transition-all duration-300"
            placeholder="050-123-4567"
            dir="ltr"
          />
        </div>
      </div>

      {/* Message/Interest Field */}
      <div>
        <label htmlFor={`${idPrefix}message`} className="block text-lg font-bold text-gray-900 mb-3">
          במה אתה מעוניין?
        </label>
        <textarea
          id={`${idPrefix}message`}
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-[#354ac4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#354ac4]/20 transition-all duration-300 resize-none"
          placeholder="ספר לנו במה אתה מעוניין - מכירה, קניה, השכרה... (אופציונלי)"
        />
      </div>

      {/* Legal Consent Checkbox */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            required
            className="mt-1 w-5 h-5 text-[#354ac4] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#354ac4]/20 cursor-pointer"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            אני מאשר/ת לחזור אליי גם בפנייה טלפונית בהתאם להוראות סעיף 16ג לחוק הגנת הצרכן, תשמ"א–1981, ו/או מאשר/ת קבלת דיוור ומידע פרסומי בדוא"ל ו/או באמצעות מסרונים מחברת דניאל ויואב נכסים ו/או חברות הקשורות אליה, ומסכים/ה לתקנון האתר.
          </span>
        </label>
      </div>

      {/* Status Messages */}
      {submitStatus.type && (
        <m.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-center font-bold ${
            submitStatus.type === 'success'
              ? 'bg-green-50 text-green-700 border-2 border-green-200'
              : 'bg-red-50 text-red-700 border-2 border-red-200'
          }`}
        >
          {submitStatus.message}
        </m.div>
      )}

      {/* Submit Button */}
      <m.button
        type="submit"
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { scale: 1.01 } : {}}
        whileTap={!isSubmitting ? { scale: 0.99 } : {}}
        className={`w-full px-8 py-5 text-white font-black text-xl rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group mt-4 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#354ac4] hover:bg-[#28389b]'
        }`}
      >
        <span>{isSubmitting ? 'שולח...' : 'שלח הודעה'}</span>
        {!isSubmitting && (
          <Send
            size={22}
            aria-hidden="true"
            className="transform rotate-180 transition-transform duration-300 group-hover:translate-x-2"
          />
        )}
      </m.button>
    </form>
  );
};

export default ContactFormFields;