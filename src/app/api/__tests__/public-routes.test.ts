import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const { prismaMock, getFullProperty } = vi.hoisted(() => ({
  prismaMock: {
    owner: { findMany: vi.fn() },
    teamMember: { findMany: vi.fn() },
    contactInfo: { findFirst: vi.fn() },
    homepageSettings: { findFirst: vi.fn(), create: vi.fn() },
    property: { findUnique: vi.fn(), findFirst: vi.fn() },
  },
  getFullProperty: vi.fn(),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));
vi.mock('@/lib/property-detail', () => ({ getFullProperty }));

import { GET as ownersGET } from '@/app/api/owners/route';
import { GET as teamGET } from '@/app/api/team/route';
import { GET as contactGET } from '@/app/api/contact-info/route';
import { GET as titlesGET } from '@/app/api/homepage-titles/route';
import { GET as propertyGET } from '@/app/api/properties/[id]/route';
import { GET as neighborsGET } from '@/app/api/properties/[id]/neighbors/route';

const req = (url = 'http://localhost/api/x') => new NextRequest(url);
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  Object.values(prismaMock).forEach((model) =>
    Object.values(model).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset())
  );
  getFullProperty.mockReset();
});

describe('GET /api/owners (public)', () => {
  it('returns only active owners', async () => {
    prismaMock.owner.findMany.mockResolvedValue([{ id: 1, name: 'Ram' }]);
    const res = await ownersGET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual([{ id: 1, name: 'Ram' }]);
    expect(prismaMock.owner.findMany.mock.calls[0][0].where).toEqual({ isActive: true });
  });

  it('returns 500 on DB error', async () => {
    prismaMock.owner.findMany.mockRejectedValue(new Error('x'));
    expect((await ownersGET()).status).toBe(500);
  });
});

describe('GET /api/team (public)', () => {
  it('returns active team members ordered', async () => {
    prismaMock.teamMember.findMany.mockResolvedValue([{ id: 2, name: 'Agent' }]);
    const res = await teamGET();
    expect(res.status).toBe(200);
    expect(prismaMock.teamMember.findMany.mock.calls[0][0]).toEqual({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  });

  it('returns 500 on DB error', async () => {
    prismaMock.teamMember.findMany.mockRejectedValue(new Error('x'));
    expect((await teamGET()).status).toBe(500);
  });
});

describe('GET /api/contact-info (public)', () => {
  it('returns the contact info record', async () => {
    prismaMock.contactInfo.findFirst.mockResolvedValue({ phone: '03-1', email: 'a@b.c' });
    const res = await contactGET(req());
    await expect(res.json()).resolves.toMatchObject({ phone: '03-1' });
  });

  it('returns null (200) when no record exists', async () => {
    prismaMock.contactInfo.findFirst.mockResolvedValue(null);
    const res = await contactGET(req());
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toBeNull();
  });

  it('returns 500 on DB error', async () => {
    prismaMock.contactInfo.findFirst.mockRejectedValue(new Error('x'));
    expect((await contactGET(req())).status).toBe(500);
  });
});

describe('GET /api/homepage-titles (public)', () => {
  it('returns stored settings with a no-store cache header', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue({ id: 1, aboutSectionTitle: 'About' });
    const res = await titlesGET();
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('no-store');
    await expect(res.json()).resolves.toMatchObject({ aboutSectionTitle: 'About' });
  });

  it('creates default settings when none exist', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue(null);
    prismaMock.homepageSettings.create.mockResolvedValue({ id: 1, hotPropositionsTitle: 'הצעות חמות' });
    const res = await titlesGET();
    expect(prismaMock.homepageSettings.create).toHaveBeenCalled();
    await expect(res.json()).resolves.toMatchObject({ hotPropositionsTitle: 'הצעות חמות' });
  });

  it('falls back to defaults (200) on error', async () => {
    prismaMock.homepageSettings.findFirst.mockRejectedValue(new Error('x'));
    const res = await titlesGET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toHaveProperty('hotPropositionsTitle');
  });
});

describe('GET /api/properties/[id] (public)', () => {
  it('returns the full property with a cache header', async () => {
    getFullProperty.mockResolvedValue({ id: 5, title: 'Flat' });
    const res = await propertyGET(req(), ctx('5'));
    expect(res.status).toBe(200);
    expect(getFullProperty).toHaveBeenCalledWith(5);
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=300');
  });

  it('returns 404 when the property is missing', async () => {
    getFullProperty.mockResolvedValue(null);
    const res = await propertyGET(req(), ctx('999'));
    expect(res.status).toBe(404);
  });

  it('returns 500 when the lookup throws', async () => {
    getFullProperty.mockRejectedValue(new Error('x'));
    expect((await propertyGET(req(), ctx('5'))).status).toBe(500);
  });
});

describe('GET /api/properties/[id]/neighbors', () => {
  it('returns previous (newer) and next (older) ids', async () => {
    prismaMock.property.findUnique.mockResolvedValue({ id: 5, createdAt: new Date('2026-01-02') });
    prismaMock.property.findFirst
      .mockResolvedValueOnce({ id: 6 }) // previous (newer)
      .mockResolvedValueOnce({ id: 4 }); // next (older)
    const res = await neighborsGET(req(), ctx('5'));
    await expect(res.json()).resolves.toEqual({ previousId: 6, nextId: 4 });
  });

  it('returns nulls when the current property is not found', async () => {
    prismaMock.property.findUnique.mockResolvedValue(null);
    const res = await neighborsGET(req(), ctx('5'));
    await expect(res.json()).resolves.toEqual({ previousId: null, nextId: null });
  });

  it('returns nulls (graceful) on DB error', async () => {
    prismaMock.property.findUnique.mockRejectedValue(new Error('x'));
    const res = await neighborsGET(req(), ctx('5'));
    await expect(res.json()).resolves.toEqual({ previousId: null, nextId: null });
  });
});
