import { describe, it, expect } from 'vitest';
import {
  applyListingOrder,
  currentListingSeed,
  DEFAULT_LISTING_ORDER,
  extractNumericPrice,
  isListingOrder,
  LISTING_ORDERS,
  LISTING_ORDER_LABELS,
  toListingOrder,
} from '@/lib/listing-order';

// Input is always createdAt-desc (what every caller queries)
const rows = [
  { id: 1, price: '₪3,200,000' },
  { id: 2, price: '₪1,450,000' },
  { id: 3, price: '₪8,900,000' },
  { id: 4, price: '₪5,500' },
];

const ids = (list: { id: number }[]) => list.map((p) => p.id);

describe('extractNumericPrice', () => {
  it('parses ₪ and thousands separators', () => {
    expect(extractNumericPrice('₪3,200,000')).toBe(3200000);
    expect(extractNumericPrice('5500 ש״ח')).toBe(5500);
  });

  it('returns 0 for unparseable / missing prices', () => {
    expect(extractNumericPrice('צור קשר')).toBe(0);
    expect(extractNumericPrice(null)).toBe(0);
    expect(extractNumericPrice(undefined)).toBe(0);
    expect(extractNumericPrice('')).toBe(0);
  });
});

describe('toListingOrder / isListingOrder', () => {
  it('accepts every advertised order', () => {
    for (const order of LISTING_ORDERS) {
      expect(isListingOrder(order)).toBe(true);
      expect(toListingOrder(order)).toBe(order);
    }
  });

  it('falls back to the default for junk values', () => {
    for (const junk of ['', 'price', 'PRICE-ASC', null, undefined, 7, {}]) {
      expect(isListingOrder(junk)).toBe(false);
      expect(toListingOrder(junk)).toBe(DEFAULT_LISTING_ORDER);
    }
  });

  it('has a Hebrew label for every order', () => {
    for (const order of LISTING_ORDERS) {
      expect(LISTING_ORDER_LABELS[order]).toBeTruthy();
    }
  });
});

describe('applyListingOrder', () => {
  it('leaves newest-first untouched (input is already createdAt desc)', () => {
    expect(ids(applyListingOrder(rows, 'newest'))).toEqual([1, 2, 3, 4]);
  });

  it('sorts cheapest first for price-asc', () => {
    expect(ids(applyListingOrder(rows, 'price-asc'))).toEqual([4, 2, 1, 3]);
  });

  it('sorts most expensive first for price-desc', () => {
    expect(ids(applyListingOrder(rows, 'price-desc'))).toEqual([3, 1, 2, 4]);
  });

  it('pushes unpriced listings last in both price directions', () => {
    const withUnpriced = [{ id: 9, price: 'צור קשר' }, ...rows];
    expect(ids(applyListingOrder(withUnpriced, 'price-asc')).at(-1)).toBe(9);
    expect(ids(applyListingOrder(withUnpriced, 'price-desc')).at(-1)).toBe(9);
  });

  it('does not mutate the input array', () => {
    const input = [...rows];
    applyListingOrder(input, 'price-desc');
    expect(ids(input)).toEqual([1, 2, 3, 4]);
  });

  it('random is deterministic for a given seed', () => {
    // Same seed must yield the same order — SSR and the client refetch have to agree
    expect(ids(applyListingOrder(rows, 'random', 42))).toEqual(
      ids(applyListingOrder(rows, 'random', 42))
    );
  });

  it('random reorders and rotates across seeds', () => {
    const orders = new Set(
      Array.from({ length: 40 }, (_, seed) => ids(applyListingOrder(rows, 'random', seed)).join(','))
    );
    // More than one distinct permutation => exposure actually rotates
    expect(orders.size).toBeGreaterThan(1);
  });

  it('random keeps every item exactly once', () => {
    expect(ids(applyListingOrder(rows, 'random', 7)).sort()).toEqual([1, 2, 3, 4]);
  });
});

describe('currentListingSeed', () => {
  it('is stable within an hour and changes across hours', () => {
    const hour = 60 * 60 * 1000;
    const base = 1_800_000_000_000;
    expect(currentListingSeed(base)).toBe(currentListingSeed(base + hour - 1));
    expect(currentListingSeed(base)).not.toBe(currentListingSeed(base + hour));
  });
});
