import React from 'react';
import Image from 'next/image';

interface PropertiesBannerProps {
  img?: string;
}

const PropertiesBanner: React.FC<PropertiesBannerProps> = ({ img = "/7.jpg" }) => {
  return (
    <section
      dir="rtl"
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden m-0 p-0"
    >
      {/* Blurred Cityscape Background */}
      <div className="absolute inset-0 m-0 p-0">
        <Image
          src={img}
          alt="Cityscape background"
          fill
          className="object-cover"
          style={{
            filter: 'blur(12px)',
            transform: 'scale(1.15)',
          }}
          priority
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-5" />

      {/* Blue/Teal Overlay Rectangle with Text - Centered */}
      <div className="absolute inset-0 flex items-center justify-center z-10 m-0 p-0">
        <h2 
          className="text-white text-2xl md:text-4xl lg:text-5xl font-bold text-center whitespace-nowrap px-6 py-3 md:px-8 md:py-4 rounded-lg inline-block" 
          style={{ 
            fontFamily: 'var(--font-assistant), Arial, sans-serif',
            letterSpacing: '0.02em',
            textShadow: 'none',
            backgroundColor: 'rgba(28, 54, 100, 0.75)',
            backdropFilter: 'blur(10px)'
          }}>
          נכסים למכירה והשכרה
        </h2>
      </div>
    </section>
  );
};

PropertiesBanner.displayName = 'PropertiesBanner';

export default PropertiesBanner;

