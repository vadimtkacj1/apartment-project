import React from 'react';
import Image from 'next/image';
import { DealType } from '@/types/property.types';

interface SoldBadgeProps {
  isSold: boolean;
  dealType?: DealType;
}

export function SoldBadge({ isSold, dealType }: SoldBadgeProps) {
  if (!isSold) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <Image
        src={dealType === 'rent' ? '/Rented.svg' : '/Sold.svg'}
        alt={dealType === 'rent' ? 'מושכר' : 'נמכר'}
        fill
        className="object-contain"
        sizes="100vw"
      />
    </div>
  );
}
