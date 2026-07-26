import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/* Shared V3 "Marketplace" UI — Airbnb style-reference tokens.
   fog #f7f7f7 · surface #fff · ink #222 · slate #6a6a6a · mist #ebebeb
   coral #ff385c (scarce) · cards 20px radius, NO shadow · weights ≤700 */

export const INK = '#222222';
export const SLATE = '#6a6a6a';
export const MIST = '#ebebeb';
export const FOG = '#f7f7f7';
export const CORAL = '#ff385c';
export const PILL_SHADOW = 'rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 4px 8px 0px';

const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

export interface V3Prop {
  id: number; title: string; location: string; neighborhood: string | null;
  price: string; rooms: string | null; area: number | null;
  dealType: string; image: string; isPinned: boolean; isNew: boolean;
}

export const CITIES: Array<[string, string]> = [
  ['holon', 'חולון'], ['batyam', 'בת ים'], ['rishon', 'ראשון לציון'],
  ['telaviv', 'תל אביב'], ['ramat-gan', 'רמת גן'], ['givatayim', 'גבעתיים'],
];

export const TYPE_LABELS: Record<string, string> = {
  'apartment': 'דירה', 'garden-apartment': 'דירת גן', 'cottage': 'קוטג׳', 'house': 'בית',
  'duplex': 'דופלקס', 'penthouse': 'פנטהאוז', 'mini-penthouse': 'מיני פנטהאוז',
  'roof-apartment': 'דירת גג', 'housing-unit': 'יחידת דיור', 'studio': 'סטודיו', 'villa': 'וילה',
};

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
export function toV3Prop(p: any): V3Prop {
  return {
    id: p.id, title: p.title, location: p.location, neighborhood: p.neighborhood ?? null,
    price: p.price, rooms: p.rooms ?? null, area: p.area ?? null,
    dealType: p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale',
    image: firstImage(p.images), isPinned: Boolean(p.isPinned),
    isNew: p.createdAt ? Date.now() - new Date(p.createdAt).getTime() < NEW_WINDOW_MS : false,
  };
}

/* ---------- listing card: image-led, 20px radius, no shadow ---------- */

const badgeStyle: React.CSSProperties = {
  color: INK, fontWeight: 600, letterSpacing: '0.04em',
  filter: 'drop-shadow(rgba(0,0,0,0.25) 0px 2px 6px)',
};

export const Card: React.FC<{ p: V3Prop; priority?: boolean; fixed?: boolean }> = ({ p, priority, fixed }) => (
  <Link
    href={`/v3/apartments/${p.id}`}
    className={`group block ${fixed ? 'w-[262px] shrink-0 snap-start' : ''} rounded-[20px] focus-visible:outline-2 focus-visible:outline-[#222222] focus-visible:outline-offset-4`}
  >
    <div className="relative aspect-square overflow-hidden rounded-[20px]" style={{ background: '#dddddd' }}>
      <Image
        src={p.image}
        alt={p.title}
        fill
        sizes={fixed ? '262px' : '(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw'}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        {...(priority ? { priority: true } : { loading: 'lazy' as const })}
      />
      {(p.isPinned || p.isNew) && (
        <span className="absolute top-3 inset-inline-start-3 flex items-center gap-1.5">
          {p.isPinned && (
            <span className="bg-white rounded px-2.5 py-1.5 text-[11px]" style={badgeStyle}>בלעדי</span>
          )}
          {p.isNew && (
            <span className="bg-white rounded px-2.5 py-1.5 text-[11px]" style={badgeStyle}>חדש</span>
          )}
        </span>
      )}
    </div>
    <div className="pt-3 px-0.5">
      <span className="block text-[15px] truncate" style={{ fontWeight: 600, color: INK }}>{p.title}</span>
      <span className="block mt-0.5 text-[13.5px] truncate" style={{ color: SLATE }}>
        {p.location}{p.neighborhood ? ` · ${p.neighborhood}` : ''}
      </span>
      <span className="block mt-0.5 text-[13.5px]" style={{ color: SLATE }}>
        {[p.rooms && `${p.rooms} חדרים`, p.area && `${p.area} מ״ר`].filter(Boolean).join(' · ')}
      </span>
      <span className="block mt-1.5 text-[15px]" style={{ fontWeight: 600, color: INK }}>
        <span dir="ltr">₪{p.price}</span>
        {p.dealType === 'rent' && <span style={{ fontWeight: 400, color: SLATE }}> לחודש</span>}
      </span>
    </div>
  </Link>
);

export const RowHead: React.FC<{ title: string; href?: string; note?: React.ReactNode }> = ({ title, href, note }) => {
  const head = (
    <h2 className="text-[22px]" style={{ fontWeight: 600, color: INK, letterSpacing: '-0.2px' }}>{title}</h2>
  );
  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {href ? (
        <Link href={href} className="group inline-flex items-center gap-2">
          {head}
          <ArrowLeft size={18} aria-hidden="true" className="transition-transform group-hover:-translate-x-1" style={{ color: INK }} />
        </Link>
      ) : head}
      {note && <span className="text-[13.5px]" style={{ color: SLATE }}>{note}</span>}
    </div>
  );
};
