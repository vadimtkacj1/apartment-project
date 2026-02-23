"use client";
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const AboutSection: React.FC = memo(() => {
  return (
    <section
      dir="rtl"
      className="relative w-full pt-16 md:pt-32 pb-16 md:pb-12 overflow-hidden bg-warm"
    >
      {/* Top diagonal line decoration - hidden on mobile */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-0 hidden md:block">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[60px] md:h-[80px]"
        >
          <polygon points="0,0 1440,0 1440,80 0,20" fill="#1c3664" opacity="0.85" />
          <polygon points="0,0 1440,0 1440,60 0,5" fill="#4a7ab5" opacity="0.6" />
        </svg>
      </div>

      {/* Mobile top accent bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#1c3664] md:hidden z-0" />

      {/* Bottom diagonal line decoration - hidden on mobile */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 hidden md:block">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[60px] md:h-[80px]"
        >
          <polygon points="0,60 1440,20 1440,80 0,80" fill="#1c3664" opacity="0.85" />
          <polygon points="0,75 1440,35 1440,80 0,80" fill="#4a7ab5" opacity="0.6" />
        </svg>
      </div>

      {/* Mobile bottom accent bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#1c3664] md:hidden z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-20 items-center relative z-10">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 lg:order-2 lg:col-span-3"
          >
            <div className="relative w-full h-[280px] sm:h-[400px] lg:h-[850px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/6.png"
                alt="רם שיווק נכסים & חיים ענבי"
                fill
                className="object-cover object-top scale-105"
                sizes="(max-width: 1024px) 100vw, 65vw"
                priority
              />
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1 lg:col-span-2"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 lg:mb-8 uppercase tracking-tighter"
            >
              אודות
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-5 lg:space-y-8 text-gray-800 leading-relaxed"
            >
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
                רם שיווק נכסים & חיים ענבי הוא משרד תיווך ושיווק נכסים בעל ניסיון של למעלה מ-24 שנה.
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
                המשרד מתמחה במכירה, השכרה וליווי עסקאות נדל״ן במקצועיות גבוהה, עם פעילות מרכזית בחולון, בת ים וכל אזור המרכז. צוות המשרד כולל ארבעה סוכנים, ומציע גישה אישית ומקצועית לכל לקוח.
              </p>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
                אנו מלווים את בעלי הנכסים משלב האפיון, דרך תמחור נכון, צילום ושיווק ממוקד, ניהול משא ומתן ועד לסגירת העסקה בתנאים הטובים ביותר.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 lg:mt-12"
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 lg:px-12 lg:py-6 bg-[#1c3664] text-white font-black text-lg sm:text-xl lg:text-2xl rounded-sm hover:bg-[#152a4f] hover:scale-105 transition-all duration-300 active:scale-95 shadow-lg"
              >
                קראו עוד על המשרד
                <ArrowLeft className="w-6 h-6 lg:w-8 lg:h-8" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;