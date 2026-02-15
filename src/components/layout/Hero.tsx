import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface HeroProps {
  img: string;
  staticTitle?: string;
  centered?: boolean;
}

const Hero: React.FC<HeroProps> = ({ img, staticTitle, centered = false }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Отслеживаем скролл относительно этого контейнера
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // 2. Трансформируем скролл в движение (изображение уходит вниз на 20%, текст вверх)
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleText = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section
      ref={containerRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-black cursor-pointer"
      onClick={handleHeroClick}
    >
      <div
        className={`relative w-full overflow-hidden ${
          staticTitle ? 'h-[40vh] md:h-[45vh]' : 'h-[80vh] md:h-[85vh]'
        }`}
        style={{
          height: staticTitle
            ? 'clamp(400px, 40dvh, 45vh)'
            : 'clamp(600px, 80dvh, 85vh)',
        }}
      >
        {/* Анимированное фоновое изображение (Параллакс) */}
        <motion.div 
          style={{ y: yImage }} 
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          <Image
            src={img}
            alt="Real Estate background"
            priority
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </motion.div>

        {/* Затемнение */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Контент с эффектом исчезновения при скролле */}
        <motion.div
          variants={shouldAnimate ? containerVariants : undefined}
          initial={shouldAnimate ? "hidden" : "visible"}
          animate="visible"
          style={{ opacity: opacityText, scale: scaleText }}
          className={`absolute inset-0 z-20 flex flex-col justify-center px-4 md:px-20 lg:px-32 ${
            centered || staticTitle
              ? 'items-center text-center'
              : 'items-center text-center md:items-start md:text-right'
          }`}
        >
          {/* Title */}
          <motion.div variants={shouldAnimate ? itemVariants : undefined} className="w-full">
            <h1
              className="font-black leading-[1.1] mb-4 text-white uppercase"
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 9rem)',
                textShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}
            >
              {displayTitle}
            </h1>
          </motion.div>

          {/* Subtext */}
          {!staticTitle && (
            <motion.div variants={shouldAnimate ? itemVariants : undefined}>
              <p
                className="text-white/95 font-medium leading-relaxed mb-8 max-w-xl md:max-w-2xl"
                style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.4rem)' }}
              >
                {subText}
              </p>
            </motion.div>
          )}

          {/* Buttons */}
          {!staticTitle && (
            <motion.div variants={shouldAnimate ? itemVariants : undefined} className="w-full md:w-auto">
              <div 
                className="flex flex-col md:flex-row gap-4 items-center md:items-start justify-center" 
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  href="/apartments?dealType=sale"
                  className="w-full max-w-[280px] md:w-auto group bg-[#1c3664] text-white px-8 py-3.5 rounded-lg font-bold text-base md:text-lg shadow-xl hover:bg-white hover:text-[#1c3664] transition-all duration-300 flex items-center justify-center gap-3 border border-white/10"
                >
                  נכסים למכירה
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                </Link>

                <Link
                  href="/apartments?dealType=rent"
                  className="w-full max-w-[280px] md:w-auto group bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-lg font-bold text-base md:text-lg shadow-xl hover:bg-white hover:text-[#1c3664] transition-all duration-300 flex items-center justify-center gap-3 border border-white/30"
                >
                  נכסים להשכרה
                  <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
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