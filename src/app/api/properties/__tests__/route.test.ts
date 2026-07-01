import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { property: { findMany } } }));

import { GET } from '@/app/api/properties/route';
import { CENTER_REGION_CITY_SLUGS } from '@/data/cities';

function row(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    title: 'Flat',
    price: '₪3,200,000',
    rooms: '4',
    area: 90,
    category: 'sales',
    dealType: 'rent', // intentionally mismatched; category should win
    directions: '["north"]',
    images: '["/a.jpg","/b.jpg"]',
    isActive: 1,
    isSold: 0,
    isPinned: 1,
    hasElevator: 1,
    hasPets: 0,
    createdAt: new Date('2026-01-01'),
    ...overrides,
  };
}

const get = (qs = '') =>
  GET(new NextRequest(`http://localhost/api/properties${qs}`));

const whereOf = () => findMany.mock.calls.at(-1)![0].where;

describe('GET /api/properties', () => {
  beforeEach(() => {
    findMany.mockReset().mockResolvedValue([row()]);
  });

  it('returns formatted properties (arrays parsed, booleans coerced)', async () => {
    const res = await get();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].images).toEqual(['/a.jpg', '/b.jpg']);
    expect(body[0].directions).toEqual(['north']);
    expect(body[0].isActive).toBe(true);
    expect(body[0].hasElevator).toBe(true);
    expect(body[0].hasPets).toBe(false);
  });

  it('always filters to active properties', async () => {
    await get();
    expect(whereOf().isActive).toBe(true);
  });

  it('reconciles dealType from category (category wins)', async () => {
    findMany.mockResolvedValue([
      row({ category: 'sales', dealType: 'rent' }),
      row({ id: 2, category: 'rentals', dealType: 'sale' }),
    ]);
    const body = await (await get()).json();
    expect(body[0].dealType).toBe('sale'); // sales -> sale
    expect(body[1].dealType).toBe('rent'); // rentals -> rent
  });

  it('maps region=center to the Gush Dan city slug list', async () => {
    await get('?region=center');
    expect(whereOf().city).toEqual({ in: CENTER_REGION_CITY_SLUGS });
  });

  it('builds scalar and range filters from query params', async () => {
    await get('?city=holon&propertyType=penthouse&minArea=80&maxArea=120&floor=3&neighborhood=marina');
    const where = whereOf();
    expect(where.city).toBe('holon');
    expect(where.propertyType).toBe('penthouse');
    expect(where.area).toEqual({ gte: 80, lte: 120 });
    expect(where.floor).toBe(3);
    expect(where.neighborhood).toEqual({ contains: 'marina' });
  });

  it('applies boolean feature filters only when "true"', async () => {
    await get('?hasElevator=true&hasPets=false');
    const where = whereOf();
    expect(where.hasElevator).toBe(true);
    expect(where).not.toHaveProperty('hasPets');
  });

  it('passes a numeric take when limit is provided', async () => {
    await get('?limit=5');
    expect(findMany.mock.calls.at(-1)![0].take).toBe(5);
  });

  it('filters by price range using the numeric value parsed from the price string', async () => {
    findMany.mockResolvedValue([
      row({ id: 1, price: '₪3,200,000' }),
      row({ id: 2, price: '₪5,500,000' }),
      row({ id: 3, price: 'no-price' }),
    ]);
    const body = await (await get('?minPrice=3000000&maxPrice=4000000')).json();
    expect(body.map((p: { id: number }) => p.id)).toEqual([1]);
  });

  it('filters by rooms range (rooms stored as string)', async () => {
    findMany.mockResolvedValue([
      row({ id: 1, rooms: '3' }),
      row({ id: 2, rooms: '4.5' }),
      row({ id: 3, rooms: 'studio' }),
    ]);
    const body = await (await get('?minRooms=4&maxRooms=5')).json();
    expect(body.map((p: { id: number }) => p.id)).toEqual([2]);
  });

  it('disables caching for dynamic homepage sections (pinned)', async () => {
    const res = await get('?pinned=true');
    expect(whereOf().isPinned).toBe(true);
    expect(res.headers.get('Cache-Control')).toBe('no-store');
  });

  it('sets a stale-while-revalidate cache header for normal listings', async () => {
    const res = await get();
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=60');
  });

  it('returns 500 when the database query throws', async () => {
    findMany.mockRejectedValue(new Error('db down'));
    const res = await get();
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Failed to fetch properties' });
  });
});
