import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowUpFromLine, Maximize } from 'lucide-react';

interface PropertyDescriptionProps {
  description: string;
  bedrooms: number;
  floor?: number;
  area: number;
  isSold: boolean;
}

export function PropertyDescription({ description, bedrooms, floor, area, isSold }: PropertyDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`rounded-2xl p-8 mb-8 shadow-lg border ${
        isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
      }`}
    >
      <h2 className={`text-3xl font-black mb-6 uppercase ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`}>תיאור הנכס</h2>

      <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
          <LayoutDashboard size={16} className="text-[#1c3664]"/>
          {bedrooms} חדרים
        </div>
        {floor && (
          <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
            <ArrowUpFromLine size={16} className="text-[#1c3664]"/>
            קומה {floor}
          </div>
        )}
        <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-gray-100 flex items-center gap-2">
          <Maximize size={16} className="text-[#1c3664]"/>
          {area} מ״ר
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className={`text-lg leading-relaxed whitespace-pre-line font-medium ${
          isSold ? 'text-gray-500' : 'text-gray-800'
        }`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}
