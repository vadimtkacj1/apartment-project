'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AgentCard from './AgentCard';
// IMPORTANT: Verify this import path matches your project structure
import { team } from '@/app/(public)/about/aboutData';

export default function AboutTeam() {
  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, amount: 0.1 });

  return (
    <motion.section
      ref={teamRef}
      className="relative py-24 w-full bg-[#faf7f2] overflow-hidden" // Warm beige background
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={teamInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative shapes - more elements, brighter colors */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          {/* Curved organic shapes */}
          <path d="M 9% 28% Q 16% 33%, 12% 43% T 9% 53%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 91% 38% Q 84% 43%, 88% 53% T 91% 63%" fill="none" stroke="#4a7ab5" strokeWidth="2.5" opacity="0.4" strokeLinecap="round"/>
          <path d="M 14% 23% Q 20% 28%, 17% 38% T 14% 48%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          <path d="M 86% 33% Q 80% 38%, 83% 48% T 86% 58%" fill="none" stroke="#a8c5e8" strokeWidth="2" opacity="0.35" strokeLinecap="round"/>
          
          {/* Organic blobs */}
          <ellipse cx="17%" cy="35%" rx="41" ry="29" fill="#4a7ab5" opacity="0.3" transform="rotate(-21 17% 35%)"/>
          <ellipse cx="83%" cy="40%" rx="41" ry="29" fill="#4a7ab5" opacity="0.3" transform="rotate(21 83% 40%)"/>
          <ellipse cx="22%" cy="28%" rx="39" ry="27" fill="#a8c5e8" opacity="0.28" transform="rotate(24 22% 28%)"/>
          <ellipse cx="78%" cy="45%" rx="39" ry="27" fill="#a8c5e8" opacity="0.28" transform="rotate(-19 78% 45%)"/>
          <ellipse cx="50%" cy="25%" rx="34" ry="23" fill="#b8d0f0" opacity="0.26" transform="rotate(16 50% 25%)"/>
          <ellipse cx="50%" cy="70%" rx="32" ry="22" fill="#b8d0f0" opacity="0.26" transform="rotate(-14 50% 70%)"/>
          
          {/* Middle organic shapes */}
          <path d="M 15% 50% C 20% 45%, 25% 50%, 20% 55% C 15% 60%, 10% 55%, 15% 50% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 85% 50% C 90% 45%, 95% 50%, 90% 55% C 85% 60%, 80% 55%, 85% 50% Z" fill="#4a7ab5" opacity="0.28"/>
          <path d="M 20% 45% C 25% 40%, 30% 45%, 25% 50% C 20% 55%, 15% 50%, 20% 45% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 80% 55% C 85% 50%, 90% 55%, 85% 60% C 80% 65%, 75% 60%, 80% 55% Z" fill="#a8c5e8" opacity="0.26"/>
          <path d="M 45% 50% C 50% 45%, 55% 50%, 50% 55% C 45% 60%, 40% 55%, 45% 50% Z" fill="#b8d0f0" opacity="0.24"/>
          <path d="M 55% 50% C 60% 45%, 65% 50%, 60% 55% C 55% 60%, 50% 55%, 55% 50% Z" fill="#b8d0f0" opacity="0.24"/>
          
          {/* Curved rounded shapes */}
          <rect x="30%" y="75%" width="24" height="24" rx="8"
            fill="#4a7ab5" opacity="0.33"
            transform="rotate(18 calc(30% + 12) calc(75% + 12))"
          />
          <rect x="70%" y="75%" width="24" height="24" rx="8"
            fill="#4a7ab5" opacity="0.33"
            transform="rotate(-18 calc(70% - 12) calc(75% + 12))"
          />
          <rect x="35%" y="70%" width="22" height="22" rx="7"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(20 calc(35% + 11) calc(70% + 11))"
          />
          <rect x="65%" y="70%" width="22" height="22" rx="7"
            fill="#a8c5e8" opacity="0.32"
            transform="rotate(-20 calc(65% - 11) calc(70% + 11))"
          />
          <rect x="50%" y="80%" width="20" height="20" rx="6"
            fill="#b8d0f0" opacity="0.3"
            transform="rotate(15 calc(50% + 10) calc(80% + 10))"
          />
        </svg>
      </div>

      {/* Floating accent dots */}
      <div className="absolute left-[18%] top-[25%] w-2.5 h-2.5 rounded-full bg-[#1c3664] opacity-34 pointer-events-none z-0"/>
      <div className="absolute right-[18%] top-[30%] w-3 h-3 rounded-full bg-[#1c3664] opacity-31 pointer-events-none z-0"/>
      <div className="absolute left-[28%] bottom-[15%] w-3.5 h-3.5 rounded-full bg-[#1c3664] opacity-26 pointer-events-none z-0"/>
      <div className="absolute right-[28%] bottom-[20%] w-2 h-2 rounded-full bg-[#1c3664] opacity-36 pointer-events-none z-0"/>

      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={teamInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-[#1c3664] mb-6"
          >
            הצוות המקצועי
          </motion.h2>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={teamInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            סוכני הנדל"ן המומחים שלנו כאן כדי לעזור לכם בכל שלב – משלב החיפוש הראשוני ועד לסגירת העסקה.
          </motion.p>
        </div>

        {/* Agents List Container */}
        <div className="flex flex-col gap-24 md:gap-32">
          {/* Check if team data exists before mapping */}
          {team && team.length > 0 ? (
            team.map((member, index) => (
              <AgentCard
                key={member.id}
                member={member}
                index={index}

                isEven={index % 2 === 0} 
              />
            ))
          ) : (
             // Fallback loading state
            <p className="text-center text-slate-400">Loading team data...</p>
          )}
        </div>

      </div>
    </motion.section>
  );
}