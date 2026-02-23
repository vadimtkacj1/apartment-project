'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import OwnerCard from './OwnerCard';
import { owners } from '@/app/(public)/about/aboutData';

export default function AboutOwners() {
  const ownersRef = useRef(null);
  const ownersInView = useInView(ownersRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ownersRef}
      className="relative py-24 w-full bg-[#faf7f2] overflow-hidden" // Warm beige background
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={ownersInView ? { opacity: 1 } : {}}
    >
      {/* Decorative shapes - more elements, brighter colors */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          {/* Curved organic shapes */}
          <path d="M 7% 30% Q 14% 35%, 10% 45% T 7% 55%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 93% 50% Q 86% 55%, 90% 65% T 93% 75%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 12% 25% Q 18% 30%, 15% 40% T 12% 50%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          <path d="M 88% 55% Q 82% 60%, 85% 70% T 88% 80%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          
          {/* Organic blobs */}
          <ellipse cx="14%" cy="40%" rx="40" ry="28" fill="#4a7ab5" opacity="0.3" transform="rotate(-20 14% 40%)"/>
          <ellipse cx="86%" cy="45%" rx="40" ry="28" fill="#4a7ab5" opacity="0.3" transform="rotate(20 86% 45%)"/>
          <ellipse cx="20%" cy="30%" rx="38" ry="26" fill="#a8c5e8" opacity="0.28" transform="rotate(22 20% 30%)"/>
          <ellipse cx="80%" cy="50%" rx="38" ry="26" fill="#a8c5e8" opacity="0.28" transform="rotate(-18 80% 50%)"/>
          <ellipse cx="50%" cy="20%" rx="32" ry="22" fill="#b8d0f0" opacity="0.26" transform="rotate(15 50% 20%)"/>
          <ellipse cx="50%" cy="70%" rx="30" ry="20" fill="#b8d0f0" opacity="0.26" transform="rotate(-12 50% 70%)"/>
          
          {/* Center organic shapes */}
          <path d="M 25% 45% C 30% 40%, 35% 45%, 30% 50% C 25% 55%, 20% 50%, 25% 45% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 75% 45% C 80% 40%, 85% 45%, 80% 50% C 75% 55%, 70% 50%, 75% 45% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 30% 35% C 35% 30%, 40% 35%, 35% 40% C 30% 45%, 25% 40%, 30% 35% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 70% 55% C 75% 50%, 80% 55%, 75% 60% C 70% 65%, 65% 60%, 70% 55% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 45% 50% C 50% 45%, 55% 50%, 50% 55% C 45% 60%, 40% 55%, 45% 50% Z" fill="#b8d0f0" opacity="0.24"/>
          
          {/* Curved rounded shapes */}
          <rect x="12%" y="80%" width="22" height="22" rx="7"
            fill="#4a7ab5" opacity="0.33"
            transform="rotate(15 calc(12% + 11) calc(80% + 11))"
          />
          <rect x="88%" y="80%" width="22" height="22" rx="7"
            fill="#4a7ab5" opacity="0.33"
            transform="rotate(-15 calc(88% - 11) calc(80% + 11))"
          />
          <rect x="18%" y="75%" width="20" height="20" rx="6"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(18 calc(18% + 10) calc(75% + 10))"
          />
          <rect x="82%" y="75%" width="20" height="20" rx="6"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(-18 calc(82% - 10) calc(75% + 10))"
          />
        </svg>
      </div>

      {/* Floating accent dots */}
      <div className="absolute left-1/4 top-[30%] w-3 h-3 rounded-full bg-[#1c3664] opacity-33 pointer-events-none z-0"/>
      <div className="absolute right-1/4 top-[35%] w-2.5 h-2.5 rounded-full bg-[#1c3664] opacity-30 pointer-events-none z-0"/>
      <div className="absolute left-1/3 bottom-[20%] w-3.5 h-3.5 rounded-full bg-[#1c3664] opacity-27 pointer-events-none z-0"/>
      <div className="absolute right-1/3 bottom-[25%] w-2 h-2 rounded-full bg-[#1c3664] opacity-35 pointer-events-none z-0"/>

      <div className="relative z-10 max-w-[1300px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c3664] mb-4">
            המייסדים שלנו
          </h2>
        </div>

        {/* Grid Layout - 2 Columns for Founders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 justify-items-center">
          {owners.map((owner, index) => (
            <OwnerCard
              key={owner.id}
              owner={owner}
              index={index}
              inView={ownersInView}
            />
          ))}
        </div>
        
      </div>
    </motion.section>
  );
}