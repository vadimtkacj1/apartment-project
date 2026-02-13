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
      className="py-24 w-full bg-[#faf7f2]" // Теплый фон секции
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

        {/* Сетка услуг (Grid) - Clean design без фона */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12"
          initial="hidden"
          animate={servicesInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              <div className="flex items-start gap-6 text-right">
                {/* Icon - larger and with subtle hover */}
                <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={80}
                    height={80}
                    className="object-contain drop-shadow-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1c3664] mb-3 leading-tight">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-lg leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Subtle bottom border for separation */}
              <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}