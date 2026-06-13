'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import { MapPin, Target, Handshake, Zap, ShieldCheck, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: MapPin, 
    title: 'מומחיות מקומית',
    description: 'הכרות עמוקה עם כל שכונה, רחוב ובניין בחולון'
  },
  {
    icon: Target, 
    title: 'שיווק ממוקד',
    description: 'פרסום חכם שמגיע בדיוק לקהל היעד הרלוונטי'
  },
  {
    icon: Handshake, 
    title: 'ליווי אישי',
    description: 'שירות צמוד ואישי לכל לקוח לאורך כל התהליך'
  },
  {
    icon: Zap, 
    title: 'תהליך מהיר',
    description: 'ניסיון שמאפשר סגירת עסקאות במהירות וביעילות'
  },
  {
    icon: ShieldCheck, 
    title: 'אמינות ושקיפות',
    description: 'עבודה ישרה וישירה עם דגש על אמון ושקיפות מלאה'
  },
  {
    icon: BarChart3, 
    title: 'תמחור מדויק',
    description: 'הבנה עמוקה של השוק לקביעת מחיר אופטימלי'
  }
];

export default function AboutWhyUs() {
  const whyRef = useRef(null);
  const whyInView = useInView(whyRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={whyRef}
      className="py-24 w-full bg-white"
      dir="rtl"
    >
      <div className="max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">
        {/* Заголовок */}
        <m.div
          className="text-center mb-20"
          initial={{ y: -20, opacity: 0 }}
          animate={whyInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c3664] mb-4">
            למה לבחור בנו?
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            אנחנו לא רק מתווכים – אנחנו שותפים שלכם להצלחה
          </p>
        </m.div>

        {/* Сетка Grid */}
        <m.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          initial="hidden"
          animate={whyInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <m.div
                key={index}
                className="flex flex-col items-center text-center group"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
              >
                {/* Иконка */}
                <div className="mb-6 flex items-center justify-center text-[#1c3664] group-hover:scale-110 transition-transform duration-300 ease-out">
                  <Icon strokeWidth={1.2} className="w-16 h-16" />
                </div>

                <h3 className="text-2xl font-bold text-[#1c3664] mb-3 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-[1.05rem] text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {feature.description}
                </p>
              </m.div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}