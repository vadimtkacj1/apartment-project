import React from 'react';
import Image from 'next/image';

interface SecondaryHeroProps {
  img: string;
  title: string;
  centered?: boolean;
  /** Optional small eyebrow above the title (Hebrew — no tracking/uppercase). */
  kicker?: string;
  /** Optional supporting line rendered below the title. */
  subtitle?: string;
}

const SecondaryHero: React.FC<SecondaryHeroProps> = ({ img, title, centered = false, kicker, subtitle }) => {
  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      <div
        className="relative w-full overflow-hidden flex items-center min-h-[30vh] md:min-h-[40vh] pt-[70px]"
      >
        {/* Background Image — next/image so it's resized/AVIF'd and, as the
            LCP element of these pages, fetched with high priority */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={img}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Brand möbius scrim: ink navy → indigo → near-transparent sky,
              replacing the flat black/40. Keeps white type legible while
              letting the photo breathe at the far corner. */}
          {/* .hero-scrim lets an active theme (src/themes) repaint this scrim
              without forking the component. */}
          <div
            className="absolute inset-0 hero-scrim"
            style={{
              background:
                'linear-gradient(135deg, rgba(5,17,80,0.80) 0%, rgba(40,56,155,0.55) 45%, rgba(85,148,241,0.22) 100%)',
            }}
          />
        </div>

        {/* קונטיינר תוכן מיושר לימין */}
        <div className="relative z-20 w-full px-6 md:px-12 lg:px-20">
          <div className={`flex flex-col ${
            centered
              ? 'mx-auto items-center text-center'
              : 'ms-0 me-auto items-start text-right max-w-full md:max-w-[75%] lg:max-w-[65%]'
          }`}>

            {kicker && (
              <span
                className="block mb-4 font-bold text-[#7FB4F5]"
                style={{
                  fontSize: 'clamp(0.85rem, 1.4vw, 1.15rem)',
                  textShadow: '0 1px 6px rgba(5,17,80,0.6)',
                }}
              >
                {kicker}
              </span>
            )}

            <h1
              className="font-black text-white"
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 4.5rem)',
                lineHeight: 1.2,
                textShadow: '0 2px 14px rgba(5,17,80,0.55), 0 1px 3px rgba(0,0,0,0.4)',
                fontFamily: 'var(--font-caramel), cursive, sans-serif',
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className="mt-4 font-medium text-white/90 max-w-2xl leading-relaxed"
                style={{
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.3rem)',
                  textShadow: '0 1px 8px rgba(5,17,80,0.5)',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondaryHero;
