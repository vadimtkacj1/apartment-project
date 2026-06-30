'use client';

import { m } from 'framer-motion';

export default function AboutMarketing() {
  return (
    <section className="relative py-20 w-full overflow-hidden bg-[#faf7f2]" dir="rtl">
      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">

        {/* H2 Title */}
        <m.h2
          className="text-3xl md:text-4xl font-bold text-[#1c3664] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          שיווק נדל"ן בגישה מתקדמת
        </m.h2>

        {/* Content (images hidden for now) */}
        <div className="max-w-3xl mx-auto">

          {/* Text Content */}
          <m.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
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
          </m.div>

        </div>
      </div>
    </section>
  );
}
