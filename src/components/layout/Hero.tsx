import React from 'react';
import { motion, Variants } from 'framer-motion';

interface HeroProps {
  img: string;
  mainText: string;
  subText: string;
  staticTitle?: string;
}

const Hero: React.FC<HeroProps> = ({ img, mainText, subText, staticTitle }) => {
  const shouldAnimate = !staticTitle;
  const displayTitle = staticTitle || mainText;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 50, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  const MotionDiv = shouldAnimate ? motion.div : 'div';
  const MotionSection = shouldAnimate ? motion.div : 'div';

  return (
    <section
      dir="rtl"
      className="relative h-screen w-full flex items-center justify-start overflow-hidden bg-black"
    >
      {/* Background Section */}
      <div className="absolute inset-0 z-0">
        <img
          src={img}
          alt="Real Estate background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <MotionSection
        variants={shouldAnimate ? containerVariants : undefined}
        initial={shouldAnimate ? "hidden" : undefined}
        animate={shouldAnimate ? "visible" : undefined}
        className="relative z-10 w-full px-10 md:px-24 lg:px-40 flex flex-col items-start text-right"
      >
        {/* Main Title с градиентом */}
        <MotionDiv variants={shouldAnimate ? itemVariants : undefined}>
          <h1
            className="font-black leading-[1.05] mb-6 uppercase whitespace-pre-line bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-[#C19A6B]"
            style={{
              fontSize: 'clamp(2.8rem, 10vw, 8.5rem)',
              letterSpacing: '-0.03em',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
            }}
          >
            {displayTitle}
          </h1>
        </MotionDiv>

        {/* Subtext */}
        <MotionDiv variants={shouldAnimate ? itemVariants : undefined}>
          <p
            className="text-white/90 font-bold leading-tight mb-12 max-w-2xl"
            style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            {subText}
          </p>
        </MotionDiv>

        {/* CTA Button */}
        <MotionDiv variants={shouldAnimate ? itemVariants : undefined}>
          <button
            className="group bg-[#C19A6B] text-white px-14 py-6 rounded-xl font-black text-2xl uppercase tracking-tight shadow-2xl hover:bg-white hover:text-black transition-all duration-300 active:scale-95 border border-white/10 flex items-center gap-4"
          >
            נכסים למכירה 
            <span className="text-3xl group-hover:translate-x-[-10px] transition-transform">←</span>
          </button>
        </MotionDiv>
      </MotionSection>
    </section>
  );
};

export default Hero;