'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AgentCard from './AgentCard';
import { team } from '@/app/(public)/about/aboutData';

export default function AboutTeam() {
  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={teamRef}
      className="team-section"
      initial={{ opacity: 0 }}
      animate={teamInView ? { opacity: 1 } : {}}
    >
      <div className="team-container">
        <h2 className="section-title">הצוות המקצועי</h2>
        <p className="section-subtitle">
          סוכני הנדל"ן המומחים שלנו כאן כדי לעזור לכם בכל שלב
        </p>

        <div className="agents-list">
          {team.map((member, index) => (
            <AgentCard
              key={member.id}
              member={member}
              index={index}
              inView={teamInView}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
