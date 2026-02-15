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

  // פרלקס עדין שמשפיע רק על המיקום האנכי של הרקע
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const mainText = "רם נכסים & חיים ענבי";
  const subText = "הנכס שלכם שווה יותר, אנחנו נדאג למצוא את הקונה המתאים במחיר המקסימלי";
  const displayTitle = staticTitle || mainText;

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-black cursor-pointer"
      style={{ isolation: 'isolate' }}
      onClick={() => !staticTitle && router.push('/apartments')}
    >
      <div
        className={`relative w-full overflow-hidden flex flex-col items-center justify-center ${
          staticTitle ? 'h-[60vh] md:h-[65vh]' : 'h-[75vh] md:h-[90vh]'
        }`}
      >
        {/* שימוש ב-motion.div כרקע כדי להבטיח 100% רוחב ללא חיתוך */}
        <motion.div
          className="absolute inset-0 z-0 w-full h-full"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'left center', // שומר על הבניין בשמאל
            y: backgroundY,
            scale: 1.1 // רזרבה קלה למניעת שטחים מתים
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />

        {/* Content */}
        <div className={`relative z-20 w-full px-4 md:px-12 lg:px-20 flex flex-col ${
          centered
            ? 'items-center text-center'
            : 'items-center text-center md:items-start md:text-right'
        }`}>
          <div className={centered ? 'w-full' : 'w-full'}>
            <h1
              className="font-black text-white tracking-tighter"
              style={{
                fontSize: 'clamp(2.2rem, 11vw, 8.5rem)',
                lineHeight: '0.9',
                textShadow: '0 4px 30px rgba(0,0,0,0.6)',
                wordBreak: 'break-word'
              }}
            >
              {displayTitle}
            </h1>
          </div>

          {!staticTitle && (
            <>
              <p
                className="text-white font-medium leading-tight mt-6 mb-10 max-w-xl md:max-w-3xl"
                style={{ fontSize: 'clamp(1rem, 4vw, 1.4rem)' }}
              >
                {subText}
              </p>

              <div 
                className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center" 
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href="/apartments?dealType=sale"
                  className="w-full md:w-auto min-w-50 bg-[#1c3664] text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1c3664] transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
                >
                  נכסים למכירה
                  <span className="text-2xl">←</span>
                </Link>

                <Link
                  href="/apartments?dealType=rent"
                  className="w-full md:w-auto min-w-50 bg-black/40 backdrop-blur-md text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#1c3664] transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
                >
                  נכסים להשכרה
                  <span className="text-2xl">←</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;