import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const { requireAdmin, prismaMock } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  prismaMock: {
    homepageSettings: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
}));
vi.mock('@/lib/require-admin', () => ({ requireAdmin }));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET, PUT } from '@/app/api/admin/listing-settings/route';

const put = (body: unknown) =>
  PUT(
    new NextRequest('http://localhost/api/admin/listing-settings', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  );

const denied = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

beforeEach(() => {
  requireAdmin.mockReset().mockResolvedValue(null); // authorized by default
  Object.values(prismaMock.homepageSettings).forEach((fn) => fn.mockReset());
});

describe('GET /api/admin/listing-settings', () => {
  it('returns the stored order', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue({ propertyListingOrder: 'price-desc' });
    const res = await GET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ propertyListingOrder: 'price-desc' });
  });

  it('falls back to newest when no settings row exists', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue(null);
    await expect((await GET()).json()).resolves.toEqual({ propertyListingOrder: 'newest' });
  });

  it('falls back to newest when the stored value is junk', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue({ propertyListingOrder: 'bogus' });
    await expect((await GET()).json()).resolves.toEqual({ propertyListingOrder: 'newest' });
  });

  it('blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await GET()).status).toBe(401);
    expect(prismaMock.homepageSettings.findFirst).not.toHaveBeenCalled();
  });

  it('is never cached', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue({ propertyListingOrder: 'random' });
    expect((await GET()).headers.get('Cache-Control')).toContain('no-store');
  });
});

describe('PUT /api/admin/listing-settings', () => {
  it('updates the existing singleton row', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue({ id: 3 });
    prismaMock.homepageSettings.update.mockResolvedValue({ propertyListingOrder: 'random' });

    const res = await put({ propertyListingOrder: 'random' });
    expect(res.status).toBe(200);
    expect(prismaMock.homepageSettings.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 3 },
        data: { propertyListingOrder: 'random' },
      })
    );
    await expect(res.json()).resolves.toMatchObject({ success: true, propertyListingOrder: 'random' });
  });

  it('creates the singleton row when the CMS has never been saved', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue(null);
    prismaMock.homepageSettings.create.mockResolvedValue({ propertyListingOrder: 'price-asc' });

    expect((await put({ propertyListingOrder: 'price-asc' })).status).toBe(200);
    expect(prismaMock.homepageSettings.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { propertyListingOrder: 'price-asc' } })
    );
    expect(prismaMock.homepageSettings.update).not.toHaveBeenCalled();
  });

  it('rejects an unknown order without writing', async () => {
    const res = await put({ propertyListingOrder: 'cheapest' });
    expect(res.status).toBe(400);
    expect(prismaMock.homepageSettings.update).not.toHaveBeenCalled();
    expect(prismaMock.homepageSettings.create).not.toHaveBeenCalled();
  });

  it('rejects a missing order without writing', async () => {
    expect((await put({})).status).toBe(400);
    expect(prismaMock.homepageSettings.create).not.toHaveBeenCalled();
  });

  it('blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await put({ propertyListingOrder: 'random' })).status).toBe(401);
    expect(prismaMock.homepageSettings.update).not.toHaveBeenCalled();
  });
});
