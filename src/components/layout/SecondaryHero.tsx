import React from 'react';

interface SecondaryHeroProps {
  img: string;
  title: string;
  centered?: boolean;
}

const SecondaryHero: React.FC<SecondaryHeroProps> = ({ img, title, centered = false }) => {
  return (
    <section
      dir="rtl"
      className="relative w-full overflow-hidden"
      style={{ isolation: 'isolate' }}
    >
      <div
        className="relative w-full overflow-hidden flex items-center min-h-[30vh] md:min-h-[40vh] pt-[70px]"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

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
                fontFamily: 'var(--font-caramel), cursive, sans-serif'
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
