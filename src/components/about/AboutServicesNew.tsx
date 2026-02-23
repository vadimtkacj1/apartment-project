'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutServicesNew() {
  return (
    <section className="relative py-20 w-full bg-[#faf7f2] overflow-hidden" dir="rtl">
      {/* Decorative shapes - more elements, brighter colors */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          {/* Curved organic shapes */}
          <path d="M 8% 30% Q 15% 35%, 10% 45% T 8% 55%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 92% 50% Q 85% 55%, 90% 65% T 92% 75%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 14% 25% Q 20% 30%, 17% 40% T 14% 50%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          <path d="M 86% 55% Q 80% 60%, 83% 70% T 86% 80%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          
          {/* Organic blobs */}
          <ellipse cx="15%" cy="45%" rx="40" ry="28" fill="#4a7ab5" opacity="0.3" transform="rotate(-20 15% 45%)"/>
          <ellipse cx="85%" cy="60%" rx="35" ry="25" fill="#4a7ab5" opacity="0.3" transform="rotate(25 85% 60%)"/>
          <ellipse cx="22%" cy="30%" rx="36" ry="24" fill="#a8c5e8" opacity="0.28" transform="rotate(22 22% 30%)"/>
          <ellipse cx="78%" cy="70%" rx="33" ry="22" fill="#a8c5e8" opacity="0.28" transform="rotate(-18 78% 70%)"/>
          <ellipse cx="50%" cy="20%" rx="30" ry="20" fill="#b8d0f0" opacity="0.26" transform="rotate(15 50% 20%)"/>
          <ellipse cx="50%" cy="80%" rx="28" ry="19" fill="#b8d0f0" opacity="0.26" transform="rotate(-15 50% 80%)"/>
          
          {/* Curved rounded shapes */}
          <rect x="22%" y="35%" width="24" height="24" rx="7"
            fill="#4a7ab5" opacity="0.35"
            transform="rotate(30 calc(22% + 12) calc(35% + 12))"
          />
          <rect x="78%" y="55%" width="22" height="22" rx="6"
            fill="#4a7ab5" opacity="0.33"
            transform="rotate(-25 calc(78% - 11) calc(55% + 11))"
          />
          <rect x="28%" y="20%" width="20" height="20" rx="6"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(32 calc(28% + 10) calc(20% + 10))"
          />
          <rect x="72%" y="75%" width="20" height="20" rx="6"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(-28 calc(72% - 10) calc(75% + 10))"
          />
          <rect x="48%" y="50%" width="18" height="18" rx="5"
            fill="#b8d0f0" opacity="0.3"
            transform="rotate(25 calc(48% + 9) calc(50% + 9))"
          />
          
          {/* Organic flowing shapes */}
          <path d="M 30% 50% C 35% 45%, 40% 50%, 35% 55% C 30% 60%, 25% 55%, 30% 50% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 70% 40% C 75% 35%, 80% 40%, 75% 45% C 70% 50%, 65% 45%, 70% 40% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 35% 25% C 40% 20%, 45% 25%, 40% 30% C 35% 35%, 30% 30%, 35% 25% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 65% 65% C 70% 60%, 75% 65%, 70% 70% C 65% 75%, 60% 70%, 65% 65% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 42% 60% C 47% 55%, 52% 60%, 47% 65% C 42% 70%, 37% 65%, 42% 60% Z" fill="#b8d0f0" opacity="0.24"/>
          <path d="M 58% 30% C 63% 25%, 68% 30%, 63% 35% C 58% 40%, 53% 35%, 58% 30% Z" fill="#b8d0f0" opacity="0.24"/>
        </svg>
      </div>

      {/* Floating accent dots */}
      <div className="absolute right-10 top-[35%] w-3 h-3 rounded-full bg-[#1c3664] opacity-35 pointer-events-none z-0"/>
      <div className="absolute left-12 top-[70%] w-2.5 h-2.5 rounded-full bg-[#1c3664] opacity-30 pointer-events-none z-0"/>
      <div className="absolute right-16 bottom-[15%] w-3.5 h-3.5 rounded-full bg-[#1c3664] opacity-28 pointer-events-none z-0"/>

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
