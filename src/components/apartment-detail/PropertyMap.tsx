import React from 'react';
import { motion } from 'framer-motion';

interface PropertyMapProps {
  isSold: boolean;
  latitude?: number | null;
  longitude?: number | null;
  location?: string;
}

export function PropertyMap({ isSold, latitude, longitude, location }: PropertyMapProps) {
  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';
  const locationQuery = location?.trim() ? `${location}, Israel` : 'Tel Aviv, Israel';
  const mapSrc = hasCoordinates
    ? `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&z=15&output=embed`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`rounded-2xl p-8 shadow-lg border ${
        isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
      }`}
    >
      <h2 className={`text-3xl font-black mb-6 uppercase ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`}>מיקום</h2>
      <div className="rounded-xl overflow-hidden shadow-md">
        <iframe
          src={mapSrc}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
      </div>
    </motion.div>
  );
}
