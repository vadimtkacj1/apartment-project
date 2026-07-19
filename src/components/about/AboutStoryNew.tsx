'use client';

import { m } from 'framer-motion';
import Image from 'next/image';

export default function AboutStoryNew() {
  return (
    <section className="relative py-20 md:py-24 w-full overflow-hidden bg-[#f5f7fb]" dir="rtl">
      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">
        <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">

          {/* Text Content */}
          <m.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >

            <h2 className="font-caramel text-3xl md:text-4xl font-black text-[#051150] mb-6">
              הסיפור שלנו
            </h2>

            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              דניאל ויואב הקימו את המשרד מתוך מטרה ליצור סטנדרט חדש של תיווך נדל"ן בחולון. לאחר שנים של עבודה בשוק המקומי, הם זיהו את הצורך בשירות אישי, שקוף ומקצועי יותר עבור בעלי נכסים וקונים.
            </p>

            {/* Editorial pull-quote */}
            <blockquote className="font-caramel border-s-4 border-[#354AC4] ps-5 my-8 text-2xl font-bold text-[#051150] leading-snug">
              אנחנו מאמינים ששירות אישי, שקיפות ותמחור מדויק הם ההבדל בין עסקה טובה לעסקה מצוינת.
            </blockquote>

            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              הגישה שלהם מבוססת על אמינות, עבודה יסודית והבנה עמוקה של כל עסקה. במקום שיווק כללי ולא ממוקד, הם בנו שיטת עבודה שמתחילה בתמחור נכון, ממשיכה בשיווק ממוקד ומסתיימת בניהול משא ומתן מדויק.
            </p>

            <p className="text-lg text-slate-700 leading-relaxed">
              עם השנים המשרד גדל, הצוות התרחב וכיום דניאל ויואב מלווים עשרות עסקאות של דירות למכירה ודירות להשכרה בחולון מדי שנה.
            </p>
          </m.div>

          {/* Image */}
          <m.figure
            className="w-full md:w-1/2"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Image src="/images/about/story.jpg" alt="משרד Aiterra" width={1200} height={675} className="w-full h-auto rounded-2xl shadow-xl shadow-blue-900/10" />
          </m.figure>

        </div>
      </div>
    </section>
  );
}
