'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutMarketing() {
  return (
    <section className="relative py-20 w-full bg-[#faf7f2] overflow-hidden" dir="rtl">
      {/* Decorative shapes - more elements, brighter colors */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          {/* Curved organic shapes */}
          <path d="M 10% 25% Q 17% 30%, 12% 40% T 10% 50%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 90% 55% Q 83% 60%, 88% 70% T 90% 80%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 16% 20% Q 22% 25%, 19% 35% T 16% 45%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          <path d="M 84% 60% Q 78% 65%, 81% 75% T 84% 85%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          
          {/* Organic blobs */}
          <ellipse cx="18%" cy="40%" rx="42" ry="30" fill="#4a7ab5" opacity="0.3" transform="rotate(-22 18% 40%)"/>
          <ellipse cx="82%" cy="65%" rx="38" ry="27" fill="#4a7ab5" opacity="0.3" transform="rotate(28 82% 65%)"/>
          <ellipse cx="25%" cy="25%" rx="40" ry="28" fill="#a8c5e8" opacity="0.28" transform="rotate(25 25% 25%)"/>
          <ellipse cx="75%" cy="70%" rx="36" ry="24" fill="#a8c5e8" opacity="0.28" transform="rotate(-20 75% 70%)"/>
          <ellipse cx="50%" cy="45%" rx="34" ry="23" fill="#b8d0f0" opacity="0.26" transform="rotate(18 50% 45%)"/>
          
          {/* Curved rounded shapes */}
          <rect x="25%" y="30%" width="26" height="26" rx="8"
            fill="#4a7ab5" opacity="0.35"
            transform="rotate(32 calc(25% + 13) calc(30% + 13))"
          />
          <rect x="75%" y="60%" width="24" height="24" rx="7"
            fill="#4a7ab5" opacity="0.33"
            transform="rotate(-28 calc(75% - 12) calc(60% + 12))"
          />
          <rect x="32%" y="20%" width="22" height="22" rx="7"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(35 calc(32% + 11) calc(20% + 11))"
          />
          <rect x="68%" y="75%" width="22" height="22" rx="7"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(-30 calc(68% - 11) calc(75% + 11))"
          />
          <rect x="50%" y="50%" width="20" height="20" rx="6"
            fill="#b8d0f0" opacity="0.3"
            transform="rotate(28 calc(50% + 10) calc(50% + 10))"
          />
          
          {/* Organic flowing shapes */}
          <path d="M 32% 50% C 37% 45%, 42% 50%, 37% 55% C 32% 60%, 27% 55%, 32% 50% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 68% 40% C 73% 35%, 78% 40%, 73% 45% C 68% 50%, 63% 45%, 68% 40% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 38% 30% C 43% 25%, 48% 30%, 43% 35% C 38% 40%, 33% 35%, 38% 30% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 62% 65% C 67% 60%, 72% 65%, 67% 70% C 62% 75%, 57% 70%, 62% 65% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 45% 55% C 50% 50%, 55% 55%, 50% 60% C 45% 65%, 40% 60%, 45% 55% Z" fill="#b8d0f0" opacity="0.24"/>
          <path d="M 55% 35% C 60% 30%, 65% 35%, 60% 40% C 55% 45%, 50% 40%, 55% 35% Z" fill="#b8d0f0" opacity="0.24"/>
        </svg>
      </div>

      {/* Floating accent dots */}
      <div className="absolute left-10 top-[40%] w-3 h-3 rounded-full bg-[#1c3664] opacity-32 pointer-events-none z-0"/>
      <div className="absolute right-14 top-[25%] w-2 h-2 rounded-full bg-[#1c3664] opacity-38 pointer-events-none z-0"/>
      <div className="absolute left-20 bottom-[30%] w-3.5 h-3.5 rounded-full bg-[#1c3664] opacity-26 pointer-events-none z-0"/>

      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">

        {/* H2 Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-[#1c3664] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          שיווק נדל"ן בגישה מתקדמת
        </motion.h2>

        {/* Content: Text + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Image (on the right for RTL) */}
          <motion.div
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/pc-man.jpg"
              alt="שיווק נדל״ן בגישה מתקדמת"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="space-y-6 order-1 md:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-lg text-slate-700 leading-relaxed">
              שיווק נכס היום דורש הרבה יותר מלוח מודעות. אנחנו משלבים שיטות שיווק מתקדמות כדי להגיע לקונים ולשוכרים המתאימים:
            </p>

            <ul className="space-y-3 text-lg text-slate-700">
              <li className="flex items-start gap-3">
                <span className="text-[#1c3664] font-bold">•</span>
                <span>פרסום מדוקם באינטרנט ובתשתרות חברתיות</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1c3664] font-bold">•</span>
                <span>צילום מקצועי והצגת הנכס בצורה אטרקטיבית</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1c3664] font-bold">•</span>
                <span>מאגר לקוחות פעילים המחפשים נכסים בחולון</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#1c3664] font-bold">•</span>
                <span>ניהול משא ומתן מקצועי להשגת המחיר הטוב ביותר</span>
              </li>
            </ul>

            <p className="text-lg text-slate-700 leading-relaxed">
              השילוב בין ניסיון מקומי, שיווק חכם וליווי אישי יוצר תהליך יעיל שמוביל לעסקאות מוצלחות.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
