'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import AgentCard from './AgentCard';

type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string | null;
  phone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  license: string | null;
  description: string | null;
};

export default function AboutTeam() {
  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, amount: 0.1 });
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch('/api/team');
        if (response.ok) {
          const data = await response.json();
          setTeam(data);
        }
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  return (
    <motion.section
      ref={teamRef}
      className="relative py-24 w-full overflow-hidden bg-[#faf7f2]"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={teamInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
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
          {loading ? (
            <p className="text-center text-slate-400">טוען נתונים...</p>
          ) : team && team.length > 0 ? (
            team.map((member, index) => (
              <AgentCard
                key={member.id}
                member={member}
                index={index}
                isEven={index % 2 === 0}
              />
            ))
          ) : (
            <p className="text-center text-slate-400">אין חברי צוות להצגה</p>
          )}
        </div>

      </div>
    </motion.section>
  );
}