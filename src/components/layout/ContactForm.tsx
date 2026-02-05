"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Clock } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section
      dir="rtl"
      className="relative w-full py-24 md:py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#C19A6B] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#C19A6B] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-[#C19A6B] font-bold text-lg uppercase tracking-wider">
              צור קשר
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight">
            בואו נדבר
          </h2>

          <div className="w-32 h-1 bg-[#C19A6B] mx-auto mb-6"></div>

          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            השאירו פרטים ונחזור אליכם בהקדם האפשרי
          </p>
        </motion.div>

        {/* Contact Form - Centered */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
              <div className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-lg font-bold text-gray-900 mb-3">
                    שם מלא <span className="text-[#C19A6B]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-[#C19A6B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all duration-300"
                    placeholder="הזן את שמך המלא"
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label htmlFor="phone" className="block text-lg font-bold text-gray-900 mb-3">
                    טלפון <span className="text-[#C19A6B]">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-[#C19A6B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all duration-300"
                    placeholder="050-123-4567"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="message" className="block text-lg font-bold text-gray-900 mb-3">
                    במה אתה מעוניין? <span className="text-[#C19A6B]">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 text-lg focus:border-[#C19A6B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C19A6B]/20 transition-all duration-300 resize-none"
                    placeholder="ספר לנו במה אתה מעוניין - מכירה, קניה, השכרה..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-5 bg-[#C19A6B] text-white font-black text-xl uppercase tracking-tight rounded-xl shadow-xl hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-3 group mt-8"
                >
                  <span>שלח הודעה</span>
                  <Send
                    size={24}
                    className="transform rotate-180 transition-transform duration-300 group-hover:translate-x-2"
                  />
                </motion.button>

                {/* Contact Info Text */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-gray-600 font-semibold mb-2">או צור קשר ישירות:</p>
                  <a
                    href="tel:+972123456789"
                    className="text-2xl font-black text-[#C19A6B] hover:text-gray-900 transition-colors"
                  >
                    03-123-4567
                  </a>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
