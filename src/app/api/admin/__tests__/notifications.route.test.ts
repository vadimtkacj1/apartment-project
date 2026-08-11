import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const { requireAdmin, prismaMock } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  prismaMock: {
    notification: { findMany: vi.fn(), create: vi.fn(), createMany: vi.fn(), updateMany: vi.fn() },
    property: { findUnique: vi.fn(), update: vi.fn() },
    teamMember: { findUnique: vi.fn() },
    owner: { findUnique: vi.fn() },
  },
}));
vi.mock('@/lib/require-admin', () => ({ requireAdmin }));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET as notificationsGet, PATCH as notificationsPatch } from '@/app/api/admin/notifications/route';
import { PATCH as propertyPatch } from '@/app/api/admin/properties/[id]/route';
import { recordPropertySold, parseAgentIds } from '@/lib/notifications';

const plainReq = (url = 'http://localhost/api/admin/notifications') => new NextRequest(url);
const bodyReq = (body: unknown, method = 'PATCH') =>
  new NextRequest('http://localhost/api/admin/x', {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const denied = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
const params = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  requireAdmin.mockReset().mockResolvedValue(null);
  Object.values(prismaMock).forEach((model) =>
    Object.values(model).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset())
  );
});

describe('agent id parsing', () => {
  it('keeps prefixed ids and upgrades legacy numeric ones', () => {
    expect(parseAgentIds('["team-2","owner-1"]')).toEqual(['team-2', 'owner-1']);
    expect(parseAgentIds('[3]')).toEqual(['team-3']);
  });

  it('survives empty, malformed and non-array values', () => {
    expect(parseAgentIds(null)).toEqual([]);
    expect(parseAgentIds('not json')).toEqual([]);
    expect(parseAgentIds('{"a":1}')).toEqual([]);
  });
});

describe('recordPropertySold', () => {
  it('writes one notification per assigned agent, with names snapshotted', async () => {
    prismaMock.teamMember.findUnique.mockResolvedValue({ name: 'דניאל כהן' });
    prismaMock.owner.findUnique.mockResolvedValue({ name: 'Yoav' });

    await recordPropertySold({ id: 7, title: 'גאולים 52', agentIds: '["team-2","owner-1"]' });

    expect(prismaMock.notification.createMany).toHaveBeenCalledWith({
      data: [
        { type: 'property_sold', agentId: 'team-2', agentName: 'דניאל כהן', propertyId: 7, propertyTitle: 'גאולים 52' },
        { type: 'property_sold', agentId: 'owner-1', agentName: 'Yoav', propertyId: 7, propertyTitle: 'גאולים 52' },
      ],
    });
  });

  it('still records the sale when no agent is assigned', async () => {
    await recordPropertySold({ id: 9, title: 'הנוטרים 10', agentIds: '[]' });

    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: { type: 'property_sold', propertyId: 9, propertyTitle: 'הנוטרים 10' },
    });
  });

  it('never throws when the feed cannot be written', async () => {
    prismaMock.notification.create.mockRejectedValue(new Error('no such table'));
    await expect(recordPropertySold({ id: 1, title: 'x', agentIds: '[]' })).resolves.toBeUndefined();
  });
});

describe('marking a property sold', () => {
  const sold = { id: 5, title: 'רבינוביץ 55', agentIds: '["team-2"]' };

  it('stamps soldAt and notifies on the first false → true flip', async () => {
    prismaMock.property.findUnique.mockResolvedValue({ isSold: false });
    prismaMock.property.update.mockResolvedValue(sold);
    prismaMock.teamMember.findUnique.mockResolvedValue({ name: 'ליאור' });

    const res = await propertyPatch(bodyReq({ isSold: true }), params('5'));
    expect(res.status).toBe(200);

    const data = prismaMock.property.update.mock.calls[0][0].data;
    expect(data.isSold).toBe(true);
    expect(data.soldAt).toBeInstanceOf(Date);
    // Selling also clears the homepage flags
    expect(data.isHotProposition).toBe(false);
    expect(prismaMock.notification.createMany).toHaveBeenCalledTimes(1);
  });

  it('does not notify again when an already-sold property is saved', async () => {
    prismaMock.property.findUnique.mockResolvedValue({ isSold: true });
    prismaMock.property.update.mockResolvedValue(sold);

    await propertyPatch(bodyReq({ isSold: true }), params('5'));

    expect(prismaMock.property.update.mock.calls[0][0].data.soldAt).toBeUndefined();
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
    expect(prismaMock.notification.create).not.toHaveBeenCalled();
  });

  it('clears soldAt and stays silent when a sale is undone', async () => {
    prismaMock.property.findUnique.mockResolvedValue({ isSold: true });
    prismaMock.property.update.mockResolvedValue({ ...sold, isSold: false });

    await propertyPatch(bodyReq({ isSold: false }), params('5'));

    expect(prismaMock.property.update.mock.calls[0][0].data.soldAt).toBeNull();
    expect(prismaMock.notification.createMany).not.toHaveBeenCalled();
  });
});

describe('admin notifications endpoint', () => {
  it('GET returns the newest first and caps the limit', async () => {
    prismaMock.notification.findMany.mockResolvedValue([{ id: 1 }]);

    const res = await notificationsGet(plainReq('http://localhost/api/admin/notifications?limit=500&type=property_sold'));
    await expect(res.json()).resolves.toEqual([{ id: 1 }]);

    expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
      where: { type: 'property_sold' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  });

  it('GET degrades to an empty feed when the table is missing', async () => {
    prismaMock.notification.findMany.mockRejectedValue(new Error('relation does not exist'));
    await expect((await notificationsGet(plainReq())).json()).resolves.toEqual([]);
  });

  it('GET and PATCH block non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await notificationsGet(plainReq())).status).toBe(401);
    expect((await notificationsPatch(bodyReq({ all: true }))).status).toBe(401);
    expect(prismaMock.notification.findMany).not.toHaveBeenCalled();
  });

  it('PATCH marks everything unread as read', async () => {
    prismaMock.notification.updateMany.mockResolvedValue({ count: 3 });

    const res = await notificationsPatch(bodyReq({ all: true }));
    await expect(res.json()).resolves.toMatchObject({ updated: 3 });
    expect(prismaMock.notification.updateMany.mock.calls[0][0].where).toMatchObject({ readAt: null });
  });

  it('PATCH rejects a request with neither ids nor all', async () => {
    expect((await notificationsPatch(bodyReq({}))).status).toBe(400);
    expect(prismaMock.notification.updateMany).not.toHaveBeenCalled();
  });
});
