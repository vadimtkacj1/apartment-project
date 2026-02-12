'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// Убедитесь, что пути к иконкам правильные
const services = [
  {
    icon: '/icons/sale.png', 
    title: 'שיווק דירות למכירה',
    description: 'שיווק מקצועי של דירות למכירה עם תמחור נכון וקהל יעד מדויק'
  },
  {
    icon: '/icons/rent.png',
    title: 'השכרת דירות ונכסים',
    description: 'ניהול תהליך השכרה מלא עם סינון פניות וקביעת פגישות'
  },
  {
    icon: '/icons/management.png',
    title: 'ניהול נכסים למשקיעים',
    description: 'ניהול מקצועי של נכסים להשקעה עם מעקב שוטף'
  },
  {
    icon: '/icons/consulting.png',
    title: 'ייעוץ תמחור',
    description: 'ייעוץ מקצועי לקביעת מחיר אופטימלי להשגת התוצאות הטובות ביותר'
  }
];

export default function AboutServices() {
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, amount: 0.2 });

  return (
    <section 
      ref={servicesRef} 
      className="py-24 w-full bg-[#fdfbf7]" // Теплый фон секции
      dir="rtl" 
    >
      <div className="max-w-[1300px] mx-auto px-6">
        
        {/* Заголовок */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: -20, opacity: 0 }}
          animate={servicesInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c3664] mb-4">
            השירותים שלנו
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
             מעטפת שירותים מלאה בתחום הנדל"ן בחולון
          </p>
        </motion.div>

        {/* Сетка услуг (Grid) */}
        <motion.div 
          // lg:grid-cols-4 выравнивает все 4 элемента в один ряд на ПК
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial="hidden"
          animate={servicesInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              // УБРАЛ: bg-white, shadow, border. Оставил только отступы и выравнивание.
              className="group h-full p-4 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              {/* Иконка (без цветного круга, просто чистая иконка, как просили без фона) */}
              <div className="w-24 h-24 mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                 {/* Если хотите оставить легкий круг под иконкой, раскомментируйте div ниже */}
                 {/* <div className="absolute inset-0 bg-blue-50/50 rounded-full blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
                
                <Image 
                  src={service.icon} 
                  alt={service.title} 
                  width={80} 
                  height={80} 
                  className="object-contain drop-shadow-md"
                />
              </div>

              <h3 className="text-2xl font-bold text-[#1c3664] mb-4">
                {service.title}
              </h3>
              
              <p className="text-slate-500 text-[1.05rem] leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Футер секции (Темно-синий блок) */}
        <motion.div
          className="bg-[#1c3664] text-white p-8 md:p-12 rounded-3xl text-center shadow-xl shadow-blue-900/10 relative overflow-hidden"
          initial={{ y: 30, opacity: 0 }}
          animate={servicesInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Декоративный блик */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

          <p className="text-lg md:text-xl font-medium leading-relaxed max-w-4xl mx-auto relative z-10">
            המטרה שלנו היא להקל על בעלי הנכסים ולחסוך לכם זמן וכסף.
            אנחנו מטפלים בהכל – מצילום ושיווק, דרך סינון קונים ועד לסגירת העסקה.
          </p>
        </motion.div>

      </div>
    </section>
  );
}