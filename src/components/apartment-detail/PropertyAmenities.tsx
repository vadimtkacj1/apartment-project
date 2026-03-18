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
    mamak?: boolean;
    bars?: boolean;
    pets?: boolean;
    housingUnit?: boolean;
    shelter?: boolean;
  };
  isSold: boolean;
}

export function PropertyAmenities({ amenities, isSold }: PropertyAmenitiesProps) {
  const availableAmenities = ALL_AMENITIES.filter((item) => amenities[item.key as keyof typeof amenities]);
  if (availableAmenities.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`rounded-2xl p-8 shadow-lg border mb-8 ${
        isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
      }`}
    >
      <h2 className={`text-3xl font-black mb-8 uppercase ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`}>תוספות</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-6">
        {availableAmenities.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.key} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors text-[#1c3664] bg-[#1c3664]/10">
                  <IconComponent size={24} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-base text-[#1a1a1a]">
                  {item.label}
                </span>
              </div>
            );
          })}
      </div>
    </motion.div>
  );
}
