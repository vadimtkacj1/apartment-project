import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { DealType } from '@/types/property.types';

interface PriceCardProps {
  price: string;
  originalPrice?: string;
  area?: number;
  isSold: boolean;
  dealType?: DealType;
}

/**
 * Format a price string with thousands separators while preserving any
 * non-numeric suffix (e.g. "/חודש" on rentals) and stripping a leading ₪
 * (callers render their own currency symbol). Falls back to the raw value
 * when the input isn't a clean number.
 */
export function formatShekelPrice(raw?: string): string {
  if (!raw) return '';
  const trimmed = String(raw).trim();
  const numeric = parseFloat(trimmed.replace(/[^\d.]/g, ''));
  // Anything beyond digits / separators / ₪ (e.g. "/חודש") means we can't safely
  // re-group the number — keep the original text minus a leading currency mark.
  const hasNonNumericSuffix = /[^\d.,\s₪]/.test(trimmed);
  if (hasNonNumericSuffix || !Number.isFinite(numeric)) {
    return trimmed.replace(/^[₪\s]*/, '');
  }
  return numeric.toLocaleString('en-US');
}

export function PriceCard({ price, originalPrice, area, isSold, dealType }: PriceCardProps) {
  const numericPrice = parseFloat(String(price ?? '').replace(/[^\d.]/g, ''));
  const isRent = dealType === 'rent';
  const pricePerSqm =
    !isRent && area && area > 0 && Number.isFinite(numericPrice) && numericPrice > 0
      ? Math.round(numericPrice / area)
      : null;

  return (
    <div className={`rounded-2xl p-8 mb-6 shadow-2xl ${
      isSold
        ? 'bg-gray-400 text-white opacity-75'
        : 'bg-gradient-to-br from-[#051150] via-[#354AC4] to-[#5594F1] text-white'
    }`}>
      <div className="text-sm font-bold mb-2 opacity-90">מחיר מבוקש</div>
      <div className={`text-4xl font-black mb-2 ${isSold ? 'line-through' : ''}`}>
        <span dir="ltr">{formatShekelPrice(price)} ₪</span>
      </div>
      {pricePerSqm && (
        <div className="text-sm font-semibold opacity-90 mb-4">
          מחיר למ״ר: <span dir="ltr">{pricePerSqm.toLocaleString('en-US')} ₪</span>
        </div>
      )}
      {originalPrice && (
        <div className="text-lg font-semibold opacity-75">
          מחיר מקורי: <span dir="ltr">{formatShekelPrice(originalPrice)} ₪</span>
        </div>
      )}
      {isSold && (
        <div className="mt-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
          <CheckCircle2 size={20} aria-hidden="true" />
          <span>{dealType === 'rent' ? 'מושכר' : 'נמכר'}</span>
        </div>
      )}
    </div>
  );
}
