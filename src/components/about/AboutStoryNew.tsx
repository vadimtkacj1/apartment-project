'use client';

import { motion } from 'framer-motion';

export default function AboutStoryNew() {
  return (
    <section className="py-20 w-full bg-[#faf7f2]" dir="rtl">
      <div className="max-w-[1200px] mx-auto px-6">

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