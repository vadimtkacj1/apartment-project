'use client';

import { m } from 'framer-motion';
import Image from 'next/image';
import { Phone, Mail, Check } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useState } from 'react';

/** Normalize an IL phone for wa.me: strip non-digits, leading 0 → 972. */
function toWhatsappNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.startsWith('0') ? `972${digits.slice(1)}` : digits;
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

  // Real, agency-owned photos of our licensed agents (first-party → copyright-safe).
  // Set HIDE_PHOTOS = true to fall back to a branded initials avatar.
  const HIDE_PHOTOS = false;
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
            <div className="w-full h-full flex items-center justify-center bg-[#354AC4]">
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
            <h3 className="font-caramel text-3xl md:text-4xl font-extrabold text-[#051150] mb-3">
              {member.name}
            </h3>

            {/* Role — the single accent line */}
            <p className={`text-xl text-[#354ac4] font-semibold ${member.licenceNumber ? 'mb-1' : 'mb-6'}`}>
              {member.role}
            </p>

            {/* License Number — quiet, under the role */}
            {member.licenceNumber && (
              <p className="text-sm text-slate-500 mb-6">
                רישיון מס׳ {member.licenceNumber}
              </p>
            )}

            {/* Description */}
            <p className="text-slate-600 leading-relaxed text-lg mb-8 max-w-lg mx-auto md:mx-0">
              {member.description || "סוכן נדלן מקצועי עם ניסיון עשיר בשוק המקומי בחולון. מתמחה בליווי אישי ומקצועי לכל אורך הדרך."}
            </p>

            {/* Contact Buttons Grid */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {/* Main Phone (only when one exists — no tel:null) */}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-3 px-6 py-3 bg-[#354AC4] text-white rounded-full hover:bg-[#28389B] transition-all hover:shadow-lg group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5594f1] focus-visible:ring-offset-2"
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
                )}

                {/* WhatsApp (same number as the phone line) */}
                {member.phone && (
                  <a
                    href={`https://wa.me/${toWhatsappNumber(member.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`וואטסאפ אל ${member.name}`}
                    className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full hover:bg-[#1fb855] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5594f1] focus-visible:ring-offset-2"
                  >
                    <FaWhatsapp size={20} aria-hidden="true" />
                    <span className="font-medium">WhatsApp</span>
                  </a>
                )}

                {/* Email (if exists) */}
                {member.email && (
                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-3 px-6 py-3 bg-white border border-[#354AC4] text-[#354ac4] rounded-full hover:bg-blue-50 transition-all relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5594f1] focus-visible:ring-offset-2"
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