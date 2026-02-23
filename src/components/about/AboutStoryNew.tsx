'use client';

import { motion } from 'framer-motion';

export default function AboutStoryNew() {
  return (
    <section className="relative py-20 w-full bg-[#faf7f2] overflow-hidden" dir="rtl">
      {/* Wave line at top - more wavy */}
      <div className="absolute top-0 left-0 w-full pointer-events-none z-0 hidden md:block" aria-hidden="true">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[80px] md:h-[100px]"
        >
          <path d="M0,0 L1440,0 L1440,100 C1200,80 800,60 600,70 C400,80 200,60 0,90 Z" fill="#4a7ab5" opacity="0.35" />
          <path d="M0,0 L1440,0 L1440,85 C1200,65 800,45 600,55 C400,65 200,45 0,75 Z" fill="#7aa3d1" opacity="0.25" />
          <path d="M0,0 L1440,0 L1440,70 C1200,50 800,30 600,40 C400,50 200,30 0,60 Z" fill="#a8c5e8" opacity="0.2" />
        </svg>
      </div>

      {/* Mobile top accent bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#4a7ab5] md:hidden z-0" />

      {/* Decorative shapes - more elements, brighter colors */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          {/* Curved organic shapes */}
          <path d="M 6% 35% Q 13% 40%, 9% 50% T 6% 60%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 94% 45% Q 87% 50%, 91% 60% T 94% 70%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 12% 25% Q 18% 30%, 15% 40% T 12% 50%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          <path d="M 88% 55% Q 82% 60%, 85% 70% T 88% 80%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          
          {/* Organic blobs */}
          <ellipse cx="20%" cy="40%" rx="38" ry="26" fill="#4a7ab5" opacity="0.3" transform="rotate(-18 20% 40%)"/>
          <ellipse cx="80%" cy="55%" rx="36" ry="24" fill="#4a7ab5" opacity="0.3" transform="rotate(22 80% 55%)"/>
          <ellipse cx="15%" cy="60%" rx="32" ry="22" fill="#a8c5e8" opacity="0.28" transform="rotate(15 15% 60%)"/>
          <ellipse cx="85%" cy="35%" rx="34" ry="23" fill="#a8c5e8" opacity="0.28" transform="rotate(-20 85% 35%)"/>
          <ellipse cx="50%" cy="25%" rx="30" ry="20" fill="#b8d0f0" opacity="0.25" transform="rotate(10 50% 25%)"/>
          <ellipse cx="50%" cy="75%" rx="28" ry="19" fill="#b8d0f0" opacity="0.25" transform="rotate(-12 50% 75%)"/>
          
          {/* Curved rounded shapes */}
          <rect x="28%" y="30%" width="20" height="20" rx="6"
            fill="#4a7ab5" opacity="0.35"
            transform="rotate(28 calc(28% + 10) calc(30% + 10))"
          />
          <rect x="72%" y="60%" width="20" height="20" rx="6"
            fill="#4a7ab5" opacity="0.35"
            transform="rotate(-22 calc(72% - 10) calc(60% + 10))"
          />
          <rect x="35%" y="20%" width="18" height="18" rx="5"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(35 calc(35% + 9) calc(20% + 9))"
          />
          <rect x="65%" y="70%" width="18" height="18" rx="5"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(-30 calc(65% - 9) calc(70% + 9))"
          />
          <rect x="45%" y="50%" width="16" height="16" rx="4"
            fill="#b8d0f0" opacity="0.3"
            transform="rotate(25 calc(45% + 8) calc(50% + 8))"
          />
          
          {/* Organic flowing shapes */}
          <path d="M 35% 45% C 40% 40%, 45% 45%, 40% 50% C 35% 55%, 30% 50%, 35% 45% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 65% 35% C 70% 30%, 75% 35%, 70% 40% C 65% 45%, 60% 40%, 65% 35% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 25% 50% C 30% 45%, 35% 50%, 30% 55% C 25% 60%, 20% 55%, 25% 50% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 75% 50% C 80% 45%, 85% 50%, 80% 55% C 75% 60%, 70% 55%, 75% 50% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 40% 30% C 45% 25%, 50% 30%, 45% 35% C 40% 40%, 35% 35%, 40% 30% Z" fill="#b8d0f0" opacity="0.24"/>
          <path d="M 60% 65% C 65% 60%, 70% 65%, 65% 70% C 60% 75%, 55% 70%, 60% 65% Z" fill="#b8d0f0" opacity="0.24"/>
        </svg>
      </div>

      {/* Floating accent dots */}
      <div className="absolute left-1/4 top-[20%] w-2.5 h-2.5 rounded-full bg-[#1c3664] opacity-32 pointer-events-none z-0"/>
      <div className="absolute right-1/4 top-[30%] w-3 h-3 rounded-full bg-[#1c3664] opacity-30 pointer-events-none z-0"/>
      <div className="absolute left-1/3 bottom-[25%] w-2 h-2 rounded-full bg-[#1c3664] opacity-35 pointer-events-none z-0"/>
      <div className="absolute right-1/3 bottom-[30%] w-3.5 h-3.5 rounded-full bg-[#1c3664] opacity-28 pointer-events-none z-0"/>

      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">

        {/* H2 Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-[#1c3664] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          הסיפור שלנו
        </motion.h2>

        {/* Story Content */}
        <motion.div
          /* הוספתי text-center כאן כדי שכל הפסקאות יתיישרו למרכז */
          className="max-w-4xl mx-auto space-y-6 text-center" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg text-slate-700 leading-relaxed">
            רם וחיים הקימו את המשרד מתוך מטרה ליצור סטנדרט חדש של תיווך נדל"ן בחולון. לאחר שנים של עבודה בשוק המקומי, הם זיהו את הצורך בשירות אישי, שקוף ומקצועי יותר עבור בעלי נכסים וקונים.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed">
            הגישה שלהם מבוססת על אמינות, עבודה יסודית והבנה עמוקה של כל עסקה. במקום שיווק כללי ולא ממוקד, הם בנו שיטת עבודה שמתחילה בתמחור נכון, ממשיכה בשיווק ממוקד ומסתיימת בניהול משא ומתן מדויק.
          </p>

          <p className="text-lg text-slate-700 leading-relaxed">
            עם השנים המשרד גדל, הצוות התרחב וכיום רם וחיים שיווק נכסים מלווה עשרות עסקאות של דירות למכירה ודירות להשכרה בחולון מדי שנה.
          </p>
        </motion.div>
      </div>
    </section>
  );
}