"use client";
import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Home, Calculator, FileCheck } from 'lucide-react';

const ProcessSection: React.FC = () => {
  const [title, setTitle] = useState('מה חשוב לדעת כשקונים נכס?');

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await fetch('/api/homepage-titles', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTitle(data.processSectionTitle || 'מה חשוב לדעת כשקונים נכס?');
        }
      } catch (error) {
        console.error('Error fetching title:', error);
      }
    };
    fetchTitle();
  }, []);

  const steps = [
    {
      number: "01",
      title: "הגדרת מסגרת תקציב",
      description: "עליכם להכיר לעומק את מחירי השוק באזור בו אתם מחפשים, חשוב שנבין בדיוק מה נכון לדרוש בתקציב שלנו, כמו כן, מומלץ להשאיר ברזרבתכם תקציב נוסף של כ-10% מעל למחיר הנכס לתשלומים שונים כגון: עמלת תיווך, עורך דין, מיסים, שיפוץ וכו'.",
      icon: Home,
    },
    {
      number: "02",
      title: "בירור פיננסי",
      description: "מומלץ להיפגש עם יועץ משכנתאות טרם חיפוש הנכס שלכם על מנת לדעת בדיוק מה התקציב הרעיוני לו שואפים, מה יהיה היקף המשכנתא, ומה יהיה גובה התחזה החודשי שלכם.",
      icon: Calculator,
    },
    {
      number: "03",
      title: "שמאי",
      description: "מומלץ להביא שמאי שיודע עם הבנק שדרכו אתם מתכוונים לקחת משכנתאות לפני חתימת חוזה המכר על מנת להבטיח שהנכס שאתם עומדים לרכוש הוא תקין ולא חורגת בניה.",
      icon: FileCheck,
    },
  ];

  return (
    <section
      dir="rtl"
      className="relative w-full py-24 md:py-32 overflow-hidden bg-warm"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#1c3664] rounded-full blur-3xl opacity-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#1c3664] rounded-full blur-3xl opacity-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="text-[#1c3664] font-bold text-lg uppercase tracking-wider">
              מדריך
            </span>
          </m.div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tight" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            {title}
          </h2>
        </m.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <m.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="relative group"
              >
                {/* Card Container */}
                <div className="relative h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                  {/* Background Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-gray-900/90 group-hover:from-[#1c3664]/90 group-hover:via-gray-800/85 group-hover:to-gray-900/90 transition-all duration-500"></div>

                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/images/pattern.png')] bg-cover bg-center"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-8 lg:p-10 h-full flex flex-col">

                    {/* Number Badge */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#1c3664] to-[#152a4f] rounded-full flex items-center justify-center shadow-2xl border-4 border-white group-hover:scale-110 transition-transform duration-500">
                      <span className="text-3xl font-black text-white">
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="mb-6 mt-8">
                      <div className="w-16 h-16 bg-[#1c3664]/20 rounded-xl flex items-center justify-center group-hover:bg-[#1c3664]/30 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-[#1c3664] group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                      {step.title}
                    </h3>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-[#1c3664] mb-6"></div>

                    {/* Description */}
                    <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1c3664] to-transparent"></div>
                </div>
              </m.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ProcessSection;
