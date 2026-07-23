import React from 'react';
import { m } from 'framer-motion';
import { LayoutDashboard, ArrowUpFromLine, Maximize } from 'lucide-react';

interface PropertyDescriptionProps {
  description: string;
  bedrooms: number;
  floor?: number;
  totalFloors?: number;
  area: number;
  builtArea?: number | null;
  isSold: boolean;
}

export function PropertyDescription({ description, bedrooms, floor, totalFloors, area, builtArea, isSold }: PropertyDescriptionProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`rounded-2xl p-8 mb-8 shadow-lg border ${
        isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
      }`}
    >
      <h2 className={`text-2xl font-black mb-6 ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`}>תיאור הנכס</h2>

      <div className="flex flex-wrap gap-5 mb-8 pb-8 border-b border-gray-100">
        <div className="px-5 py-3 bg-gray-50 rounded-lg text-base font-bold text-gray-700 border border-gray-100 flex items-center gap-3">
          <LayoutDashboard size={20} className="text-[#354AC4]" aria-hidden="true"/>
          {bedrooms} חדרים
        </div>
        {floor !== null && floor !== undefined && (
          <div className="px-5 py-3 bg-gray-50 rounded-lg text-base font-bold text-gray-700 border border-gray-100 flex items-center gap-3">
            <ArrowUpFromLine size={20} className="text-[#354AC4]" aria-hidden="true"/>
            {floor === 0
              ? 'קומת קרקע'
              : (totalFloors !== null && totalFloors !== undefined && totalFloors > 0)
                ? `קומה ${floor} מתוך ${totalFloors}`
                : `קומה ${floor}`}
          </div>
        )}
        <div className="px-5 py-3 bg-gray-50 rounded-lg text-base font-bold text-gray-700 border border-gray-100 flex items-center gap-3">
          <Maximize size={20} className="text-[#354AC4]" aria-hidden="true"/>
          {area} מ״ר
        </div>
        {builtArea && (
          <div className="px-5 py-3 bg-gray-50 rounded-lg text-base font-bold text-gray-700 border border-gray-100 flex items-center gap-3">
            <Maximize size={20} className="text-[#354AC4]" aria-hidden="true"/>
            {builtArea} מ״ר בנוי
          </div>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        <p className={`text-xl leading-relaxed whitespace-pre-line font-medium ${
          isSold ? 'text-gray-500' : 'text-gray-800'
        }`}>
          {description}
        </p>
      </div>
    </m.div>
  );
}
