import React from 'react';
import Image from 'next/image';
import SectionEyebrow from '@/components/ui/SectionEyebrow';

/* «נמכר לאחרונה» — genuine sold-proof from the DB (grayscale thumbs + struck
   context). The strongest trust element a local agency has; server component. */

export interface SoldItem {
  id: number;
  title: string;
  location: string;
  neighborhood: string | null;
  price: string;
  image: string;
}

const SoldRecently: React.FC<{ items: SoldItem[] }> = ({ items }) => {
  if (items.length === 0) return null;
  return (
    <section dir="rtl" className="w-full py-14 md:py-16 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8">
          <SectionEyebrow>הוכחות, לא הבטחות</SectionEyebrow>
          <h2
            className="mt-3 text-4xl md:text-5xl font-black text-[#051150]"
            style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}
          >
            נמכר לאחרונה
          </h2>
        </div>
        <ul className="bg-white rounded-2xl border border-[#E9EDF5] shadow-elev-1 overflow-hidden">
          {items.map((s, i) => (
            <li key={s.id} className={`flex items-center gap-4 px-4 sm:px-6 py-4 ${i > 0 ? 'border-t border-[#EEF1F8]' : ''}`}>
              <div className="relative shrink-0 w-20 sm:w-24 aspect-[4/3] rounded-lg overflow-hidden bg-[#F4F6FB]">
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover grayscale opacity-80"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-bold text-[#051150] truncate">{s.title}</div>
                <div className="mt-0.5 text-[13px] text-[#64748B] truncate">
                  {s.location}{s.neighborhood ? ` · ${s.neighborhood}` : ''}
                </div>
              </div>
              <span className="shrink-0 rounded-md bg-[#F4F6FB] px-2.5 py-1 text-[12px] font-bold text-[#64748B]">
                נמכר
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SoldRecently;
