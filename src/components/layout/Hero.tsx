import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface HeroProps {
  img: string;
}

const Hero: React.FC<HeroProps> = ({ img }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full h-[90vh] md:h-screen overflow-hidden cursor-pointer"
      onClick={() => router.push('/apartments')}
    >
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
      
      <div className="absolute inset-0 z-10" />

      <div className="relative z-20 h-full w-full px-4 md:px-20 flex flex-col justify-center">
        
        <div className="flex flex-col items-start text-right max-w-full md:max-w-[95vw] md:mt-[-8vh]">
          
          <div className="flex flex-wrap items-center gap-x-1 md:gap-x-2 mb-4">
            
            {/* Уменьшен tracking с widest до tight/normal */}
            <h1 className="font-black text-white leading-none tracking-tight"
                style={{ fontSize: 'clamp(2.4rem, 8vw, 7.8rem)' }}>
              חיים ענבי
            </h1>
            
            {/* Уменьшены отступы mx вокруг & */}
            <div className="relative w-[35px] h-[35px] md:w-[110px] md:h-[110px] flex-shrink-0 mx-1 md:mx-0">
              <Image 
                src="/images/and.png" 
                alt="&" 
                fill 
                className="object-contain brightness-0 invert"
                priority
              />
            </div>

            <h1 className="font-black text-white leading-none tracking-tight"
                style={{ fontSize: 'clamp(2.4rem, 8vw, 7.8rem)' }}>
              רם נכסים
            </h1>
          </div>

          <p className="text-white font-bold opacity-100 mb-10 md:mb-16 mr-1"
             style={{ fontSize: 'clamp(0.9rem, 1.8vw, 1.6rem)' }}>
            מקצועיות ללא פשרות, שקיפות מלאה ותוצאות שמדברות בעד עצמן
          </p>

          <div 
            className="flex flex-col gap-3 md:gap-5 w-full md:w-auto" 
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/apartments?dealType=rent"
              className="bg-white text-black px-8 md:px-16 py-3 md:py-4 rounded-md font-extrabold text-lg md:text-2xl hover:bg-gray-100 transition-all w-full md:min-w-[320px] text-center shadow-2xl"
            >
              נכסים להשכרה
            </Link>

            <Link
              href="/apartments?dealType=sale"
              className="bg-white text-black px-8 md:px-16 py-3 md:py-4 rounded-md font-extrabold text-lg md:text-2xl hover:bg-gray-100 transition-all w-full md:min-w-[320px] text-center shadow-2xl"
            >
              נכסים למכירה
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;