'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeroProps {
  img?: string;
}

function useTypewriter(text: string, startDelay = 0, charDelay = 38) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;
    let i = 0;

    timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, charDelay);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, startDelay, charDelay]);

  return { displayed, done };
}

const Hero: React.FC<HeroProps> = () => {
  const line1 = 'רם נכסים';
  const line2 = 'חיים ענבי';

  const line1StartDelay = 400;
  const line1Duration = line1.length * 55;
  const line2StartDelay = line1StartDelay + line1Duration + 200;

  const { displayed: text1, done: done1 } = useTypewriter(line1, line1StartDelay, 55);
  const { displayed: text2, done: done2 } = useTypewriter(line2, line2StartDelay, 55);

  const showRest = done2;

  return (
    <section
      dir="rtl"
      className="relative w-full h-[90vh] md:h-screen overflow-hidden mt-24 md:mt-20"
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .cursor {
          display: inline-block;
          width: 3px;
          height: 0.85em;
          background: #ffffff;
          margin-right: 4px;
          vertical-align: middle;
          animation: blink 750ms steps(1) infinite;
          border-radius: 1px;
        }
        @keyframes goldGlow {
          0%, 100% { box-shadow: 0 0 20px 2px rgba(212,168,67,0.3), 0 4px 16px rgba(0,0,0,0.4); }
          50%       { box-shadow: 0 0 40px 8px rgba(212,168,67,0.65), 0 4px 24px rgba(0,0,0,0.4); }
        }
        @keyframes shineSwipe {
          0%   { transform: translateX(-200%) skewX(-20deg); }
          100% { transform: translateX(400%) skewX(-20deg); }
        }
        .btn-primary:hover .btn-shine {
          animation: shineSwipe 0.5s ease forwards;
        }
        .btn-primary {
          animation: goldGlow 2.5s ease-in-out infinite;
        }
        .btn-secondary {
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.13) !important;
          border-color: rgba(255,255,255,0.7) !important;
          box-shadow: 0 0 24px rgba(255,255,255,0.12);
        }
      `}</style>

      {/* ── Відео ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay loop muted playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Контент ── */}
      <div
        className="relative z-20 h-full w-full px-6 md:px-16 xl:px-20 2xl:px-24 mx-auto flex flex-col justify-between pt-10 pb-20"
        style={{ maxWidth: "2400px" }} // Удален стиль style={{ y: contentY }}
      >
        {/* Top */}
        <div className="flex flex-col items-start text-right w-full mt-10 md:mt-16">

          {/* Heading row */}
          <div className="flex items-center justify-start gap-x-3 md:gap-x-5 mb-5">

            {/* "רם נכסים" */}
            <h1
              className="font-black text-white leading-none"
              style={{
                fontSize: 'clamp(2rem, 8.5vw, 6rem)',
                textShadow: '0 2px 24px rgba(0,0,0,0.7)',
                minWidth: '1ch',
              }}
            >
              {text1}
              {!done1 && <span className="cursor" />}
            </h1>

            {/* Ampersand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
              animate={done1 ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.3, rotate: -20 }}
              transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              className="relative shrink-0"
              style={{ width: 'clamp(1.8rem, 5.5vw, 4.5rem)', height: 'clamp(1.8rem, 5.5vw, 4.5rem)' }}
            >
              <Image
                src="/images/and.png"
                alt="&"
                fill
                className="object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
                priority
              />
            </motion.div>

            {/* "חיים ענבי" */}
            <h1
              className="font-black text-white leading-none"
              style={{
                fontSize: 'clamp(2rem, 8.5vw, 6rem)',
                textShadow: '0 2px 24px rgba(0,0,0,0.7)',
                minWidth: '1ch',
              }}
            >
              {text2}
              {!done2 && text2.length > 0 && <span className="cursor" />}
            </h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={showRest ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-white/75 font-medium max-w-2xl leading-relaxed"
            style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.2rem)' }}
          >
            מקצועיות ללא פשרות, שקיפות מלאה ותוצאות שמדברות בעד עצמן
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div
          className="flex flex-col gap-3 w-full md:w-auto items-center md:items-start"
          initial={{ opacity: 0, y: 30 }}
          animate={showRest ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          {/* Gold Button */}
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto"
          >
            <Link
              href="/apartments?dealType=rent"
              className="btn-primary group relative block overflow-hidden w-full md:min-w-[340px] xl:min-w-105 rounded-2xl font-bold"
              style={{
                padding: 'clamp(0.75rem, 1.6vw, 1.6rem) clamp(1.5rem, 3.8vw, 4rem)',
                background: 'linear-gradient(135deg, #B8821E 0%, #F2C443 50%, #C8922A 100%)',
                color: '#1C1000',
                textAlign: 'center',
                letterSpacing: '0.04em',
                fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
              }}
            >
              <span
                className="btn-shine pointer-events-none absolute top-0 left-0 h-full w-1/3"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                  transform: 'translateX(-200%) skewX(-20deg)',
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-3">
                נכסים להשכרה
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: 'scaleX(-1)', flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </motion.div>

          {/* Glass Button */}
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto"
          >
            <Link
              href="/apartments?dealType=sale"
              className="btn-secondary group relative block overflow-hidden w-full md:min-w-[340px] xl:min-w-105 rounded-2xl font-bold border-2"
              style={{
                padding: 'clamp(0.75rem, 1.6vw, 1.6rem) clamp(1.5rem, 3.8vw, 4rem)',
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                color: '#ffffff',
                textAlign: 'center',
                letterSpacing: '0.04em',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                נכסים למכירה
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: 'scaleX(-1)', flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;