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
      className="relative w-full pt-24 md:pt-32 pb-0 overflow-hidden bg-warm"
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
                src="/images/buildings.jpeg"
                alt="רם שיווק נכסים & חיים ענבי"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#1c3664] rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-[#1c3664] rounded-full blur-3xl opacity-20"></div>
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

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6 text-gray-700 leading-relaxed"
            >
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                רם שיווק נכסים & חיים ענבי הוא משרד תיווך וקוויק נכסים בעל ניסיון של למעלה מ-24 שנה.
              </p>

              <p className="text-lg md:text-xl">
                המשרד מתמחה במכירה, השכרה וליווי עסקאות נדל״ן במקצועיות גבוהה, עם פעילות מרכזית בחולון, בת ים וכל אזור המרכז. צוות המשרד כולל ארבעה סוכנים, ומציע גישה אישית ומקצועית לכל לקוח.
              </p>

              <p className="text-lg md:text-xl">
                אנו מלווים את בעלי הנכסים משלב האפיון, דרך תמחור נכון, צילום ושיווק ממוקד, ניהול משא ומתן ועד לסגירת העסקה בתנאים הטובים ביותר. המשרד מתמחה בהשכרת דירות, מכירת דירות, נכסים להשקעה ופתרונות נדל״ן בהתאמה אישית, מתוך היכרות עמוקה עם השוק המקומי והקונים הפוטנציאליים.
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
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#1c3664] text-white font-black text-xl rounded-sm shadow-xl hover:bg-[#152a4f] hover:scale-105 transition-all duration-300 active:scale-95"
              >
                קראו עוד על המשרד
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