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
      className="py-24 w-full bg-[#fdfbf7]" // Warm beige background
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={teamInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        
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