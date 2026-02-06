"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ContactFormFieldsProps {
  onSubmitSuccess?: () => void;
  resetOnSubmit?: boolean;
  idPrefix?: string;
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
  idPrefix = ''
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    message: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      alert('יש לאשר את תנאי השימוש והסכמה');
      return;
    }
    
    // Log submission data (Replace with your API call)
    console.log('Form submitted:', formData);
    
    // Reset form state if enabled
    if (resetOnSubmit) {
      setFormData({ name: '', phone: '', message: '', consent: false });
    }
    
    // Trigger callback on successful submission
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name Field */}
      <div>
        <label htmlFor={`${idPrefix}name`} className="block text-lg font-bold text-gray-900 mb-3">
          שם מלא <span className="text-[#C19A6B]">*</span>
        </label>
        <input
          type="text"
          id={`${idPrefix}name`}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-[#C19A6B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all duration-300"
          placeholder="הזן את שמך המלא"
        />
      </div>

      {/* Phone Number Field */}
      <div>
        <label htmlFor={`${idPrefix}phone`} className="block text-lg font-bold text-gray-900 mb-3">
          טלפון <span className="text-[#C19A6B]">*</span>
        </label>
        <input
          type="tel"
          id={`${idPrefix}phone`}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-[#C19A6B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all duration-300"
          placeholder="050-123-4567"
        />
      </div>

      {/* Message/Interest Field */}
      <div>
        <label htmlFor={`${idPrefix}message`} className="block text-lg font-bold text-gray-900 mb-3">
          במה אתה מעוניין? <span className="text-[#C19A6B]">*</span>
        </label>
        <textarea
          id={`${idPrefix}message`}
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-[#C19A6B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all duration-300 resize-none"
          placeholder="ספר לנו במה אתה מעוניין - מכירה, קניה, השכרה..."
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
            className="mt-1 w-5 h-5 text-[#C19A6B] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#C19A6B]/20 cursor-pointer"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            אני מאשר/ת לחזור אליי גם בפנייה טלפונית בהתאם להוראות סעיף 16ג לחוק הגנת הצרכן, תשמ"א–1981, ו/או מאשר/ת קבלת דיוור ומידע פרסומי בדוא"ל ו/או באמצעות מסרונים מחברת רם וחיים נכסים ו/או חברות הקשורות אליה, ומסכים/ה לתקנון האתר.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full px-8 py-5 bg-[#C19A6B] text-white font-black text-xl uppercase tracking-tight rounded-xl shadow-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-3 group mt-4"
      >
        <span>שלח הודעה</span>
        <Send
          size={22}
          className="transform rotate-180 transition-transform duration-300 group-hover:translate-x-2"
        />
      </motion.button>

      {/* Direct Contact Option */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-gray-500 font-semibold mb-1">או צור קשר ישירות:</p>
        <a
          href="tel:+972123456789"
          className="text-2xl font-black text-[#C19A6B] hover:text-gray-900 transition-colors"
        >
          03-123-4567
        </a>
      </div>
    </form>
  );
};

export default ContactFormFields;