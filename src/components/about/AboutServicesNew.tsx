'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import { Check } from 'lucide-react';

const services = [
  'שיווק דירות למכירה בחולון',
  'השכרת דירות ונכסים',
  'ניהול נכסים למשקיעים',
  'ייעוץ תמחור לפני מכירה או השכרה',
];

export default function AboutServicesNew() {
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
              השכרה, מכירה וניהול נכסים
            </h2>

            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              אנחנו מציעים מעטפת שירותים מלאה בתחום הנדל"ן בחולון:
            </p>

            <ul className="space-y-3 text-lg text-slate-700 mb-6">
              {services.map((service) => (
                <li key={service} className="flex items-start gap-3">
                  <Check size={20} strokeWidth={2.5} className="mt-1 shrink-0 text-[#354AC4]" aria-hidden="true" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>

            <p className="text-lg text-slate-700 leading-relaxed">
              המטרה שלנו היא להקל על בעלי הנכסים ולחסוך להם זמן, טעויות וכסף. אנחנו מטפלים בכל שלבי התהליך – מצילום ושיווק הנכס, דרך סינון פניות וקביעת פגישות ועד לסגירת עסקה בתנאים הטובים ביותר.
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
            <Image src="/images/about/services.jpg" alt="מסירת מפתחות דירה" width={1200} height={675} className="w-full h-auto rounded-2xl shadow-xl shadow-blue-900/10" />
          </m.figure>

        </div>
      </div>
    </section>
  );
}
