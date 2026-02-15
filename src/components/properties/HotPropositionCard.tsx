"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

interface HotPropositionCardProps {
  id: number;
  title: string;
  location: string;
  price: string;
  status?: string;
  isSold?: boolean;
  index?: number;
}

const HotPropositionCard: React.FC<HotPropositionCardProps> = ({
  id,
  title,
  location,
  price,
  status,
  isSold,
  index
}) => {
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
      <motion.div
        whileHover={isSold ? {} : { y: -4, scale: 1.02 }}
        className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full ${
          isSold 
            ? 'bg-gray-50 border-2 border-gray-200 opacity-70' 
            : 'bg-white border border-gray-100 shadow-lg hover:shadow-xl'
        }`}
        style={{
          boxShadow: isSold 
            ? '0 2px 8px rgba(0, 0, 0, 0.08)' 
            : '0 4px 16px rgba(28, 54, 100, 0.12), 0 0 32px rgba(28, 54, 100, 0.06)'
        }}
        dir="rtl"
      >
        {/* Price Header */}
        <div className={`p-4 sm:p-5 ${isSold ? 'bg-gray-100' : 'bg-gradient-to-br from-[#1c3664] via-[#1c3664] to-[#2a4a7a]'}`}>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Badges */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isSold && (
                <div className="flex items-center gap-1 sm:gap-1.5 bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-lg shadow-md">
                  <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>נמכר</span>
                </div>
              )}
              {status && !isSold && (
                <div className="bg-white/25 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold rounded-lg">
                  {status}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="text-left">
              <p className={`text-lg sm:text-2xl font-black leading-tight ${isSold ? 'text-gray-400 line-through' : 'text-white'}`}>
                {price}
              </p>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className={`p-4 sm:p-5 flex flex-col flex-1 justify-between ${isSold ? 'bg-gray-50' : 'bg-white'}`}>

          {/* Title and Location */}
          <div className="mb-3 sm:mb-4">
            <h3 className={`text-base sm:text-lg font-bold leading-tight line-clamp-2 mb-2 sm:mb-3 ${
              isSold ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {title}
            </h3>

            {/* Location */}
            <div className={`flex items-center gap-1.5 sm:gap-2 ${
              isSold ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <MapPin size={14} className={`sm:w-4 sm:h-4 ${isSold ? 'text-gray-400' : 'text-[#1c3664]'}`} />
              <span className="text-xs sm:text-sm font-medium truncate">{location}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100">
            {isSold ? (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-gray-300 text-white font-bold rounded-xl text-xs sm:text-sm opacity-70">
                <CheckCircle2 size={14} className="sm:w-4 sm:h-4" />
                <span>נמכר</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-[#1c3664] text-white font-bold rounded-xl text-xs sm:text-sm hover:bg-[#152a4f] transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105">
                <span>לפרטים נוספים</span>
                <ArrowLeft size={14} className="sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default HotPropositionCard;

