import React from 'react';
import { motion, Variants } from 'framer-motion';

interface HeroProps {
  img: string;
  mainText: string;
  subText: string;
  staticTitle?: string;
}

const Hero: React.FC<HeroProps> = ({ img, mainText, subText, staticTitle }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 100, filter: 'blur(20px)' },
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
      className="relative h-screen w-full flex items-center justify-start overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={img} 
          alt="Real Estate background" 
          className="w-full h-full object-cover object-center"
        />
        {/* Затемнение для читаемости */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full px-10 md:px-24 lg:px-40 flex flex-col items-start text-right pt-32 md:pt-40"
      >
        <motion.h1
          variants={itemVariants}
          className="font-black text-white leading-[0.8] mb-8 uppercase"
          style={{
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            letterSpacing: '-0.04em'
          }}
        >
          {staticTitle || mainText}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-white font-extrabold leading-tight mb-14"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
            letterSpacing: '-0.01em',
            textShadow: '0 4px 20px rgba(0,0,0,0.6)'
          }}
        >
          {subText}
        </motion.p>

        <motion.div variants={itemVariants}>
          <button 
            className="bg-[#C19A6B] text-white px-20 py-8 rounded-sm font-black text-3xl uppercase tracking-tighter shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
          >
            לפרטים נוספים
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;