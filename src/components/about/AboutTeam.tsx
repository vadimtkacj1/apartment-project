'use client';

import { useRef, useEffect, useState } from 'react';
import { m, useInView } from 'framer-motion';
import AgentCard from './AgentCard';
import SectionEyebrow from '@/components/ui/SectionEyebrow';

/** Loading placeholder matching AgentCard's checkerboard layout (photo | text column). */
function AgentCardSkeleton({ isEven }: { isEven: boolean }) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 ${
        !isEven ? 'md:flex-row-reverse' : ''
      }`}
      aria-hidden="true"
    >
      <div className="w-full md:w-[45%] flex justify-center">
        <div className="relative aspect-[3/4] md:aspect-[4/5] w-full max-w-[320px] md:max-w-sm rounded-[30px] bg-[#E4E8F2] animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="w-full md:w-[55%] flex flex-col items-center md:items-start">
        <div className={`w-full flex flex-col items-center md:items-start ${!isEven ? 'md:pr-6' : 'md:pl-6'}`}>
          <div className="h-9 w-56 rounded-lg bg-[#E4E8F2] animate-pulse motion-reduce:animate-none mb-4" />
          <div className="h-5 w-36 rounded-lg bg-[#E4E8F2] animate-pulse motion-reduce:animate-none mb-8" />
          <div className="h-4 w-full max-w-lg rounded bg-[#E4E8F2] animate-pulse motion-reduce:animate-none mb-2" />
          <div className="h-4 w-full max-w-md rounded bg-[#E4E8F2] animate-pulse motion-reduce:animate-none mb-2" />
          <div className="h-4 w-2/3 max-w-sm rounded bg-[#E4E8F2] animate-pulse motion-reduce:animate-none mb-8" />
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="h-12 w-44 rounded-full bg-[#E4E8F2] animate-pulse motion-reduce:animate-none" />
            <div className="h-12 w-40 rounded-full bg-[#E4E8F2] animate-pulse motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string | null;
  phone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  licenceNumber: string | null;
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
        const response = await fetch('/api/team', {
          cache: 'no-store'
        });
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
    <m.section
      ref={teamRef}
      className="relative py-24 w-full overflow-hidden bg-[#f5f7fb]"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={teamInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="relative z-10 max-w-[1200px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <div className="mb-3">
            <SectionEyebrow tone="light" align="center">הסוכנים שלנו</SectionEyebrow>
          </div>
          <m.h2
            initial={{ y: -20, opacity: 0 }}
            animate={teamInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="font-caramel text-4xl md:text-5xl font-extrabold text-[#051150] mb-6"
          >
            הצוות המקצועי
          </m.h2>
          <m.p 
            initial={{ y: -20, opacity: 0 }}
            animate={teamInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
          >
            סוכני הנדל"ן המומחים שלנו כאן כדי לעזור לכם בכל שלב – משלב החיפוש הראשוני ועד לסגירת העסקה.
          </m.p>
        </div>

        {/* Agents List Container */}
        <div className="flex flex-col gap-24 md:gap-32">
          {loading ? (
            <>
              <span className="sr-only" role="status">טוען נתונים…</span>
              <AgentCardSkeleton isEven={true} />
              <AgentCardSkeleton isEven={false} />
            </>
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
    </m.section>
  );
}