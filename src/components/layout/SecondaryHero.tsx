import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SecondaryHeroProps {
  img: string;
  title: string;
  centered?: boolean;
}

const SecondaryHero: React.FC<SecondaryHeroProps> = ({ img, title, centered = false }) => {
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
      className="relative w-full overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      <div
        className="relative w-full overflow-hidden flex items-center min-h-[30vh] md:min-h-[40vh]"
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
              className="font-black text-white inline-block px-6 py-3 md:px-8 md:py-4 rounded-lg"
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 4.5rem)',
                lineHeight: '1.3',
                letterSpacing: '0.02em',
                textShadow: 'none',
                backgroundColor: 'rgba(28, 54, 100, 0.75)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondaryHero;
