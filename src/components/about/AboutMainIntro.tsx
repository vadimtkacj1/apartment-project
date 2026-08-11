'use client';

import { m } from 'framer-motion';
import Image from 'next/image';

export default function AboutMainIntro() {
  return (
    <section className="py-20 w-full bg-[#faf7f2]" dir="rtl">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* H1 Title */}
        <m.h1
          className="text-4xl md:text-5xl font-extrabold text-[#1c3664] mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          רם וחיים שיווק נכסים
        </m.h1>

        {/* Content: Image + Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <m.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-slate-700 leading-relaxed">
              רם וחיים שיווק נכסים הוא משרד תיווך נדל"ן המתמחה בשיווק, מכירה והשכרה של דירות ונכסים באזור חולון והסביבה.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              עם ניסיון מצטבר של שנים בעולם הנדל"ן, הכרות עמוקה עם השוק המקומי ושיטות עבודה מוכחות, אנחנו מלווים כל לקוח באופן אישי ומקצועי עד להשלמת עסקה בתנאים הטובים ביותר.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              אנחנו מאמינים שתיווך בחולון הוא הרבה מעבר לפרסום נכס – זה תהליך שדורש הבנה אמיתית של צרכי הלקוח, תמחור מדויק, שיווק חכם וניהול משא ומתן נכון. בין אם מדובר בדירה למכירה, דירה להשכרה או נכס להשקעה, אנחנו דואגים למצוא את הקונה או השוכר המתאימים ביותר, בזמן הקצר ביותר ובמחיר הנכון.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              השירות שלנו מבוסס על ליווי אישי, שקיפות מלאה ותכנון אסטרטגי לכל נכס. כל לקוח מקבל יחס אישי, ייעוץ מקצועי ועדכונים שוטפים לאורך כל הדרך – מהפגישה הראשונה ועד לחתימת החוזה.
            </p>
          </m.div>

          {/* Image */}
          <m.div
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Image
              src="/holon.jpg"
              alt="רם וחיים"
              fill
              className="object-cover"
            />
          </m.div>

        </div>
      </div>
    </section>
  );
}
