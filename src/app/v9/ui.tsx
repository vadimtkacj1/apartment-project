import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/* V9 "Resort" — design language rebuilt 1:1 from the Kinsley demo's anatomy
   (own code, own content): ice-cyan canvas, deep-navy chrome, vivid-blue
   pills, white rounded cards, geometric sans, generous centered rhythm. */

export const ICE = '#F2FFFF';
export const NAVY = '#171A2D';
export const BLUE = '#3B5CF0';
export const INKV = '#383A4E';
export const SLATEV = '#64688C';
export const LINEV = '#E3EDED';

export interface V9Prop {
  id: number; title: string; location: string; neighborhood: string | null;
  price: string; rooms: string | null; area: number | null; dealType: string; image: string;
}

export const CITIES: Array<[string, string]> = [
  ['holon', 'חולון'], ['batyam', 'בת ים'], ['rishon', 'ראשון לציון'],
  ['telaviv', 'תל אביב'], ['ramat-gan', 'רמת גן'], ['givatayim', 'גבעתיים'],
];

export function formatPrice(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return raw;
  return Number(digits).toLocaleString('en-US');
}

export function firstImage(val: string | null | undefined): string {
  if (!val) return '/images/hero/sales.jpg';
  try { const a = JSON.parse(val); return Array.isArray(a) && a[0] ? a[0] : '/images/hero/sales.jpg'; }
  catch { return '/images/hero/sales.jpg'; }
}

export function allImages(val: string | null | undefined): string[] {
  if (!val) return [];
  try { const a = JSON.parse(val); return Array.isArray(a) ? a.filter(Boolean) : []; }
  catch { return []; }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toV9(p: any): V9Prop {
  return {
    id: p.id, title: p.title, location: p.location, neighborhood: p.neighborhood ?? null,
    price: p.price, rooms: p.rooms ?? null, area: p.area ?? null,
    dealType: p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale',
    image: firstImage(p.images),
  };
}

export const Pill: React.FC<{ href: string; children: React.ReactNode; ghost?: boolean }> = ({ href, children, ghost }) => (
  <Link
    href={href}
    className="inline-flex items-center justify-center rounded-full px-7 py-2.5 text-[13.5px] font-semibold transition-[filter] hover:brightness-110"
    style={ghost ? { border: `1px solid ${BLUE}`, color: BLUE } : { background: BLUE, color: '#fff' }}
  >
    {children}
  </Link>
);

/* room-style property card: white, soft radius, image, centered body, blue pill */
export const RoomCard: React.FC<{ p: V9Prop; priority?: boolean }> = ({ p, priority }) => (
  <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 10px 30px -12px rgba(23,26,45,0.18)' }}>
    <div className="relative aspect-[4/3] overflow-hidden">
      <Image
        src={p.image} alt={p.title} fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
        className="object-cover"
        {...(priority ? { priority: true } : { loading: 'lazy' as const })}
      />
      <span className="absolute top-3 inset-inline-start-3 rounded-full px-3.5 py-1.5 text-[11.5px] font-bold text-white" style={{ background: BLUE }}>
        ₪{formatPrice(p.price)}{p.dealType === 'rent' ? ' / לחודש' : ''}
      </span>
    </div>
    <div className="p-5 text-center">
      <h3 className="text-[17px] font-semibold truncate" style={{ color: INKV }}>{p.title}</h3>
      <p className="mt-1 text-[13px]" style={{ color: SLATEV }}>
        {p.location}{p.neighborhood ? ` · ${p.neighborhood}` : ''}
        {[p.rooms && ` · ${p.rooms} חד׳`, p.area && ` · ${p.area} מ״ר`].filter(Boolean).join('')}
      </p>
      <div className="mt-4">
        <Pill href={`/v9/apartments/${p.id}`}>לפרטים</Pill>
      </div>
    </div>
  </div>
);

export const SectionHead: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <div className="text-center max-w-[640px] mx-auto mb-9">
    <h2 className="text-[30px] md:text-[38px] font-semibold" style={{ color: INKV, lineHeight: 1.2 }}>{title}</h2>
    {sub && <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: SLATEV }}>{sub}</p>}
  </div>
);
