"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';

interface PropertyCardProps {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  originalPrice?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status?: string;
  index?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  image,
  title,
  location,
  price,
  originalPrice,
  bedrooms,
  bathrooms,
  area,
  status,
  index = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Status Badge */}
        {status && (
          <div className="absolute top-4 right-4 bg-[#C19A6B] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
            {status}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6" dir="rtl">
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin size={18} className="text-[#C19A6B]" />
          <span className="text-sm font-semibold">{location}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-gray-900 mb-4 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* Features */}
        <div className="flex items-center gap-4 mb-5 text-gray-700">
          <div className="flex items-center gap-2">
            <Bed size={20} className="text-[#C19A6B]" />
            <span className="text-sm font-bold">{bedrooms} חדרים</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath size={20} className="text-[#C19A6B]" />
            <span className="text-sm font-bold">{bathrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize size={20} className="text-[#C19A6B]" />
            <span className="text-sm font-bold">{area} מ״ר</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-baseline gap-2">
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through font-semibold">
                {originalPrice}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-gray-900">{price}</span>
              <span className="text-lg text-gray-600 font-bold">₪</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-semibold mt-1">מחיר:</p>
        </div>

        {/* CTA Button */}
        <Link
          href={`/apartments/${id}`}
          className="block w-full text-center px-6 py-4 bg-[#C19A6B] text-white font-black text-lg rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          למכירה
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
