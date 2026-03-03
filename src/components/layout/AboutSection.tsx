"use client";
import React, { memo, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const AboutSection: React.FC = memo(() => {
  const sectionRef = useRef<HTMLElement>(null);
  const logoPattern = "url('/images/about-logo.svg')";
  const [title, setTitle] = useState('אודות');

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
          setTitle(data.aboutSectionTitle || 'אודות');
        }
      } catch (error) {
        console.error('Error fetching title:', error);
      }
    };
    fetchTitle();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const patternY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative w-full py-16 md:py-20 overflow-hidden"
      style={{ background: 'rgb(42, 74, 138)' }}
    >
      <motion.div
        className="absolute z-0"
        style={{
          y: patternY,
          top: '-40%',
          left: '-30%',
          right: '-30%',
          bottom: '-40%',
          transformOrigin: 'center center',
        }}
      >
        <div
          className="w-full h-full bg-white"
          style={{
            backgroundImage: logoPattern,
            backgroundSize: '160px',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
          }}
        />
      </motion.div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Left-side blue */}
        <div
          className="absolute inset-0 bg-[#2A4A8A]"
          style={{
            clipPath: 'polygon(0 0, 21% 0, 1.5% 100%, 0 100%)'
          }}
        />
        {/* Right-side blue */}
        <div
          className="absolute inset-0 bg-[#2A4A8A]"
          style={{
            clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 14.5% 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 lg:col-span-3 text-white"
          >
            <div className="mb-4">
              <span className="text-white/80 font-bold text-lg uppercase tracking-wider">
                קצת עלינו
              </span>
            </div>
            <motion.h2 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight text-white" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
              {title}
            </motion.h2>

            <div className="space-y-6">
              <p className="text-xl sm:text-3xl font-bold leading-tight text-[#c5a357]">
               רם שיווק נכסים & חיים ענבי הוא משרד תיווך ושיווק נכסים בעל ניסיון של למעלה מ-24 שנה. המשרד מתמחה
במכירה, השכרה וליווי עסקאות נדל״ן במקצועיות גבוהה, עם פעילות מרכזית בחולון, בת ים וכל אזור המרכז
 
              </p>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                צוות המשרד כולל ארבעה סוכנים, ומציע גישה אישית ומקצועית לכל לקוח. אנו מלווים את בעלי הנכסים משלב
האפיון, דרך תמחור נכון, צילום ושיווק ממוקד, ניהול משא ומתן ועד לסגירת העסקה בתנאים הטובים ביותר.
המשרד מתמחה בהשכרת דירות, מכירת דירות, נכסים להשקעה ופתרונות נדל״ן בהתאמה אישית, תוך היכרות
עמוקה עם השוק המקומי והקונים הפוטנציאליים.
              </p>
            </div>

            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-10 py-4 bg-[#c5a357] text-[#1c3664] font-black text-xl rounded-sm hover:bg-[#d4b46b] transition-all shadow-xl"
              >
                קראו עוד על המשרד
                <ArrowLeft className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 lg:col-span-2 flex justify-center"
          >
            <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/6.png"
                alt="Про застройщика"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 30vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;