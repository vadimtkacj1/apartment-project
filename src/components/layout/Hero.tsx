import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface HeroProps {
  img: string;
  staticTitle?: string;
  centered?: boolean;
}

const Hero: React.FC<HeroProps> = ({ img, staticTitle, centered = false }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const mainText = "רם נכסים & חיים ענבי";
  const subText = "הנכס שלכם שווה יותר, אנחנו נדאג למצוא את הקונה המתאים במחיר המקסימלי";
  const displayTitle = staticTitle || mainText;

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full overflow-hidden cursor-pointer"
      style={{ isolation: 'isolate' }}
      onClick={() => !staticTitle && router.push('/apartments')}
    >
      <div
        className={`relative w-full overflow-hidden flex items-center ${
          staticTitle ? 'h-[60vh] md:h-[65vh]' : 'h-[75vh] md:h-[90vh]'
        }`}
      >
        {/* רקע עם עוגן לשמאל */}
        <motion.div
          className="absolute inset-0 z-0 w-full h-full"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center',
            y: backgroundY,
            scale: 1.05,
            transformOrigin: 'left center' 
          }}
        />

        {/* קונטיינר תוכן מיושר לימין */}
        <div className="relative z-20 w-full px-6 md:px-12 lg:px-20">
          <div className={`flex flex-col ${
            centered 
              ? 'mx-auto items-center text-center' 
              : 'mr-0 ml-auto items-start text-right max-w-full md:max-w-[75%] lg:max-w-[65%]'
          }`}>
            
            <h1
              className="font-black text-white"
              style={{
                fontSize: 'clamp(2.2rem, 7vw, 5.5rem)',
                lineHeight: '1.2',
                letterSpacing: '0.02em', 
                textShadow: 'none',
                whiteSpace: 'nowrap',
                display: 'inline-block'
              }}
            >
              {displayTitle}
            </h1>

            {!staticTitle && (
              <>
                <p
                  className="text-white font-medium leading-tight mt-4 mb-8 max-w-xl"
                  style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)' }}
                >
                  {subText}
                </p>

                <div 
                  className="flex flex-col md:flex-row gap-4 w-full md:w-auto" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    href="/apartments?dealType=sale"
                    className="bg-[#1c3664] text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1c3664] transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
                  >
                    נכסים למכירה
                    <span className="text-xl">←</span>
                  </Link>

                  <Link
                    href="/apartments?dealType=rent"
                    className="bg-black/40 backdrop-blur-md text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1c3664] transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
                  >
                    נכסים להשכרה
                    <span className="text-xl">←</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;