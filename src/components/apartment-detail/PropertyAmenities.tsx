import React from 'react';
import { motion } from 'framer-motion';
import { ALL_AMENITIES } from './constants';

interface PropertyAmenitiesProps {
  amenities: {
    ac: boolean;
    handicap: boolean;
    solarHeater: boolean;
    storage: boolean;
    sunBalcony: boolean;
    boiler: boolean;
    mamad: boolean;
    elevator: boolean;
  };
  isSold: boolean;
}

export function PropertyAmenities({ amenities, isSold }: PropertyAmenitiesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`rounded-2xl p-8 shadow-lg border mb-8 ${
        isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
      }`}
    >
      <h2 className={`text-3xl font-black mb-6 uppercase ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`}>תוספות</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
        {ALL_AMENITIES.map((item) => {
          const isAvailable = amenities[item.key as keyof typeof amenities];
          const IconComponent = item.icon;

          return (
            <div key={item.key} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${isAvailable
                  ? 'text-[#1c3664] bg-[#1c3664]/10'
                  : 'text-gray-300 bg-gray-50'
                }`}
              >
                <IconComponent size={20} strokeWidth={isAvailable ? 2 : 1.5} />
              </div>
              <span className={`font-bold text-sm ${
                isAvailable ? 'text-[#1a1a1a]' : 'text-gray-400 line-through decoration-gray-300'
              }`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
