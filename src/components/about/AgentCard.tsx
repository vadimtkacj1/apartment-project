'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import { Phone, Mail, Check } from 'lucide-react';
import { useState } from 'react';

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

interface AgentCardProps {
  member: TeamMember;
  index: number;
  isEven: boolean;
}

export default function AgentCard({ member, index, isEven }: AgentCardProps) {
  const [copied, setCopied] = useState(false);

  // SAFETY CHECK: If member data is missing, do not render anything to prevent crashes.
  if (!member) return null;

  const handleCopyEmail = async () => {
    if (!member.email) return;

    try {
      await navigator.clipboard.writeText(member.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  // Photos hidden for now (awaiting real/generated images) — shows a branded
  // initials avatar instead. Set HIDE_PHOTOS = false to restore real photos.
  const HIDE_PHOTOS = true;
  const initials = (member.name || '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <m.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      // LAYOUT & SPACING FIXES:
      // 1. md:gap-12 (reduced from gap-20 to bring text closer to image).
      // 2. justify-center (centers content).
      // 3. Checkerboard logic: If !isEven, reverse the row direction.
      className={`flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 ${
        !isEven ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* --- Image Section (45% width) --- */}
      <div className="w-full md:w-[45%] flex justify-center">
        <div className="relative aspect-[3/4] md:aspect-[4/5] w-full max-w-[320px] md:max-w-sm overflow-hidden rounded-[30px] shadow-2xl shadow-blue-900/10 border border-white/50">
          {!HIDE_PHOTOS && member.image ? (
            <Image
              src={member.image}
              alt={member.name || 'Agent'}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : (
            /* Fallback: branded initials avatar */
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c3664] to-[#2d5a9e]">
              <span className="text-white font-extrabold" style={{ fontSize: '5rem', lineHeight: 1 }}>
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* --- Text Content Section (55% width) --- */}
      {/* We give text slightly more width (55%) to reduce whitespace between columns */}
      <div className="w-full md:w-[55%] text-center md:text-right flex flex-col items-center md:items-start">
        
        {/* Inner wrapper with padding based on direction to ensure text doesn't touch the image too closely, but isn't too far either */}
        <div className={`w-full ${!isEven ? 'md:pr-6' : 'md:pl-6'}`}>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#1c3664] mb-3">
              {member.name}
            </h3>

            {/* License Number */}
            {member.licenceNumber && (
              <p className="text-xl text-blue-600 font-semibold mb-6">
                {member.licenceNumber}
              </p>
            )}

            <p className="text-xl text-blue-600 font-semibold mb-6">
              {member.role}
            </p>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed text-lg mb-8 max-w-lg mx-auto md:mx-0">
              {member.description || "סוכן נדלן מקצועי עם ניסיון עשיר בשוק המקומי בחולון. מתמחה בליווי אישי ומקצועי לכל אורך הדרך."}
            </p>

            {/* Contact Buttons Grid */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {/* Main Phone */}
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-3 px-6 py-3 bg-[#1c3664] text-white rounded-full hover:bg-blue-800 transition-all hover:shadow-lg group"
                >
                  <Phone size={18} className="group-hover:rotate-12 transition-transform" />
                  <span
                    dir="ltr"
                    className="font-medium"
                    style={{ direction: 'ltr', unicodeBidi: 'embed' }}
                  >
                    {member.phone}
                  </span>
                </a>

                {/* Email (if exists) */}
                {member.email && (
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-[#1c3664] text-[#1c3664] rounded-full hover:bg-blue-50 transition-all relative group"
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
                        <span
                          className="font-medium"
                          dir="ltr"
                          style={{ direction: 'ltr', unicodeBidi: 'embed' }}
                        >
                          {member.email}
                        </span>
                      </>
                    )}
                  </button>
                )}
            </div>
        </div>
      </div>
    </m.div>
  );
}