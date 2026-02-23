'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutLocalExpertise() {
  return (
    <section className="relative py-20 w-full bg-[#faf7f2] overflow-hidden" dir="rtl">
      {/* Decorative shapes - more elements, brighter colors */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          {/* Curved organic shapes */}
          <path d="M 5% 20% Q 12% 25%, 8% 35% T 5% 45%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 95% 60% Q 88% 65%, 92% 75% T 95% 85%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 10% 30% Q 16% 35%, 13% 45% T 10% 55%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          <path d="M 90% 50% Q 84% 55%, 87% 65% T 90% 75%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          
          {/* Organic blobs */}
          <ellipse cx="12%" cy="40%" rx="35" ry="25" fill="#4a7ab5" opacity="0.3" transform="rotate(-15 12% 40%)"/>
          <ellipse cx="88%" cy="70%" rx="30" ry="20" fill="#4a7ab5" opacity="0.3" transform="rotate(20 88% 70%)"/>
          <ellipse cx="18%" cy="25%" rx="32" ry="22" fill="#a8c5e8" opacity="0.28" transform="rotate(18 18% 25%)"/>
          <ellipse cx="82%" cy="75%" rx="28" ry="19" fill="#a8c5e8" opacity="0.28" transform="rotate(-22 82% 75%)"/>
          <ellipse cx="50%" cy="50%" rx="26" ry="18" fill="#b8d0f0" opacity="0.26" transform="rotate(12 50% 50%)"/>
          
          {/* Curved squares with rounded corners */}
          <rect x="18%" y="25%" width="22" height="22" rx="6"
            fill="#4a7ab5" opacity="0.35"
            transform="rotate(25 calc(18% + 11) calc(25% + 11))"
          />
          <rect x="82%" y="65%" width="20" height="20" rx="5"
            fill="#4a7ab5" opacity="0.33"
            transform="rotate(-30 calc(82% - 10) calc(65% + 10))"
          />
          <rect x="30%" y="15%" width="18" height="18" rx="5"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(30 calc(30% + 9) calc(15% + 9))"
          />
          <rect x="70%" y="80%" width="18" height="18" rx="5"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(-25 calc(70% - 9) calc(80% + 9))"
          />
          <rect x="55%" y="40%" width="16" height="16" rx="4"
            fill="#b8d0f0" opacity="0.3"
            transform="rotate(20 calc(55% + 8) calc(40% + 8))"
          />
          
          {/* Organic flowing shapes */}
          <path d="M 25% 50% C 30% 45%, 35% 50%, 30% 55% C 25% 60%, 20% 55%, 25% 50% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 75% 30% C 80% 25%, 85% 30%, 80% 35% C 75% 40%, 70% 35%, 75% 30% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 40% 60% C 45% 55%, 50% 60%, 45% 65% C 40% 70%, 35% 65%, 40% 60% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 60% 20% C 65% 15%, 70% 20%, 65% 25% C 60% 30%, 55% 25%, 60% 20% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 45% 35% C 50% 30%, 55% 35%, 50% 40% C 45% 45%, 40% 40%, 45% 35% Z" fill="#b8d0f0" opacity="0.24"/>
        </svg>
      </div>

      {/* Floating accent dots */}
      <div className="absolute left-8 top-[25%] w-3 h-3 rounded-full bg-[#1c3664] opacity-30 pointer-events-none z-0"/>
      <div className="absolute right-12 top-[60%] w-2 h-2 rounded-full bg-[#1c3664] opacity-35 pointer-events-none z-0"/>
      <div className="absolute left-16 bottom-[20%] w-4 h-4 rounded-full bg-[#1c3664] opacity-25 pointer-events-none z-0"/>

      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">

        {/* H2 Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-[#1c3664] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          מומחיות מקומית בחולון
        </motion.h2>

        {/* Content: Text + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Image (on the right for RTL) */}
          <motion.div
            className="relative h-[350px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl order-2 md:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/keys.jpeg"
              alt="מומחיות מקומית בחולון"
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
              המשרד שלנו פועל בלב חולון ומתמחה בשיווק נדל"ן בחולון בלבד. ההכרות העמוקה עם שכונות העיר, סוגי הבניינים, מחירי השוק והביקושים מאפשרת לנו לבצע תמחור מדויק ולהביא את הנכס לקהל היעד המתאים.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              אנחנא עובדים יום-יום עם מוכרים, קונים, משכירים ושוכרים בעיר ולכן מכירים את השוק מבפנים – החל מדירות יד שנייה דרך דירות חדשות ועד נכסים להשקעה. הניסיון המקומי שלנו מאפשר לנו להוביל עסקאות בצורה חכמה, מהירה ומדויקת יותר.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              אם אתם מחפשים דירה למכירה בחולון, דירה להשכרה בחולון או רוצים למכור נכס בעיר – אתם צריכים צוות שמכיר כל רחוב, כל שכונה וכל הזדמנויות.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
