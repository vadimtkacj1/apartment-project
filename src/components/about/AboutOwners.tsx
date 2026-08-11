'use client';

import { useRef, useEffect, useState } from 'react';
import { m, useInView } from 'framer-motion';
import OwnerCard from './OwnerCard';
import SectionEyebrow from '@/components/ui/SectionEyebrow';

/** Loading placeholder matching OwnerCard's dimensions (photo → name → role → actions). */
function OwnerCardSkeleton() {
  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto w-full" aria-hidden="true">
      <div className="relative w-full max-w-[320px] aspect-[3/4] mb-8">
        <div className="w-full h-full rounded-[40px] bg-[#E4E8F2] animate-pulse motion-reduce:animate-none" />
      </div>
      <div className="w-full px-4 flex flex-col items-center">
        <div className="h-9 w-48 rounded-lg bg-[#E4E8F2] animate-pulse motion-reduce:animate-none mb-3" />
        <div className="h-5 w-32 rounded-lg bg-[#E4E8F2] animate-pulse motion-reduce:animate-none mb-6" />
        <div className="h-4 w-full max-w-sm rounded bg-[#E4E8F2] animate-pulse motion-reduce:animate-none mb-2" />
        <div className="h-4 w-3/4 max-w-xs rounded bg-[#E4E8F2] animate-pulse motion-reduce:animate-none mb-8" />
        <div className="flex justify-center gap-4">
          <div className="h-12 w-40 rounded-full bg-[#E4E8F2] animate-pulse motion-reduce:animate-none" />
          <div className="h-12 w-36 rounded-full bg-[#E4E8F2] animate-pulse motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}

type Owner = {
  id: number;
  name: string;
  title: string;
  image: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  licenceNumber: string | null;
  description: string | null;
};

export default function AboutOwners() {
  const ownersRef = useRef(null);
  const ownersInView = useInView(ownersRef, { once: true, amount: 0.2 });
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOwners() {
      try {
        const response = await fetch('/api/owners', {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          setOwners(data);
        }
      } catch (error) {
        console.error('Failed to fetch owners:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOwners();
  }, []);

  return (
    <m.section
      ref={ownersRef}
      className="relative py-24 w-full overflow-hidden bg-white"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={ownersInView ? { opacity: 1 } : {}}
    >
      <div className="relative z-10 max-w-[1300px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="mb-3">
            <SectionEyebrow tone="light" align="center">ההנהלה</SectionEyebrow>
          </div>
          <h2 className="font-caramel text-4xl md:text-5xl font-extrabold text-[#051150] mb-4">
            המייסדים שלנו
          </h2>
        </div>

        {/* Grid Layout - 2 Columns for Founders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 justify-items-center">
          {loading ? (
            <>
              <span className="sr-only" role="status">טוען נתונים…</span>
              <OwnerCardSkeleton />
              <OwnerCardSkeleton />
            </>
          ) : owners.length > 0 ? (
            owners.map((owner, index) => (
              <OwnerCard
                key={owner.id}
                owner={owner}
                index={index}
                inView={ownersInView}
              />
            ))
          ) : (
            <p className="text-center text-slate-400 col-span-2">אין מייסדים להצגה</p>
          )}
        </div>
        
      </div>
    </m.section>
  );
}