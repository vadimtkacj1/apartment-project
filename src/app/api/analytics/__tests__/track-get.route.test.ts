import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const { requireAdmin, prismaMock } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  prismaMock: {
    propertyView: { count: vi.fn(), groupBy: vi.fn(), findMany: vi.fn() },
    clickEvent: { count: vi.fn(), groupBy: vi.fn(), findFirst: vi.fn(), findMany: vi.fn() },
    property: { findUnique: vi.fn() },
  },
}));
vi.mock('@/lib/require-admin', () => ({ requireAdmin }));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET } from '@/app/api/analytics/track/route';

const get = (qs = '') => GET(new NextRequest(`http://localhost/api/analytics/track${qs}`));
const denied = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

beforeEach(() => {
  requireAdmin.mockReset().mockResolvedValue(null);
  prismaMock.propertyView.count.mockResolvedValue(5);
  prismaMock.clickEvent.count.mockResolvedValue(3);
  prismaMock.propertyView.groupBy.mockResolvedValue([{ propertyId: 1, ipAddress: '1.1.1.1', _count: { id: 2 } }]);
  prismaMock.clickEvent.groupBy.mockResolvedValue([
    { propertyId: 1, eventType: 'click_phone', ipAddress: '1.1.1.1', _count: { id: 4 } },
  ]);
  prismaMock.property.findUnique.mockResolvedValue({ id: 1, title: 'Flat', location: 'L' });
  prismaMock.clickEvent.findFirst.mockResolvedValue({ userAgent: 'UA' });
  prismaMock.propertyView.findMany.mockResolvedValue([{ id: 1 }]);
  prismaMock.clickEvent.findMany.mockResolvedValue([{ id: 2 }]);
});

describe('GET /api/analytics/track (admin)', () => {
  it('requires an admin session', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await get('?type=summary')).status).toBe(401);
  });

  it('returns 400 for an unrecognised type', async () => {
    const res = await get('');
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'Invalid type parameter' });
  });

  it('aggregates a summary across views and clicks', async () => {
    const res = await get('?type=summary');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalViews).toBe(5);
    expect(body.totalClicks).toBe(3);
    expect(body.uniqueVisitors).toBe(1);
    expect(body.topProperties).toEqual([{ propertyId: 1, views: 2 }]);
    expect(body.clickTypes).toEqual([{ eventType: 'click_phone', count: 4 }]);
    expect(body.topPropertiesByClicks[0]).toMatchObject({ propertyId: 1, clicks: 4 });
    expect(body.topUsersByClicks[0]).toMatchObject({ ipAddress: '1.1.1.1', clicks: 4, userAgent: 'UA' });
  });

  it('returns a raw views list for type=views', async () => {
    const res = await get('?type=views&propertyId=1');
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual([{ id: 1 }]);
    expect(prismaMock.propertyView.findMany.mock.calls[0][0].where).toMatchObject({ propertyId: 1 });
  });

  it('returns a raw clicks list for type=clicks', async () => {
    const res = await get('?type=clicks');
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual([{ id: 2 }]);
  });
});
