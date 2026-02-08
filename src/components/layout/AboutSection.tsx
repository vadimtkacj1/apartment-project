"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section
      dir="rtl"
      className="relative w-full py-24 md:py-32 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Right Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/car.jpeg"
                alt="logo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#C19A6B] rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#C19A6B] rounded-full blur-3xl opacity-20"></div>
          </motion.div>

          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight"
            >
              אודות
            </motion.h2>

            {/* Decorative Line */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="w-24 h-1 bg-gradient-to-r from-[#C19A6B] to-transparent mb-8"
            ></motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl font-bold text-gray-900 mb-6"
            >
              שיווק נכסים - משרד תיווך ושיווק נכסים שקיים יותר מ24 שנה
            </motion.p>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6 text-gray-700 leading-relaxed"
            >
              <p className="text-lg md:text-xl">
                רם וחיים שיווק נכסים הוא משרד תיווך מקומי המתמחה במכירה, השכרה ושיווק נכסים באזור חולון, בת-ים וכל אזור המרכז. המשרד פועל בגישה אישית ומקצועית, עם היכרות עמוקה של השוק המקומי, קהל הקונים והדינמיקה בכל שכונה.
              </p>

              <p className="text-lg md:text-xl">
                אנחנו מלווים בעלי נכסים ורוכשים משלב האפיון הראשוני, דרך תמחור נכון, צילום ושיווק ממוקד, ניהול משא ומתן ועד לסגירת העסקה. הדגש שלנו הוא על שקיפות, זמינות ושירות מדויק שמוביל לתוצאות. בין אם מדובר בדירת מגורים, נכס להשקעה או השכרה – אנחנו כאן כדי להוביל אתכם לעסקה נכונה ובטוחה.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10"
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-12 py-5 bg-[#C19A6B] text-white font-black text-xl uppercase tracking-tight rounded-sm shadow-xl hover:bg-gray-900 hover:scale-105 transition-all duration-300 active:scale-95"
              >
                לפרטים נוספים
                <ArrowLeft className="w-6 h-6" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
