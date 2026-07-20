'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import { Phone, Mail, Check } from 'lucide-react';
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
  licenceNumber: string | null;
  description: string | null;
};

interface OwnerCardProps {
  owner: Owner;
  index: number;
  inView: boolean;
}

export default function OwnerCard({ owner, index, inView }: OwnerCardProps) {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (!owner.email) return;

    try {
      await navigator.clipboard.writeText(owner.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  // Get initials for the fallback avatar
  const initials = owner.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  // Consistent with AgentCard: show the real founder photo when one is available,
  // otherwise fall back to the branded initials avatar. Founders currently have no
  // photo on file, so this renders initials — but a photo appears automatically the
  // moment one is added (a broken/missing src also degrades to initials via onError).
  const HIDE_PHOTOS = false;
  const showImage = !HIDE_PHOTOS && owner.image && !imgError;

  return (
    <m.div
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
            <div className="w-full h-full flex items-center justify-center bg-[#354AC4]">
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
        <h3 className="font-caramel text-4xl font-extrabold text-[#051150] mb-2">
          {owner.name}
        </h3>

        {/* License Number */}
        {owner.licenceNumber && (
          <p className="text-xl text-[#2A69C4] font-bold mb-4 tracking-wide">
            {owner.licenceNumber}
          </p>
        )}

        {/* Title / Position */}
        <p className="text-xl text-[#2A69C4] font-bold mb-4">
          {owner.title}
        </p>

        {/* Description */}
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
              className="flex items-center gap-2 px-8 py-3 bg-[#354AC4] text-white rounded-full hover:bg-[#28389B] transition-colors"
            >
              <Phone size={18} />
              <span dir="ltr" className="font-medium">{owner.phone}</span>
            </a>
          )}

          {owner.email && (
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-[#354AC4] text-[#354AC4] rounded-full hover:bg-blue-50 transition-colors"
              title="לחצו להעתקת האימייל"
            >
              {copied ? (
                <>
                  <Check size={18} className="text-green-600" />
                  <span className="font-medium text-green-600">הועתק!</span>
                </>
              ) : (
                <>
                  <Mail size={18} />
                  <span className="font-medium" dir="ltr">{owner.email}</span>
                </>
              )}
            </button>
          )}

          {owner.whatsapp && (
            <a
              href={`https://wa.me/${owner.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3 bg-[#25D366] text-white rounded-full hover:bg-[#1fb855] transition-colors"
            >
              <FaWhatsapp size={20} />
              <span className="font-medium">WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </m.div>
  );
}
