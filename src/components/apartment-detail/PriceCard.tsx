import React from 'react';
import { Phone } from 'lucide-react';
import { DealType } from '@/types/property.types';
import { analytics } from '@/lib/analytics';

interface PriceCardProps {
  price: string;
  originalPrice?: string;
  area?: number;
  isSold: boolean;
  dealType?: DealType;
  /** Primary contact phone — renders the call CTA when present (and not sold). */
  phone?: string;
  propertyId?: string;
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

export function PriceCard({ price, originalPrice, area, isSold, dealType, phone, propertyId }: PriceCardProps) {
  const numericPrice = parseFloat(String(price ?? '').replace(/[^\d.]/g, ''));
  const isRent = dealType === 'rent';
  const pricePerSqm =
    !isRent && area && area > 0 && Number.isFinite(numericPrice) && numericPrice > 0
      ? Math.round(numericPrice / area)
      : null;
  const telHref = phone ? `tel:${phone.replace(/\D/g, '')}` : null;

  return (
    <div className={`rounded-2xl p-8 mb-6 shadow-elev-2 ${
      isSold
        ? 'bg-gray-400 text-white opacity-75'
        : 'bg-[#051150] text-white'
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
      {!isSold && telHref && (
        <a
          href={telHref}
          onClick={() => propertyId && analytics.trackPhoneClick(propertyId)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-black text-[#051150] transition-colors hover:bg-[#f5f7fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#051150]"
        >
          <Phone size={18} aria-hidden="true" />
          <span>התקשרו</span>
        </a>
      )}
      {isSold && (
        <div className="mt-4 inline-flex items-center bg-[#64748B] text-white px-4 py-2 rounded-lg font-bold">
          <span>{dealType === 'rent' ? 'מושכר' : 'נמכר'}</span>
        </div>
      )}
    </div>
  );
}
