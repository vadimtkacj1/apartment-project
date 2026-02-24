'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutLocalExpertise() {
  return (
    <section className="relative py-20 w-full overflow-hidden" dir="rtl">
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
