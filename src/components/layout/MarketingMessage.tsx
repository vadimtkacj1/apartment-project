"use client";
import React from 'react';
import { motion } from 'framer-motion';

const MarketingMessage: React.FC = () => {
  return (
    <motion.div
      // Animation: Fade in and move up
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full max-w-3xl mx-auto mt-12 md:mt-16 lg:mt-24 px-4 sm:px-6 text-center"
    >
      {/* Background Glow Effect
          (Optional: Remove this div if you want a completely clean white background)
      */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] pointer-events-none -z-10 opacity-30"
        style={{
          background: 'radial-gradient(circle at center, rgba(193, 154, 107, 0.15) 0%, transparent 70%)'
        }}
      />

      <div className="space-y-4 md:space-y-6">

        {/* Top Subtitle */}
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-400 tracking-wide uppercase">
          שיווק נכסים ברמה אחרת בחולון ובת־ים
        </h3>

        {/* Main Headline with Gradient Text */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight px-2">
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#C19A6B] via-[#d4b08c] to-[#C19A6B] pb-2">
            ליווי אישי, תמחור מדויק ושיווק ממוקד
          </span>
        </h2>

        {/* Bottom Description */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-700 leading-relaxed max-w-2xl mx-auto px-2">
          שמביא את הנכס שלכם לקונים הנכונים ומוביל לעסקה בתנאים הטובים ביותר.
        </p>

      </div>
    </motion.div>
  );
};

export default MarketingMessage;