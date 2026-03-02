'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutMarketing() {
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
