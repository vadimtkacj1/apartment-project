import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SoldBadgeProps {
  isSold: boolean;
}

export function SoldBadge({ isSold }: SoldBadgeProps) {
  if (!isSold) return null;

  return (
    <>
      {/* Sold Overlay */}
      <div className="fixed inset-0 bg-gray-900/20 z-40 pointer-events-none"></div>

      {/* Sold Badge - Fixed Position */}
      <div className="fixed top-20 right-8 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2 font-bold text-lg">
        <CheckCircle2 size={24} />
        <span>נמכר</span>
      </div>
    </>
  );
}
