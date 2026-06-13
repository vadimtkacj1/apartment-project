'use client';

import { m } from 'framer-motion';

export default function AboutStoryNew() {
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
          הסיפור שלנו
        </m.h2>

        {/* Story Content */}
        <m.div
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
        </m.div>
      </div>
    </section>
  );
}