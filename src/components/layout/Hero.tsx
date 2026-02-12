import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

interface HeroProps {
  img: string;
  staticTitle?: string;
  centered?: boolean;
}

const Hero: React.FC<HeroProps> = ({ img, staticTitle, centered = false }) => {
  const mainText = "רם נכסים חיים ענבי";
  const subText = "הנכס שלכם שווה יותר, אנחנו נדאג למצוא את הקונה המתאים במחיר המקסימלי";

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

  return (
    <section
      dir="rtl"
      // В RTL justify-start = ПРАВЫЙ край. justify-end = ЛЕВЫЙ.
      // Используем justify-start, чтобы контент был справа.
      className={`relative ${staticTitle ? 'h-[50vh]' : 'h-[100dvh]'} w-full flex items-center ${centered ? 'justify-center' : 'justify-start'} overflow-hidden bg-black`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={img}
          alt="Real Estate background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Main Content Container */}
      <motion.div
        variants={shouldAnimate ? containerVariants : undefined}
        initial={shouldAnimate ? "hidden" : "visible"}
        animate="visible"
        // items-start в RTL выравнивает элементы по ПРАВОМУ краю (начало строки)
        // pr-6 md:pr-32 = отступ справа
        className={`relative z-20 w-full max-w-5xl px-6 ${centered ? 'flex flex-col items-center text-center' : 'md:pr-32 lg:pr-40 flex flex-col items-start text-right'}`}
      >
        {/* Title */}
        <motion.div variants={shouldAnimate ? itemVariants : undefined}>
          <h1
            className="font-black leading-tight mb-4 text-white uppercase"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 6.5rem)',
              letterSpacing: '-0.02em',
              filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.5))'
            }}
          >
            {displayTitle}
          </h1>
        </motion.div>

        {/* Subtext - показываем только на главной */}
        {!staticTitle && (
          <motion.div variants={shouldAnimate ? itemVariants : undefined}>
            <p
              className="text-white/95 font-medium leading-relaxed mb-8 max-w-2xl"
              style={{
                fontSize: 'clamp(1rem, 1.5vw, 1.4rem)',
                textShadow: '0 2px 10px rgba(0,0,0,0.8)'
              }}
            >
              {subText}
            </p>
          </motion.div>
        )}

        {/* Buttons - показываем только на главной */}
        {!staticTitle && (
          <motion.div variants={shouldAnimate ? itemVariants : undefined}>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Sale Button */}
              <Link
                href="/apartments?dealType=sale"
                className="group bg-[#1c3664] text-white px-8 py-3 rounded-lg font-bold text-base md:text-lg shadow-xl hover:bg-white hover:text-[#1c3664] transition-all duration-300 active:scale-95 border border-white/10 flex items-center justify-center gap-3"
              >
                נכסים למכירה
                {/* Стрелка влево */}
                <span className="text-xl group-hover:translate-x-[-4px] transition-transform duration-300">
                  ←
                </span>
              </Link>

              {/* Rent Button */}
              <Link
                href="/apartments?dealType=rent"
                className="group bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-lg font-bold text-base md:text-lg shadow-xl hover:bg-white hover:text-[#1c3664] transition-all duration-300 active:scale-95 border border-white/30 flex items-center justify-center gap-3"
              >
                נכסים להשכרה
                {/* Стрелка влево */}
                <span className="text-xl group-hover:translate-x-[-4px] transition-transform duration-300">
                  ←
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Hero;