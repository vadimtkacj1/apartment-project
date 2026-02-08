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
      className="owners-section"
      initial={{ opacity: 0 }}
      animate={ownersInView ? { opacity: 1 } : {}}
    >
      <div className="owners-container">
        <h2 className="section-title">המייסדים שלנו</h2>

        <div className="owners-grid">
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
