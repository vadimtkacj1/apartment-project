import React from 'react';
import { Search } from 'lucide-react';
import HeroMedia from './HeroMedia';
import { ISRAELI_CITIES } from '@/data/cities';

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

        /* Search pill — 1:1 the Refero reference spec (segmented white pill):
           label 12px/600 over value 14px, 1px hairline dividers between
           segments, circular brand trigger at the end, exact layered shadow
           stack rgba(0,0,0,.02) ring + .04 mid + .10 drop. */
        .hero-pill {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 560px;
          background: #ffffff;
          border-radius: 9999px;
          padding: 6px;
          padding-inline-start: 0;
          box-shadow: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 4px 8px 0px;
        }
        .hero-pill-seg {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1px;
          min-width: 0;
          padding-block: 8px;
          padding-inline: 26px 16px;
          text-align: start;
          cursor: pointer;
        }
        .hero-pill-seg--grow { flex: 1; }
        .hero-pill-label {
          font-size: 12px;
          font-weight: 600;
          color: #051150;
          line-height: 1.2;
        }
        .hero-pill-seg select {
          appearance: none;
          -webkit-appearance: none;
          border: 0;
          padding: 0;
          background: transparent;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          color: #64748B;
          cursor: pointer;
          max-width: 100%;
        }
        .hero-pill-seg select:focus-visible { outline: 2px solid #354AC4; outline-offset: 2px; border-radius: 4px; }
        .hero-pill-div {
          flex: none;
          width: 1px;
          height: 32px;
          background: #E4E8F2;
        }
        .hero-pill-btn {
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border: 0;
          border-radius: 50%;
          background: #354AC4;
          color: #ffffff;
          cursor: pointer;
          transition: background-color 0.15s ease;
          margin-inline-start: 8px;
        }
        .hero-pill-btn:hover { background: #28389B; }
        .hero-pill-btn:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }
        @media (max-width: 420px) {
          .hero-pill-seg { padding-inline: 18px 10px; }
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

          {/* search pill — 1:1 reference anatomy; server-rendered GET form */}
          <form action="/apartments" method="GET" className="hero-pill hero-fade mt-3" style={{ animationDelay: '0.34s' }}>
            <label className="hero-pill-seg">
              <span className="hero-pill-label">סוג עסקה</span>
              <select name="dealType" defaultValue="sale">
                <option value="sale">לקנייה</option>
                <option value="rent">להשכרה</option>
              </select>
            </label>
            <span aria-hidden="true" className="hero-pill-div" />
            <label className="hero-pill-seg hero-pill-seg--grow">
              <span className="hero-pill-label">איפה</span>
              <select name="city" defaultValue="holon">
                <option value="">כל הערים</option>
                {ISRAELI_CITIES.slice(0, 12).map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="hero-pill-btn" aria-label="חיפוש נכסים">
              <Search size={19} aria-hidden="true" />
            </button>
          </form>

          <a
            href="#contact"
            className="hero-fade mt-1 text-[14.5px] font-semibold text-white/85 underline-offset-4 hover:underline"
            style={{ animationDelay: '0.44s' }}
          >
            או דברו איתנו ישירות
          </a>

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
