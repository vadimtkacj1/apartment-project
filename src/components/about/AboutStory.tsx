'use client';

import { useRef } from 'react';
import { m, useInView } from 'framer-motion';
import Image from 'next/image';

// Data for the milestones/story steps
// You can replace the SVG icons with 3D icons later if you want them to match the other sections perfectly.
const milestones = [
  {
    icon: '/Create-rafiki.svg',
    title: 'הקמת המשרד',
    description: 'רם וחיים הקימו את המשרד מתוך מטרה לשנות את הדרך שבה מתווכים נדל"ן בחולון'
  },
  {
    icon: '/Conversation-amico.svg',
    title: 'גישה אישית',
    description: 'פיתוח שיטת עבודה המבוססת על אמינות, שקיפות וליווי אישי לכל לקוח'
  },
  {
    icon: '/Cohort analysis-rafiki.svg',
    title: 'צמיחה והתרחבות',
    description: 'המשרד גדל והצוות התרחב, עם עשרות עסקאות מוצלחות בכל שנה'
  },
  {
    icon: '/Finance-rafiki.svg',
    title: 'מובילים בשוק',
    description: 'כיום אנחנו מהמשרדים המובילים בחולון עם מוניטין של מצוינות ושירות'
  }
];

export default function AboutStory() {
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, amount: 0.2 });

  return (
    <section 
      ref={storyRef} 
      className="py-24 w-full bg-[#faf7f2]" // Warm background color
      dir="rtl" 
    >
      <div className="max-w-[1300px] mx-auto px-6">
        
        {/* Section Header */}
        <m.div
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={storyInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c3664] mb-4">
            הסיפור שלנו
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            מתוך חזון לשנות את תחום הנדל"ן בחולון, הקמנו משרד שמציב את הלקוח במרכז
          </p>
        </m.div>

        {/* Intro Text Paragraphs */}
        <m.div
          className="max-w-4xl mx-auto text-center mb-20 space-y-6"
          initial={{ y: 20, opacity: 0 }}
          animate={storyInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xl text-[#1c3664]/80 leading-relaxed font-medium">
            רם וחיים הקימו את המשרד לאחר שנים של עבודה בשוק המקומי. הם זיהו את הצורך בשירות אישי, שקוף ומקצועי יותר עבור בעלי נכסים וקונים.
          </p>
          <p className="text-lg text-slate-500 leading-relaxed">
            הגישה שלהם מבוססת על אמינות, עבודה יסודית והבנה עמוקה של כל עסקה. במקום שיווק כללי ולא ממוקד, הם בנו שיטת עבודה שמתחילה בתמחור נכון, ממשיכה בשיווק ממוקד ומסתיימת בניהול משא ומתן מדויק.
          </p>
        </m.div>

        {/* Milestones Grid - NO CARD BACKGROUND */}
        <m.div 
          // Layout: 1 col (mobile) -> 2 cols (tablet) -> 4 cols (desktop)
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial="hidden"
          animate={storyInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {milestones.map((milestone, index) => (
            <m.div
              key={index}
              // Clean look: No 'bg-white', no 'shadow', no 'border'.
              // Just layout and a slight hover lift effect.
              className="group flex flex-col items-center text-center p-4 hover:-translate-y-2 transition-transform duration-300"
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}
            >
              {/* Icon Container */}
              <div className="w-24 h-24 mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <Image 
                  src={milestone.icon} 
                  alt={milestone.title} 
                  width={80} 
                  height={80}
                  className="object-contain drop-shadow-md" 
                />
              </div>

              <h3 className="text-2xl font-bold text-[#1c3664] mb-3">
                {milestone.title}
              </h3>
              
              <p className="text-slate-500 text-[1.05rem] leading-relaxed">
                {milestone.description}
              </p>
            </m.div>
          ))}
        </m.div>

        {/* Footer Section (Dark Blue Block) */}
        <m.div
          className="bg-[#1c3664] text-white p-8 md:p-12 rounded-3xl text-center shadow-xl shadow-blue-900/10 relative overflow-hidden"
          initial={{ y: 30, opacity: 0 }}
          animate={storyInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

          <p className="text-lg md:text-xl font-medium leading-relaxed max-w-4xl mx-auto relative z-10">
            כיום רם וחיים מלווים עשרות עסקאות של דירות למכירה ודירות להשכרה בחולון מדי שנה,
            עם דגש על שירות אישי, שקיפות מלאה ותוצאות מוכחות.
          </p>
        </m.div>

      </div>
    </section>
  );
}