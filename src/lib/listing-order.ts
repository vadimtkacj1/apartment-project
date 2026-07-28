/**
 * Listing order for the public property catalog (/apartments).
 *
 * The agency picks the order in the CMS (admin → ניהול נכסים) and it is stored
 * on the HomepageSettings singleton. Both the server-rendered page and
 * /api/properties read it through here so the first paint and every later
 * client refetch agree on the order.
 */

export const LISTING_ORDERS = ['newest', 'price-asc', 'price-desc', 'random'] as const;

export type ListingOrder = (typeof LISTING_ORDERS)[number];

export const DEFAULT_LISTING_ORDER: ListingOrder = 'newest';

/** Hebrew labels for the CMS control and the public "מיון לפי" dropdown. */
export const LISTING_ORDER_LABELS: Record<ListingOrder, string> = {
  newest: 'החדשים ביותר',
  'price-asc': 'מחיר: נמוך לגבוה',
  'price-desc': 'מחיר: גבוה לנמוך',
  random: 'אקראי',
};

export function isListingOrder(value: unknown): value is ListingOrder {
  return typeof value === 'string' && (LISTING_ORDERS as readonly string[]).includes(value);
}

/** Coerce anything (DB value, request body, query param) to a valid order. */
export function toListingOrder(value: unknown): ListingOrder {
  return isListingOrder(value) ? value : DEFAULT_LISTING_ORDER;
}

/**
 * `price` is stored as a free-text string ("₪3,200,000", "5500 ש״ח"), so price
 * ordering has to happen in JS on the parsed number rather than in SQL.
 */
export function extractNumericPrice(price: unknown): number {
  const digits = String(price ?? '').replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) || 0 : 0;
}

/**
 * Seed for `random`, bucketed by the hour.
 *
 * A fresh seed per request would make the server HTML and the client's refetch
 * disagree, and would reshuffle the list under the reader every time "load
 * more" fires. Bucketing keeps one stable order per hour — still rotating
 * exposure across all listings day to day, but deterministic while someone is
 * actually browsing, and safe to cache.
 */
export function currentListingSeed(now: number = Date.now()): number {
  return Math.floor(now / (60 * 60 * 1000));
}

/** Deterministic 32-bit hash — same id + seed always yields the same rank. */
function hashRank(id: number, seed: number): number {
  let h = (id ^ seed) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

interface Orderable {
  id: number;
  price?: string | null;
  createdAt?: Date | string | null;
}

/**
 * Returns a new array ordered per `order`. Input is assumed to already be in
 * createdAt-desc order (what every caller queries), so `newest` is a no-op.
 */
export function applyListingOrder<T extends Orderable>(
  items: T[],
  order: ListingOrder,
  seed: number = currentListingSeed()
): T[] {
  const sorted = [...items];

  switch (order) {
    case 'price-asc':
      // Unpriced listings ("צור קשר") sort last either way rather than as ₪0.
      return sorted.sort((a, b) => comparePrice(a, b, 1));
    case 'price-desc':
      return sorted.sort((a, b) => comparePrice(a, b, -1));
    case 'random':
      return sorted.sort((a, b) => hashRank(a.id, seed) - hashRank(b.id, seed));
    case 'newest':
    default:
      return sorted;
  }
}

function comparePrice(a: Orderable, b: Orderable, direction: 1 | -1): number {
  const pa = extractNumericPrice(a.price);
  const pb = extractNumericPrice(b.price);
  if (pa === 0 && pb === 0) return 0;
  if (pa === 0) return 1;
  if (pb === 0) return -1;
  return (pa - pb) * direction;
}
