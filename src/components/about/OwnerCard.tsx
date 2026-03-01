'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';

type Owner = {
  id: number;
  name: string;
  title: string;
  image: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
};

interface OwnerCardProps {
  owner: Owner;
  index: number;
  inView: boolean;
}

export default function OwnerCard({ owner, index, inView }: OwnerCardProps) {
  return (
    <motion.div
      // REMOVED: bg-white, shadow, border
      // ONLY: layout and spacing
      className="flex flex-col items-center text-center max-w-lg mx-auto"
      
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      
      {/* --- Image Section --- */}
      <div className="relative w-full max-w-[320px] aspect-[3/4] mb-8">
        <div className="relative w-full h-full overflow-hidden rounded-[40px] shadow-2xl shadow-blue-900/10">
          <Image
            src={owner.image || '/images/placeholder-avatar.jpg'}
            alt={owner.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      </div>

      {/* --- Text Info Section --- */}
      <div className="w-full px-4">
        <h3 className="text-4xl font-extrabold text-[#1c3664] mb-2">
          {owner.name}
        </h3>
        
        <p className="text-xl text-blue-600 font-bold mb-4 tracking-wide">
          {owner.title}
        </p>
        
        {owner.description && (
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {owner.description}
          </p>
        )}

        {/* Contact Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {owner.phone && (
            <a
              href={`tel:${owner.phone}`}
              className="flex items-center gap-2 px-8 py-3 bg-[#1c3664] text-white rounded-full hover:bg-blue-800 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <Phone size={18} />
              <span dir="ltr" className="font-medium">{owner.phone}</span>
            </a>
          )}

          {owner.email && (
            <a
              href={`mailto:${owner.email}`}
              className="flex items-center gap-2 px-8 py-3 bg-white border border-slate-300 text-slate-700 rounded-full hover:bg-slate-50 transition-all hover:border-[#1c3664]"
            >
              <Mail size={18} />
              <span className="font-medium" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>צור קשר</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}