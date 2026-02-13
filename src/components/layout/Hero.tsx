import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface HeroProps {
  img: string;
  staticTitle?: string;
  centered?: boolean;
}

const Hero: React.FC<HeroProps> = ({ img, staticTitle, centered = false }) => {
  const router = useRouter();
  const mainText = "רם נכסים & חיים ענבי";
  const subText = "הנכס שלכם שווה יותר, אנחנו נדאג למצוא את הקונה המתאים במחיר המקסימלי";

  const shouldAnimate = !staticTitle;
  const displayTitle = staticTitle || mainText;

  const handleHeroClick = () => {
    if (!staticTitle) {
      router.push('/apartments');
    }
  };

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
    /* 1. Changed h-full to relative. Removed absolute from background wrapper */
    <section
      dir="rtl"
      className="relative w-full overflow-hidden bg-black cursor-pointer"
      onClick={handleHeroClick}
    >
      {/* Background Image Wrapper - No longer absolute, so it defines the height */}
      <div className={`relative z-0 w-full ${staticTitle ? 'h-[40vh] md:h-[45vh]' : ''}`}>
        <Image
          src={img}
          alt="Real Estate background"
          priority
          className="object-cover object-center"
          sizes='100vw'
          width={0}
          height={0}
          style={staticTitle ? { width: '100%', height: '100%' } : { width: '100%', height: 'auto' }}
        />

        {/* Overlay - Stretches to the height defined by the image above */}
        <div className="absolute inset-0 bg-black/40 z-10" />

        {/* 2. Main Content - Absolute inset-0 to overlay the text on top of the image */}
        <motion.div
          variants={shouldAnimate ? containerVariants : undefined}
          initial={shouldAnimate ? "hidden" : "visible"}
          animate="visible"
          className={`absolute inset-0 z-20 flex items-center w-full px-6 ${
            centered 
              ? 'flex flex-col justify-center items-center text-center' 
              : 'md:pr-32 lg:pr-40 flex flex-col justify-center items-start text-right'
          }`}
        >
          {/* Title */}
          <motion.div variants={shouldAnimate ? itemVariants : undefined}>
            <h1
              className="font-black leading-tight mb-4 text-white uppercase"
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 9rem)',
                letterSpacing: '-0.02em',
                filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.5))'
              }}
            >
              {displayTitle}
            </h1>
          </motion.div>

          {/* Subtext */}
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

          {/* Buttons */}
          {!staticTitle && (
            <motion.div variants={shouldAnimate ? itemVariants : undefined}>
              <div className="flex flex-col sm:flex-row gap-4" onClick={(e) => e.stopPropagation()}>
                <Link
                  href="/apartments?dealType=sale"
                  className="group bg-[#1c3664] text-white px-8 py-3 rounded-lg font-bold text-base md:text-lg shadow-xl hover:bg-white hover:text-[#1c3664] transition-all duration-300 active:scale-95 border border-white/10 flex items-center justify-center gap-3"
                >
                  נכסים למכירה
                  <span className="text-xl group-hover:translate-x-[-4px] transition-transform duration-300">
                    ←
                  </span>
                </Link>

                <Link
                  href="/apartments?dealType=rent"
                  className="group bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-lg font-bold text-base md:text-lg shadow-xl hover:bg-white hover:text-[#1c3664] transition-all duration-300 active:scale-95 border border-white/30 flex items-center justify-center gap-3"
                >
                  נכסים להשכרה
                  <span className="text-xl group-hover:translate-x-[-4px] transition-transform duration-300">
                    ←
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;