'use client';

import { m } from 'framer-motion';
import Image from 'next/image';

export default function AboutLocalExpertise() {
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
          מומחיות מקומית בחולון
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
              המשרד שלנו פועל בלב חולון ומתמחה בשיווק נדל"ן בחולון בלבד. ההכרות העמוקה עם שכונות העיר, סוגי הבניינים, מחירי השוק והביקושים מאפשרת לנו לבצע תמחור מדויק ולהביא את הנכס לקהל היעד המתאים.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              אנחנא עובדים יום-יום עם מוכרים, קונים, משכירים ושוכרים בעיר ולכן מכירים את השוק מבפנים – החל מדירות יד שנייה דרך דירות חדשות ועד נכסים להשקעה. הניסיון המקומי שלנו מאפשר לנו להוביל עסקאות בצורה חכמה, מהירה ומדויקת יותר.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              אם אתם מחפשים דירה למכירה בחולון, דירה להשכרה בחולון או רוצים למכור נכס בעיר – אתם צריכים צוות שמכיר כל רחוב, כל שכונה וכל הזדמנויות.
            </p>
          </m.div>

          <figure className="mt-10">
            <Image src="/images/about/expertise.jpg" alt="שכונת מגורים בחולון" width={1200} height={675} className="w-full h-auto rounded-2xl shadow-xl shadow-blue-900/10" />
          </figure>

        </div>
      </div>
    </section>
  );
}
