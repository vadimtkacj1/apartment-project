'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';

type Owner = {
  id: number;
  name: string;
  title: string;
  image: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  description: string | null;
};

interface OwnerCardProps {
  owner: Owner;
  index: number;
  inView: boolean;
}

export default function OwnerCard({ owner, index, inView }: OwnerCardProps) {
  const [imgError, setImgError] = useState(false);

  // Get initials for the fallback avatar
  const initials = owner.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  const showImage = owner.image && !imgError;

  return (
    <motion.div
      className="flex flex-col items-center text-center max-w-lg mx-auto"
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >

      {/* --- Image Section --- */}
      <div className="relative w-full max-w-[320px] aspect-[3/4] mb-8">
        <div className="relative w-full h-full overflow-hidden rounded-[40px] shadow-2xl shadow-blue-900/10 bg-[#e8edf5]">
          {showImage ? (
            <Image
              src={owner.image!}
              alt={owner.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 400px"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Fallback: initials avatar when no image or broken image */
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c3664] to-[#2d5a9e]">
              <span className="text-white font-extrabold" style={{ fontSize: '5rem', lineHeight: 1 }}>
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* --- Text Info Section --- */}
      <div className="w-full px-4">
        {/* Name */}
        <h3 className="text-4xl font-extrabold text-[#1c3664] mb-2">
          {owner.name}
        </h3>

        {/* Title / Position */}
        <p className="text-xl text-blue-600 font-bold mb-4 tracking-wide">
          {owner.title}
        </p>

        {/* Description */}
        {owner.description && (
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {owner.description}
          </p>
        )}

        {/* Email address displayed as text (above buttons) */}
        {owner.email && (
          <p className="text-slate-500 text-sm mb-6 flex items-center justify-center gap-2">
            <Mail size={14} className="text-[#1c3664]" />
            <a
              href={`mailto:${owner.email}`}
              className="hover:text-[#1c3664] transition-colors underline underline-offset-2"
              dir="ltr"
            >
              {owner.email}
            </a>
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

          {owner.whatsapp && (
            <a
              href={`https://wa.me/${owner.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 bg-[#25D366] text-white rounded-full hover:bg-[#1fb855] transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <FaWhatsapp size={20} />
              <span className="font-medium">WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
