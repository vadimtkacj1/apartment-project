'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import OwnerCard from './OwnerCard';

type Owner = {
  id: number;
  name: string;
  title: string;
  image: string | null;
  phone: string | null;
  email: string | null;
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
        const response = await fetch('/api/owners');
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
    <motion.section
      ref={ownersRef}
      className="relative py-24 w-full overflow-hidden"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={ownersInView ? { opacity: 1 } : {}}
    >
      <div className="relative z-10 max-w-[1300px] 2xl:max-w-[1800px] mx-auto px-6 2xl:px-16">
        
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1c3664] mb-4">
            המייסדים שלנו
          </h2>
        </div>

        {/* Grid Layout - 2 Columns for Founders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 justify-items-center">
          {loading ? (
            <p className="text-center text-slate-400 col-span-2">טוען נתונים...</p>
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
    </motion.section>
  );
}