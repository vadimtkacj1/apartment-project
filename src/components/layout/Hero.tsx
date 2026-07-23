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
          gap: 0.5rem;
          padding: 0.85rem 2.2rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.05rem;
          text-decoration: none;
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-cta:active { transform: none; }
        .hero-cta:focus-visible { outline: 2px solid #ffffff; outline-offset: 3px; }
        /* Primary: solid white on the dark video, with a soft navy lift-shadow. */
        .hero-cta--primary {
          background: #ffffff;
          color: #051150;
          box-shadow: 0 6px 20px rgba(5,17,80,0.28);
        }
        .hero-cta--primary:hover {
          background: rgba(255,255,255,0.92);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(5,17,80,0.34);
        }
        /* Secondary: glass ghost — a restrained second path (contact). */
        .hero-cta--ghost {
          background: rgba(255,255,255,0.06);
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.55);
          backdrop-filter: blur(2px);
        }
        .hero-cta--ghost:hover {
          background: rgba(255,255,255,0.16);
          border-color: #ffffff;
          transform: translateY(-2px);
        }

        /* Scroll affordance for the full-height hero. */
        .hero-scroll {
          position: absolute;
          bottom: 1.6rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          color: rgba(255,255,255,0.82);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-decoration: none;
        }
        .hero-scroll:hover { color: #ffffff; }
        .hero-scroll:focus-visible { outline: 2px solid #ffffff; outline-offset: 4px; border-radius: 6px; }
        .hero-scroll svg { animation: heroBob 1.8s ease-in-out infinite; }
        @keyframes heroBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade { animation: none; }
          .hero-cta { transition: none; }
          .hero-scroll svg { animation: none; }
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

          <div
            className="hero-fade mt-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
            style={{ animationDelay: '0.34s' }}
          >
            <a href="/apartments" className="hero-cta hero-cta--primary">
              לצפייה בנכסים
            </a>
            <a href="#contact" className="hero-cta hero-cta--ghost">
              דברו איתנו
            </a>
          </div>

        </div>
      </div>

      {/* Scroll affordance → first content section below the hero */}
      <a href="#hero-next" className="hero-scroll hero-fade" style={{ animationDelay: '0.5s' }} aria-label="גלול למטה">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
};

export default Hero;
