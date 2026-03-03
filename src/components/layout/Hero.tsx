'use client';

import React, { useState, useEffect } from 'react';
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
      className="relative w-full h-screen overflow-hidden"
      style={{ height: '100dvh', maxWidth: '100vw' }}
    >
      <style>{`
        .cursor {
          display: inline-block;
          width: 3px;
          height: 0.85em;
          background: #ffffff;
          margin-right: 4px;
          vertical-align: middle;
          border-radius: 1px;
        }
        @keyframes shineSwipe {
          0%   { transform: translateX(-200%) skewX(-20deg); }
          100% { transform: translateX(400%) skewX(-20deg); }
        }
        .btn-primary:hover .btn-shine {
          animation: shineSwipe 0.5s ease forwards;
        }
        .btn-primary {
          box-shadow: 0 0 20px 2px rgba(212,168,67,0.3), 0 4px 16px rgba(0,0,0,0.4);
          transition: box-shadow 0.3s ease;
        }
        .btn-primary:hover {
          box-shadow: 0 0 30px 4px rgba(212,168,67,0.5), 0 4px 20px rgba(0,0,0,0.4);
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

      {/* ── Video ── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay loop muted playsInline preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Content ── */}
      <div
        className="
          relative z-20 h-full w-full
          px-6 md:px-16 xl:px-20 2xl:px-24
          flex flex-col
          items-center md:items-start
          justify-center md:justify-between
          gap-6 md:gap-0
          py-8 md:pt-44 md:pb-20
        "
        style={{ maxWidth: '2400px', margin: '0 auto' }}
      >

        {/* TOP: heading + subtitle */}
        <div className="flex flex-col items-center md:items-start w-full">

          <div className="flex items-center justify-center md:justify-start gap-x-3 md:gap-x-5 mb-4 w-full">
            <h1
              className="font-black text-white leading-none"
              style={{
                fontSize: 'clamp(1.8rem, 7.5vw, 6rem)',
                textShadow: '0 2px 24px rgba(0,0,0,0.7)',
                minWidth: '1ch',
                fontFamily: 'var(--font-caramel), cursive, sans-serif',
              }}
            >
              {text1}
              {!done1 && <span className="cursor" />}
            </h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
              animate={done1 ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.3, rotate: -20 }}
              transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              className="relative shrink-0"
              style={{ width: 'clamp(1.6rem, 5vw, 4.5rem)', height: 'clamp(1.6rem, 5vw, 4.5rem)' }}
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

            <h1
              className="font-black text-white leading-none"
              style={{
                fontSize: 'clamp(1.8rem, 7.5vw, 6rem)',
                textShadow: '0 2px 24px rgba(0,0,0,0.7)',
                minWidth: '1ch',
                fontFamily: 'var(--font-caramel), cursive, sans-serif',
              }}
            >
              {text2}
              {!done2 && text2.length > 0 && <span className="cursor" />}
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={showRest ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-white/75 font-medium max-w-2xl leading-relaxed text-center md:text-right"
            style={{ fontSize: 'clamp(0.82rem, 1.5vw, 1.2rem)' }}
          >
            מקצועיות ללא פשרות, שקיפות מלאה ותוצאות שמדברות בעד עצמן
          </motion.p>
        </div>

        {/* BOTTOM: CTA buttons */}
        <motion.div
          className="flex flex-col gap-4 items-center md:items-start w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={showRest ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="w-[70%] sm:w-[55%] md:w-auto"
          >
            <Link
              href="/apartments?dealType=rent"
              className="btn-primary group relative block overflow-hidden w-full md:min-w-[340px] xl:min-w-105 rounded-2xl font-bold"
              style={{
                padding: 'clamp(0.55rem, 1.4vw, 1.6rem) clamp(1rem, 3.2vw, 4rem)',
                background: 'linear-gradient(135deg, #B8821E 0%, #F2C443 50%, #C8922A 100%)',
                color: '#1C1000',
                textAlign: 'center',
                letterSpacing: '0.04em',
                fontSize: 'clamp(0.88rem, 1.4vw, 1.3rem)',
                fontFamily: 'var(--font-caramel), cursive, sans-serif',
              }}
            >
              <span
                className="btn-shine pointer-events-none absolute top-0 left-0 h-full w-1/3"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                  transform: 'translateX(-200%) skewX(-20deg)',
                }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                נכסים להשכרה
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: 'scaleX(-1)', flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="w-[70%] sm:w-[55%] md:w-auto"
          >
            <Link
              href="/apartments?dealType=sale"
              className="btn-secondary group relative block overflow-hidden w-full md:min-w-[340px] xl:min-w-105 rounded-2xl font-bold border-2"
              style={{
                padding: 'clamp(0.55rem, 1.4vw, 1.6rem) clamp(1rem, 3.2vw, 4rem)',
                borderColor: 'rgba(255,255,255,0.4)',
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                color: '#ffffff',
                textAlign: 'center',
                letterSpacing: '0.04em',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                fontSize: 'clamp(0.88rem, 1.4vw, 1.3rem)',
                fontFamily: 'var(--font-caramel), cursive, sans-serif',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                נכסים למכירה
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
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