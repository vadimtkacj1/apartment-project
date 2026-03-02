'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutServicesNew() {
  return (
    <section className="relative py-20 w-full overflow-hidden bg-[#faf7f2]" dir="rtl">
      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">

        {/* H2 Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-[#1c3664] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          השכרה, מכירה וניהול נכסים
        </motion.h2>

        {/* Content: Image + Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-slate-700 leading-relaxed">
              אנחנו מציעים מעטפת שירותים מלאה בתחום הנדל"ן בחולון:
            </p>

            <ul className="space-y-3 text-lg text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-[#1c3664] font-bold">•</span>
                <span>שיווק דירות למכירה בחולון</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1c3664] font-bold">•</span>
                <span>השכרת דירות ונכסים</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1c3664] font-bold">•</span>
                <span>ניהול נכסים למשקיעים</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1c3664] font-bold">•</span>
                <span>ייעוץ תמחור לפני מכירה או השכרה</span>
              </li>
            </ul>

            <p className="text-lg text-slate-700 leading-relaxed">
              המטרה שלנו היא להקל על בעלי הנכסים ולחסוך להם זמן, טעויות וכסף. אנחנו מטפלים בכל שלבי התהליך – מצילום ושיווק הנכס, דרך סינון פניות וקביעת פגישות ועד לסגירת עסקה בתנאים הטובים ביותר.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Image
              src="/apartment.jpg"
              alt="השכרה, מכירה וניהול נכסים"
              fill
              className="object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
