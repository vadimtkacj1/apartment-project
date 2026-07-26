import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/* Shared V8 "Trulia" UI — faithful port of trulia.com's design system (RTL/Hebrew).
   Tokens read off the reference screenshots:
   ink #2A2A33 · slate #5B5B66 · line #E8E7EA · fog #F7F7F8
   CORAL #F1483C (search trigger only) · GREEN #0A7B44 (primary CTAs)
   slate tile #44525C · green tile #1E5F46 · cards: 8px radius, hairline, flat */

export const INK = '#2A2A33';
export const SLATE = '#5B5B66';
export const LINE = '#E8E7EA';
export const FOG = '#F7F7F8';
export const CORAL = '#F1483C';
export const GREEN = '#0A7B44';
export const TILE_SLATE = '#44525C';
export const TILE_GREEN = '#1E5F46';

const NEW_MS = 14 * 24 * 60 * 60 * 1000;

export interface V8Prop {
  id: number; title: string; location: string; neighborhood: string | null;
  price: string; rooms: string | null; bathrooms: number | null; area: number | null;
  floor: number | null; dealType: string; image: string; isPinned: boolean; isNew: boolean;
}

export const CITIES: Array<[string, string]> = [
  ['holon', 'חולון'], ['batyam', 'בת ים'], ['rishon', 'ראשון לציון'],
  ['telaviv', 'תל אביב'], ['ramat-gan', 'רמת גן'], ['givatayim', 'גבעתיים'],
];

/** DB price strings are inconsistent («2500000», «2,450.000», «7,700») —
    normalize pure-digit values to comma-grouped display, pass others through. */
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
export function toV8(p: any): V8Prop {
  return {
    id: p.id, title: p.title, location: p.location, neighborhood: p.neighborhood ?? null,
    price: p.price, rooms: p.rooms ?? null, bathrooms: p.bathrooms ?? null, area: p.area ?? null,
    floor: p.floor ?? null,
    dealType: p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale',
    image: firstImage(p.images), isPinned: Boolean(p.isPinned),
    isNew: p.createdAt ? Date.now() - new Date(p.createdAt).getTime() < NEW_MS : false,
  };
}

/* ---------- the Trulia listing card: badge top-start, bold price, meta, address ---------- */

export const TCard: React.FC<{ p: V8Prop; priority?: boolean }> = ({ p, priority }) => (
  <Link
    href={`/v8/apartments/${p.id}`}
    className="group block bg-white rounded-lg overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2"
    style={{ border: `1px solid ${LINE}`, outlineColor: INK }}
  >
    <div className="relative aspect-[3/2] overflow-hidden" style={{ background: FOG }}>
      <Image
        src={p.image} alt={p.title} fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        {...(priority ? { priority: true } : { loading: 'lazy' as const })}
      />
      <span className="absolute top-2.5 inset-inline-start-2.5 flex gap-1.5">
        {p.isNew && (
          <span className="bg-white rounded px-2 py-1 text-[11px] font-bold" style={{ color: INK, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
            חדש
          </span>
        )}
        {p.isPinned && (
          <span className="rounded px-2 py-1 text-[11px] font-bold text-white" style={{ background: TILE_GREEN, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
            בלעדי
          </span>
        )}
      </span>
    </div>
    <div className="px-3.5 py-3">
      <div className="text-[19px] font-extrabold tabular-nums" style={{ color: INK }}>
        <span dir="ltr">₪{formatPrice(p.price)}</span>
        {p.dealType === 'rent' ? <span className="text-[13px] font-semibold" style={{ color: SLATE }}> לחודש</span> : null}
      </div>
      <div className="mt-1 text-[13.5px] font-semibold" style={{ color: INK }}>
        {[p.rooms && `${p.rooms} חד׳`, p.bathrooms && `${p.bathrooms} שירותים`, p.area && `${p.area} מ״ר`].filter(Boolean).join(' · ')}
      </div>
      <div className="mt-0.5 text-[13px] truncate" style={{ color: SLATE }}>
        {p.title} · {p.location}{p.neighborhood ? `, ${p.neighborhood}` : ''}
      </div>
    </div>
  </Link>
);
