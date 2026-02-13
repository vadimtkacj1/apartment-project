'use client';

import { motion } from 'framer-motion';

export default function AboutFounders() {
  return (
    <section className="py-20 w-full bg-[#faf7f2]" dir="rtl">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* H2 Title */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-[#1c3664] mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          המייסדים שלנו
        </motion.h2>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* רם */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#1c3664]">
              רם
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              רם הוא מתווך נדל"ן מנוסה המתמחה בשיווק דירות למכירה בחולון. הוא ידוע בגישה הישירה, ביכולת להבין את צרכי הלקוח במהירות וניהול משא ומתן מדויק שמוביל לתוצאות.
            </p>
          </motion.div>

          {/* חיים ענבי */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#1c3664]">
              חיים ענבי
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              חיים מביא ניסיון רב בתחום התיווך והשיווק, עם הכרות מעמיקה של שכונות חולון והסביבה. הוא מתמקד בליווי אישי, זמינות גבוהה ושירות מקצועי לכל לקוח.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
