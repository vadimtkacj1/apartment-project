import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const { requireAdmin, property } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  property: { findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));
vi.mock('@/lib/require-admin', () => ({ requireAdmin }));
vi.mock('@/lib/prisma', () => ({ prisma: { property } }));

import { revalidatePath } from 'next/cache';

import { GET, PUT, PATCH, DELETE } from '@/app/api/admin/properties/[id]/route';

const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const bodyReq = (body: unknown, method = 'PUT') =>
  new NextRequest('http://localhost/api/admin/properties/5', {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const plainReq = () => new NextRequest('http://localhost/api/admin/properties/5');
const denied = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

const row = (o: Record<string, unknown> = {}) => ({
  id: 5,
  images: '["/a.jpg"]',
  directions: '[]',
  agentIds: '["owner-1"]',
  isActive: 1,
  isSold: 0,
  isHotProposition: 1,
  isNoCommission: 1,
  ...o,
});

const validPut = {
  title: 'T', description: 'D', price: '₪1', location: 'L', city: 'holon',
  propertyType: 'apartment', parking: 'none', furniture: 'none', rooms: '3', area: 80,
  agentIds: [1],
};

beforeEach(() => {
  vi.mocked(revalidatePath).mockClear();
  requireAdmin.mockReset().mockResolvedValue(null);
  property.findUnique.mockReset();
  property.update.mockReset();
  property.delete.mockReset();
});

describe('GET /api/admin/properties/[id]', () => {
  it('returns the formatted property', async () => {
    property.findUnique.mockResolvedValue(row());
    const res = await GET(plainReq(), ctx('5'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.images).toEqual(['/a.jpg']);
    expect(body.agentIds).toEqual(['owner-1']);
    expect(body.isActive).toBe(true);
  });

  it('404s when not found', async () => {
    property.findUnique.mockResolvedValue(null);
    expect((await GET(plainReq(), ctx('5'))).status).toBe(404);
  });
});

describe('PUT /api/admin/properties/[id]', () => {
  it('blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await PUT(bodyReq(validPut), ctx('5'))).status).toBe(401);
    expect(property.update).not.toHaveBeenCalled();
  });

  it('rejects an explicit empty agentIds array (400)', async () => {
    const res = await PUT(bodyReq({ ...validPut, agentIds: [] }), ctx('5'));
    expect(res.status).toBe(400);
    expect(property.update).not.toHaveBeenCalled();
  });

  it('updates and clears homepage flags when marking as sold', async () => {
    property.update.mockResolvedValue(row({ isSold: 1, isHotProposition: 0, isNoCommission: 0 }));
    const res = await PUT(bodyReq({ ...validPut, isSold: true, isHotProposition: true }), ctx('5'));
    expect(res.status).toBe(200);
    const data = property.update.mock.calls[0][0].data;
    expect(data.isSold).toBe(true);
    expect(data.isHotProposition).toBe(false); // forced off because sold
    expect(data.isNoCommission).toBe(false);
  });

  it('serializes images/directions to JSON strings', async () => {
    property.update.mockResolvedValue(row());
    await PUT(bodyReq({ ...validPut, images: ['/a.jpg', '/b.jpg'], directions: ['north'] }), ctx('5'));
    const data = property.update.mock.calls[0][0].data;
    expect(data.images).toBe('["/a.jpg","/b.jpg"]');
    expect(data.directions).toBe('["north"]');
  });
});

describe('PATCH /api/admin/properties/[id]', () => {
  it('blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await PATCH(bodyReq({ isPinned: true }, 'PATCH'), ctx('5'))).status).toBe(401);
  });

  it('rejects an empty/invalid patch with 400', async () => {
    const res = await PATCH(bodyReq({ title: 'ignored' }, 'PATCH'), ctx('5'));
    expect(res.status).toBe(400);
    expect(property.update).not.toHaveBeenCalled();
  });

  it('toggles isPinned', async () => {
    property.update.mockResolvedValue(row({ isPinned: 1 }));
    await PATCH(bodyReq({ isPinned: true }, 'PATCH'), ctx('5'));
    expect(property.update.mock.calls[0][0].data).toEqual({ isPinned: true });
  });

  it('clears homepage flags when patching isSold=true', async () => {
    property.update.mockResolvedValue(row({ isSold: 1 }));
    await PATCH(bodyReq({ isSold: true }, 'PATCH'), ctx('5'));
    expect(property.update.mock.calls[0][0].data).toMatchObject({
      isSold: true,
      isHotProposition: false,
      isNoCommission: false,
    });
  });
});

describe('DELETE /api/admin/properties/[id]', () => {
  it('blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await DELETE(plainReq(), ctx('5'))).status).toBe(401);
  });

  it('deletes the property by id', async () => {
    property.delete.mockResolvedValue(row());
    const res = await DELETE(plainReq(), ctx('5'));
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(property.delete).toHaveBeenCalledWith({ where: { id: 5 } });
  });

  it('returns 500 on delete error', async () => {
    property.delete.mockRejectedValue(new Error('fk constraint'));
    expect((await DELETE(plainReq(), ctx('5'))).status).toBe(500);
  });
});

describe('cache invalidation', () => {
  const revalidated = () => vi.mocked(revalidatePath).mock.calls.map(([path]) => path);

  it('drops the cached public pages after an update', async () => {
    property.update.mockResolvedValue(row());
    await PUT(bodyReq(validPut), ctx('5'));
    expect(revalidated()).toEqual(
      expect.arrayContaining(['/', '/apartments', '/apartments/5', '/sitemap.xml'])
    );
  });

  it('drops them after a status toggle', async () => {
    property.update.mockResolvedValue(row());
    await PATCH(bodyReq({ isSold: true }, 'PATCH'), ctx('5'));
    expect(revalidated()).toContain('/apartments/5');
  });

  it('drops them after a delete', async () => {
    property.delete.mockResolvedValue(row());
    await DELETE(plainReq(), ctx('5'));
    expect(revalidated()).toContain('/apartments/5');
  });

  it('still saves when revalidation blows up', async () => {
    vi.mocked(revalidatePath).mockImplementationOnce(() => {
      throw new Error('no request scope');
    });
    property.update.mockResolvedValue(row());
    const res = await PUT(bodyReq(validPut), ctx('5'));
    expect(res.status).toBe(200);
  });
});
