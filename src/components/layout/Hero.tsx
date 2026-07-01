import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeroMedia from './HeroMedia';

/**
 * Server component: the headline text ships in the initial HTML so LCP fires
 * at first paint instead of after hydration. The typewriter look is recreated
 * with CSS steps() clip-path reveals — zero JS, no per-keystroke re-layouts.
 */
const Hero: React.FC = () => {
  const line1 = 'רם נכסים';
  const line2 = 'חיים ענבי';

  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh', maxWidth: '100vw' }}
    >
      <style>{`
        .hero-video-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          background: #000;
        }
        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          opacity: 1;
        }
        .hero-video[poster] {
          background: transparent;
        }
        /* RTL typewriter: reveal right-to-left in discrete steps.
           Negative outsets keep the text-shadow from being clipped. */
        @keyframes typeReveal {
          from { clip-path: inset(-40px -40px -40px 100%); }
          to   { clip-path: inset(-40px -40px -40px -40px); }
        }
        .type-line1 {
          animation: typeReveal 0.45s steps(8, end) 0.35s both;
        }
        .type-line2 {
          animation: typeReveal 0.45s steps(8, end) 0.95s both;
        }
        @keyframes ampPop {
          from { opacity: 0; transform: scale(0.3) rotate(-20deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .amp-pop {
          animation: ampPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.85s both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: none; }
        }
        .hero-fade-1 { animation: fadeUp 0.7s ease-out 1.55s both; }
        .hero-fade-2 { animation: fadeUp 0.7s ease-out 1.75s both; }
        @keyframes cursorBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes cursorHide {
          to { opacity: 0; visibility: hidden; }
        }
        .cursor {
          display: inline-block;
          width: 3px;
          height: 0.85em;
          background: #ffffff;
          margin-right: 4px;
          vertical-align: middle;
          border-radius: 1px;
          opacity: 0;
          animation:
            cursorBlink 0.7s step-end 1.4s 2,
            cursorHide 0.01s linear 2.8s forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .type-line1, .type-line2, .amp-pop, .hero-fade-1, .hero-fade-2 {
            animation: none;
          }
          .cursor { animation: none; opacity: 0; }
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
        .btn-green:hover .btn-shine {
          animation: shineSwipe 0.5s ease forwards;
        }
        .btn-green {
          box-shadow: 0 0 20px 2px rgba(34,197,94,0.3), 0 4px 16px rgba(0,0,0,0.4);
          transition: box-shadow 0.3s ease;
        }
        .btn-green:hover {
          box-shadow: 0 0 30px 4px rgba(34,197,94,0.5), 0 4px 20px rgba(0,0,0,0.4);
        }
        .btn-secondary {
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.13) !important;
          border-color: rgba(255,255,255,0.7) !important;
          box-shadow: 0 0 24px rgba(255,255,255,0.12);
        }
        .btn-lift {
          transition: transform 0.25s ease;
        }
        .btn-lift:hover { transform: translateY(-3px) scale(1.02); }
        .btn-lift:active { transform: scale(0.97); }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Video / poster ── */}
      <HeroMedia />

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
                textShadow: '0 1px 2px rgba(0,0,0,0.45), 0 2px 18px rgba(0,0,0,0.55)',
                WebkitTextStroke: '1.1px rgba(0,0,0,0.45)',
                paintOrder: 'stroke',
                minWidth: '1ch',
                fontFamily: 'var(--font-caramel), cursive, sans-serif',
              }}
            >
              <span className="type-line1 inline-block">{line1}</span>
            </h1>

            <span
              className="amp-pop relative shrink-0 inline-block"
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
            </span>

            <h1
              className="font-black text-white leading-none"
              style={{
                fontSize: 'clamp(1.8rem, 7.5vw, 6rem)',
                textShadow: '0 1px 2px rgba(0,0,0,0.45), 0 2px 18px rgba(0,0,0,0.55)',
                WebkitTextStroke: '1.1px rgba(0,0,0,0.45)',
                paintOrder: 'stroke',
                minWidth: '1ch',
                fontFamily: 'var(--font-caramel), cursive, sans-serif',
              }}
            >
              <span className="type-line2 inline-block">{line2}</span>
              <span className="cursor" />
            </h1>
          </div>

          <p
            className="hero-fade-1 text-white font-medium max-w-2xl leading-relaxed text-center md:text-start"
            style={{ fontSize: 'clamp(0.82rem, 1.5vw, 1.2rem)', textShadow: '0 1px 2px rgba(0,0,0,0.7), 0 1px 10px rgba(0,0,0,0.55)', WebkitTextStroke: '0.5px rgba(0,0,0,0.3)', paintOrder: 'stroke' }}
          >
            מקצועיות ללא פשרות, שקיפות מלאה ותוצאות שמדברות בעד עצמן
          </p>
        </div>

        {/* BOTTOM: CTA buttons */}
        <div className="hero-fade-2 flex flex-col gap-4 items-center md:items-start w-full">
          <div className="btn-lift w-[70%] sm:w-[55%] md:w-auto">
            <Link
              href="#onethepark"
              className="btn-green group relative block overflow-hidden w-full md:min-w-85 xl:min-w-105 rounded-2xl font-bold"
              style={{
                padding: 'clamp(0.55rem, 1.4vw, 1.6rem) clamp(1rem, 3.2vw, 4rem)',
                background: 'linear-gradient(135deg, #15803D 0%, #22C55E 50%, #16A34A 100%)',
                color: '#ffffff',
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
                <span dir="ltr">One The Park</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0 }}>
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </span>
            </Link>
          </div>

          <div className="btn-lift w-[70%] sm:w-[55%] md:w-auto">
            <Link
              href="/apartments?dealType=rent"
              className="btn-primary group relative block overflow-hidden w-full md:min-w-85 xl:min-w-105 rounded-2xl font-bold"
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
          </div>

          <div className="btn-lift w-[70%] sm:w-[55%] md:w-auto">
            <Link
              href="/apartments?dealType=sale"
              className="btn-secondary group relative block overflow-hidden w-full md:min-w-85 xl:min-w-105 rounded-2xl font-bold border-2"
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
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
