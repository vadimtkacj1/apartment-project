'use client';

import { m } from 'framer-motion';

export default function AboutTeamNew() {
  return (
    <section className="py-20 w-full bg-[#faf7f2]" dir="rtl">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* H2 Title */}
        <m.h2
          className="text-3xl md:text-4xl font-bold text-[#1c3664] mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          הצוות המקצועי
        </m.h2>

        {/* Subtitle */}
        <m.p
          className="text-lg text-slate-600 text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          סוכני הנדל"ן המומחים שלנו כאן כדי לעזור לכם בכל שלב – משלב החיפוש הראשוני ועד לסגירת העסקה.
        </m.p>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* ליאור */}
          <m.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#1c3664]">
              ליאור
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              ליאור היא סוכנת נדל"ן המתמחה בדירות להשכרה ובאיתור נכסים המתאימים לצרכי הלקוח.
            </p>
          </m.div>

          {/* תומר */}
          <m.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-[#1c3664]">
              תומר
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              תומר היא סוכנת נדל"ן המתמחה בדירות למכירה בחולון, עם דגש על שירות אישי וניהול תהליך יעיל ומדויק.
            </p>
          </m.div>

        </div>
      </div>
    </section>
  );
}
