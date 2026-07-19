import React from 'react';
import HeroMedia from './HeroMedia';

/**
 * Server component: the headline/subtitle text ships in the initial HTML so LCP
 * fires at first paint instead of after hydration. The only interactive element
 * is a plain <a> to /apartments — no client JS needed, keeping this a server
 * component and preserving the LCP-first strategy.
 */
const Hero: React.FC = () => {
  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden"
      style={{ height: '100dvh', maxWidth: '100vw' }}
    >
      <style>{`
        /* HeroMedia relies on these two classes — keep them here. */
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

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: none; }
        }
        .hero-fade { animation: heroFadeUp 0.7s ease-out both; }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.85rem 2.4rem;
          border-radius: 12px;
          background: #ffffff;
          color: #051150;
          font-weight: 700;
          font-size: 1.05rem;
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .hero-cta:hover {
          background: rgba(255,255,255,0.88);
          transform: translateY(-1px);
        }
        .hero-cta:active { transform: none; }
        .hero-cta:focus-visible { outline: 2px solid #ffffff; outline-offset: 3px; }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade { animation: none; }
          .hero-cta { transition: none; }
        }
      `}</style>

      {/* ── Video / poster (+ möbius scrim) ── */}
      <HeroMedia />

      {/* ── Content ── */}
      <div
        className="relative z-20 h-full w-full px-6 md:px-16 xl:px-20 flex flex-col items-center justify-center text-center"
        style={{ maxWidth: '2400px', margin: '0 auto' }}
      >
        <div className="flex flex-col items-center gap-6 w-full max-w-3xl">

          <h1
            className="hero-fade"
            style={{
              animationDelay: '0.1s',
              fontFamily: 'var(--font-caramel), sans-serif',
              color: '#ffffff',
              fontWeight: 900,
              lineHeight: 1.08,
              fontSize: 'clamp(2.2rem, 7vw, 4.75rem)',
              textShadow: '0 2px 24px rgba(5,17,80,0.45)',
              textWrap: 'balance',
            }}
          >
            מוצאים לכם את הדירה הנכונה בחולון והמרכז
          </h1>

          <p
            className="hero-fade leading-relaxed"
            style={{
              animationDelay: '0.22s',
              color: 'rgba(255,255,255,0.88)',
              maxWidth: '42rem',
              fontWeight: 400,
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              textShadow: '0 1px 12px rgba(5,17,80,0.5)',
            }}
          >
            מקצועיות ללא פשרות, שקיפות מלאה ותוצאות שמדברות בעד עצמן
          </p>

          <a
            href="/apartments"
            className="hero-cta hero-fade mt-2"
            style={{ animationDelay: '0.34s' }}
          >
            לצפייה בנכסים
          </a>

        </div>
      </div>
    </section>
  );
};

export default Hero;
