/**
 * Data helpers for the moonlit theme.
 *
 * Presentation lives entirely in the template's own stylesheets, so this file
 * carries no components — only the shaping between Prisma rows and the markup.
 */

export const FALLBACK_IMAGE = '/images/hero/sales.jpg';

export interface MnProp {
  id: number;
  title: string;
  location: string;
  neighborhood: string | null;
  price: string;
  rooms: string | null;
  area: number | null;
  floor: number | null;
  dealType: 'sale' | 'rent';
  image: string;
}

export function allImages(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr.filter(Boolean) as string[]) : [];
  } catch {
    return [];
  }
}

export function firstImage(raw: string | null | undefined): string {
  return allImages(raw)[0] ?? FALLBACK_IMAGE;
}

export function formatPrice(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  return digits ? Number(digits).toLocaleString('en-US') : raw;
}

/** The property columns a moonlit card needs — what MoonlitHome selects. */
export interface MnPropRow {
  id: number;
  title: string;
  location: string;
  neighborhood: string | null;
  price: string;
  rooms: number | string | null;
  area: number | null;
  floor: number | null;
  dealType: string;
  category: string | null;
  images: string | null;
}

export function toMnProp(p: MnPropRow): MnProp {
  return {
    id: p.id,
    title: p.title,
    location: p.location,
    neighborhood: p.neighborhood ?? null,
    price: p.price,
    rooms: p.rooms != null ? String(p.rooms) : null,
    area: p.area ?? null,
    floor: p.floor ?? null,
    // `category` wins over `dealType` when they disagree (mirrors /api/properties).
    dealType: p.category === 'rentals' || p.dealType === 'rent' ? 'rent' : 'sale',
    image: firstImage(p.images),
  };
}
