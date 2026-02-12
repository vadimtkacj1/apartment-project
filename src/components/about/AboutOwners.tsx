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
      className="py-24 w-full bg-[#fdfbf7]" // Warm beige background
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={ownersInView ? { opacity: 1 } : {}}
    >
      <div className="max-w-[1300px] mx-auto px-6">
        
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