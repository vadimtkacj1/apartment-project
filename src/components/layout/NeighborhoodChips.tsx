import React from 'react';
import Link from 'next/link';
import SectionEyebrow from '@/components/ui/SectionEyebrow';

/* Neighborhood quick-search — live counts from the DB (portal-grade utility).
   Server component; chips deep-link into the catalog's city filter. */

export interface HoodChip {
  name: string;
  city: string; // city slug for /apartments?city=
  count: number;
}

const NeighborhoodChips: React.FC<{ hoods: HoodChip[] }> = ({ hoods }) => {
  if (hoods.length === 0) return null;
  return (
    <section dir="rtl" className="w-full py-12 md:py-14 bg-warm">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <SectionEyebrow>חיפוש לפי שכונה</SectionEyebrow>
        <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
          {hoods.map((h) => (
            <li key={`${h.city}-${h.name}`}>
              <Link
                href={`/apartments?city=${h.city}`}
                className="inline-flex items-baseline gap-2 rounded-full bg-white border border-[#E4E8F2] px-4.5 px-5 py-2 text-[14px] font-semibold text-[#051150] hover:border-[#354AC4]/40 hover:text-[#354AC4] transition-colors"
              >
                {h.name}
                <span className="text-[12.5px] text-[#64748B] tabular-nums" dir="ltr">{h.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default NeighborhoodChips;
