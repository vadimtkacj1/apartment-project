"use client";
import React, { useState } from 'react';
import { m } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqData } from '@/data/faqData';

// Company line (Organization schema): +972-52-384-7291.
const whatsappUrl = `https://wa.me/972523847291?text=${encodeURIComponent(
  'שלום, הגעתי מעמוד השאלות והתשובות ואשמח לייעוץ',
)}`;

const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const faqItems = faqData;

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      dir="rtl"
      className="relative w-full py-24 md:py-32 overflow-hidden bg-warm"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#051150] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#051150] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex flex-col items-center mb-6"
          >
            <span className="inline-flex items-center gap-2 text-[13px] md:text-sm font-semibold text-[#354AC4]">
              <HelpCircle size={18} aria-hidden="true" />
              שאלות נפוצות
            </span>
          </m.div>

          {/* h2, not h1 — the page's SecondaryHero already renders the h1. */}
          <h2 className="text-5xl md:text-6xl font-black text-[#051150] mb-6">
            שאלות ותשובות
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 font-semibold max-w-3xl mx-auto">
            מצאנו עבורכם את התשובות לשאלות הנפוצות ביותר בתחום הנדל&quot;ן
          </p>
        </m.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <m.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full text-start p-6 md:p-8 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={openId === item.id}
              >
                <span className="text-lg md:text-xl font-bold text-gray-900 flex-1">
                  {item.question}
                </span>
                <m.div
                  animate={{ rotate: openId === item.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    className={`${
                      openId === item.id ? 'text-[#354ac4]' : 'text-gray-400'
                    } transition-colors duration-200`}
                    size={28}
                  />
                </m.div>
              </button>

              <m.div
                initial={false}
                animate={{
                  height: openId === item.id ? 'auto' : 0,
                  opacity: openId === item.id ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </m.div>
            </m.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-[#051150] rounded-3xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
              לא מצאתם תשובה?
            </h3>
            <p className="text-lg md:text-xl text-white/90 mb-6">
              צרו איתנו קשר ונשמח לענות על כל שאלה
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="/#contact"
                className="inline-block bg-white text-[#354ac4] font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                צור קשר
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#5594F1] text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-[#354AC4] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                וואטסאפ
              </a>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  );
};

export default FAQ;
