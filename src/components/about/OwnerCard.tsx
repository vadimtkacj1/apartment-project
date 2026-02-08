'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import type { Owner } from '@/app/(public)/about/aboutData';

interface OwnerCardProps {
  owner: Owner;
  index: number;
  inView: boolean;
}

export default function OwnerCard({ owner, index, inView }: OwnerCardProps) {
  return (
    <motion.div
      className="owner-card"
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -10 }}
    >
      <div className="owner-image-wrapper">
        <Image
          src={owner.image}
          alt={owner.name}
          width={400}
          height={400}
          className="owner-image"
        />
      </div>
      <div className="owner-info">
        <h3 className="owner-name">{owner.name}</h3>
        <p className="owner-title">{owner.title}</p>
        <p className="owner-description">{owner.description}</p>
        <div className="owner-contact">
          <a href={`tel:${owner.phone}`} className="contact-btn">
            <Phone size={18} />
            {owner.phone}
          </a>
          <a href={`mailto:${owner.email}`} className="contact-btn">
            <Mail size={18} />
            צור קשר
          </a>
        </div>
      </div>
    </motion.div>
  );
}
