import React from 'react';
import Image from 'next/image';

interface SoldBadgeProps {
  isSold: boolean;
}

export function SoldBadge({ isSold }: SoldBadgeProps) {
  if (!isSold) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <Image
        src="/images/sold.png"
        alt="נמכר"
        fill
        className="object-contain"
        sizes="100vw"
      />
    </div>
  );
}
