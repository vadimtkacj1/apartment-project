import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PriceCardProps {
  price: string;
  originalPrice?: string;
  isSold: boolean;
}

export function PriceCard({ price, originalPrice, isSold }: PriceCardProps) {
  return (
    <div className={`rounded-2xl p-8 mb-6 shadow-2xl ${
      isSold
        ? 'bg-gray-400 text-white opacity-75'
        : 'bg-gradient-to-br bg-[#2A4A8A] text-white'
    }`}>
      <div className="text-sm font-bold mb-2 opacity-90">מחיר:</div>
      <div className={`text-4xl font-black mb-4 ${isSold ? 'line-through' : ''}`}>
        {price}
      </div>
      {originalPrice && (
        <div className="text-lg font-semibold opacity-75">
          מחיר מקורי: {originalPrice}
        </div>
      )}
      {isSold && (
        <div className="mt-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
          <CheckCircle2 size={20} />
          <span>נמכר</span>
        </div>
      )}
    </div>
  );
}
