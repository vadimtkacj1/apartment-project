"use client";
import React from 'react';
import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { DealType } from '@/types/property.types';

interface HotPropositionCardProps {
  id: number;
  title: string;
  location: string;
  price: string;
  status?: string;
  isSold?: boolean;
  index?: number;
  image?: string;
  images?: string[];
  dealType?: DealType;
}

const HotPropositionCard: React.FC<HotPropositionCardProps> = ({
  id,
  title,
  location,
  price,
  status,
  isSold,
  index,
  image,
  images,
  dealType
}) => {
  const getStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      'Exclusive': 'בלעדי',
      'Opportunity': 'הזדמנות',
      'New': 'חדש'
    };
    return status ? labels[status] || status : '';
  };

  // Determine the main image to display
  const displayImage = image || (images && images.length > 0 ? images[0] : '/images/placeholder.webp');

  return (
    <Link
      href={`/apartments/${id}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSold) {
          analytics.trackPropertyClick(id, 'card');
        }
      }}
      className="block h-full"
    >
      <m.div
        whileHover={isSold ? {} : { y: -4, scale: 1.02 }}
        className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
          isSold
            ? 'bg-gray-50 border-2 border-gray-200 opacity-70'
            : 'bg-white border border-gray-100 shadow-lg hover:shadow-xl'
        }`}
        style={{
          boxShadow: isSold
            ? '0 2px 8px rgba(0, 0, 0, 0.08)'
            : '0 4px 16px rgba(5, 17, 80, 0.12), 0 0 32px rgba(5, 17, 80, 0.06)'
        }}
        dir="rtl"
      >
        {/* Property Image */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={displayImage}
            alt={title}
            fill
            className={`object-contain transition-all duration-500 ${
              isSold ? 'grayscale opacity-50' : 'group-hover:scale-105'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index !== undefined && index < 3}
          />

          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Logo overlay - positioned left */}
          <div className="absolute top-4 left-4 z-30 pointer-events-none">
            <Image
              src="/aiterra-logo.png"
              alt="לוגו Aiterra"
              width={44}
              height={32}
              className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
            />
          </div>

          {/* Status Badge - positioned right for RTL */}
          {status && !isSold && (
            <div className="absolute top-4 right-4 z-30">
              <div className="bg-[#051150] text-white px-4 py-2 text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm">
                {getStatusLabel(status)}
              </div>
            </div>
          )}

          {/* Price Badge - positioned at bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
            <div className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl backdrop-blur-md shadow-xl ${
              isSold
                ? 'bg-gray-500/80 text-gray-200'
                : 'bg-[#051150]/90 text-white'
            }`}>
              <p className={`text-2xl sm:text-3xl font-black ${isSold ? 'line-through' : ''}`}>
                <span dir="ltr">{price} ₪</span>
              </p>
              {isSold && (
                <div className="flex items-center gap-1.5 bg-red-600 px-3 py-1 text-xs font-bold rounded-md">
                  <CheckCircle2 size={14} />
                  <span>{dealType === 'rent' ? 'מושכר' : 'נמכר'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sold overlay */}
          {isSold && (
            <>
              <div className="absolute inset-0 bg-gray-900/40 z-10"></div>
              <div className="absolute inset-0 z-15 flex items-center justify-center">
                <Image
                  src={dealType === 'rent' ? '/Rented.svg' : '/Sold.svg'}
                  alt={dealType === 'rent' ? 'מושכר' : 'נמכר'}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </>
          )}
        </div>

        {/* Card Content */}
        <div className={`p-6 sm:p-7 flex flex-col flex-1 ${isSold ? 'bg-gray-50' : 'bg-white'}`}>

          {/* Title and Location */}
          <div className="flex-1 mb-5">
            <h3 className={`text-2xl font-bold leading-tight mb-4 line-clamp-2 min-h-[3.5rem] ${
              isSold ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {title}
            </h3>

            {/* Location with enhanced styling */}
            <div className={`flex items-center gap-2 ${
              isSold ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className={`p-1.5 rounded-lg ${isSold ? 'bg-gray-200' : 'bg-blue-50'}`}>
                <MapPin size={16} className={`${isSold ? 'text-gray-400' : 'text-[#354AC4]'}`} />
              </div>
              <span className="text-sm sm:text-base font-semibold truncate">{location}</span>
            </div>
          </div>

          {/* Action Button with improved styling */}
          <div className="mt-auto">
            {isSold ? (
              <div className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-300 text-white font-bold rounded-2xl text-base opacity-60 cursor-not-allowed">
                <CheckCircle2 size={18} />
                <span>{dealType === 'rent' ? 'מושכר' : 'נמכר'}</span>
              </div>
            ) : (
              <button className="w-full group/btn">
                <div className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#354AC4] to-[#4A5FD6] text-white font-bold rounded-2xl text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
                  <span>לפרטים נוספים</span>
                  <ArrowLeft size={18} className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
                </div>
              </button>
            )}
          </div>
        </div>
      </m.div>
    </Link>
  );
};

export default HotPropositionCard;

