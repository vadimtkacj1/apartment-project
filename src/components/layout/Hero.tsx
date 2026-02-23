import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  img: string;
}

const Hero: React.FC<HeroProps> = ({ img }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full h-[90vh] md:h-screen overflow-hidden"
    >
      {/* Background Image Layer */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: backgroundY,
          scale: 1.05
        }}
      />
      
      {/* Darker overlay */}
      <div className="absolute inset-0 z-10 bg-black/30" />

      {/* Main Container */}
      <div className="relative z-20 h-full w-full px-6 md:px-24 2xl:px-32 pt-10 pb-20 md:pb-32 flex flex-col justify-between items-start max-w-[1920px] mx-auto">
        
        <div className="flex flex-col items-start text-right w-full mt-2 md:mt-4">
          
          <div className="flex items-center justify-start gap-x-1 md:gap-x-2 mb-2 md:mb-4">
            <h1 className="font-black text-white leading-tight tracking-tight"
                style={{ fontSize: 'clamp(2rem, 6.5vw, 5.5rem)' }}>
              רם נכסים
            </h1>
            <div className="relative w-[45px] h-[45px] md:w-[110px] md:h-[110px] flex-shrink-0">
              <Image 
                src="/images/and.png" 
                alt="&" 
                fill 
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
            <h1 className="font-black text-white leading-tight tracking-tight"
                style={{ fontSize: 'clamp(2rem, 6.5vw, 5.5rem)' }}>
              חיים ענבי
            </h1>
          </div>

          <p className="text-white font-medium opacity-95 max-w-xl text-right leading-relaxed"
             style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.25rem)' }}>
            מקצועיות ללא פשרות, שקיפות מלאה ותוצאות שמדברות בעד עצמן
          </p>
        </div>

        {/* НИЖНЯЯ ЧАСТЬ: Кнопки */}
        <div 
          className="flex flex-col gap-4 w-full md:w-auto items-start mb-6" 
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href="/apartments?dealType=rent"
            className="bg-white text-black px-12 md:px-16 py-3.5 md:py-4 rounded-lg font-bold text-lg md:text-xl hover:bg-gray-100 transition-all w-full md:min-w-[280px] text-center shadow-2xl"
          >
            נכסים להשכרה
          </Link>

          <Link
            href="/apartments?dealType=sale"
            className="bg-white text-black px-12 md:px-16 py-3.5 md:py-4 rounded-lg font-bold text-lg md:text-xl hover:bg-gray-100 transition-all w-full md:min-w-[280px] text-center shadow-2xl"
          >
            נכסים למכירה
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Hero;