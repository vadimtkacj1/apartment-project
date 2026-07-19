'use client';

import { m } from 'framer-motion';
import Image from 'next/image';

export default function AboutLocalExpertise() {
  return (
    <section className="relative py-20 md:py-24 w-full overflow-hidden bg-white" dir="rtl">
      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Text Content */}
          <m.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >

            <h2 className="font-caramel text-3xl md:text-4xl font-black text-[#051150] mb-6">
              מומחיות מקומית בחולון
            </h2>

            <div className="space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                המשרד שלנו פועל בלב חולון ומתמחה בשיווק נדל"ן בחולון בלבד. ההכרות העמוקה עם שכונות העיר, סוגי הבניינים, מחירי השוק והביקושים מאפשרת לנו לבצע תמחור מדויק ולהביא את הנכס לקהל היעד המתאים.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                אנחנו עובדים יום-יום עם מוכרים, קונים, משכירים ושוכרים בעיר ולכן מכירים את השוק מבפנים – החל מדירות יד שנייה דרך דירות חדשות ועד נכסים להשקעה. הניסיון המקומי שלנו מאפשר לנו להוביל עסקאות בצורה חכמה, מהירה ומדויקת יותר.
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                אם אתם מחפשים דירה למכירה בחולון, דירה להשכרה בחולון או רוצים למכור נכס בעיר – אתם צריכים צוות שמכיר כל רחוב, כל שכונה וכל הזדמנות.
              </p>
            </div>
          </m.div>

          {/* Image */}
          <m.figure
            className="w-full md:w-1/2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Image src="/images/about/expertise.jpg" alt="שכונת מגורים בחולון" width={1200} height={675} className="w-full h-auto rounded-2xl shadow-xl shadow-blue-900/10" />
          </m.figure>

        </div>
      </div>
    </section>
  );
}
