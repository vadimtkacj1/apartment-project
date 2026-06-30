import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const { requireAdmin, create, findMany } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  create: vi.fn(),
  findMany: vi.fn(),
}));
vi.mock('@/lib/require-admin', () => ({ requireAdmin }));
vi.mock('@/lib/prisma', () => ({ prisma: { property: { create, findMany } } }));

import { GET, POST } from '@/app/api/admin/properties/route';

function createdRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 42,
    title: 'Created',
    images: '["/a.jpg","/b.jpg"]',
    directions: '[]',
    agentIds: '[1,2]',
    isActive: 1,
    isSold: 0,
    isPinned: 0,
    hasElevator: 1,
    ...overrides,
  };
}

const postBody = (body: unknown) =>
  POST(
    new NextRequest('http://localhost/api/admin/properties', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  );

const validNew = { title: 'New', images: ['/a.jpg'], agentIds: [1, 2], rooms: '4', area: 90 };

describe('POST /api/admin/properties', () => {
  beforeEach(() => {
    requireAdmin.mockReset().mockResolvedValue(null); // authorized by default
    create.mockReset().mockResolvedValue(createdRow());
  });

  it('short-circuits with the guard response when not an admin', async () => {
    requireAdmin.mockResolvedValue(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }));
    const res = await postBody(validNew);
    expect(res.status).toBe(401);
    expect(create).not.toHaveBeenCalled();
  });

  it('rejects a property with no agents (400)', async () => {
    const res = await postBody({ ...validNew, agentIds: [] });
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: 'יש לבחור לפחות סוכן אחד' });
    expect(create).not.toHaveBeenCalled();
  });

  it('creates the property and returns 201 with formatted output', async () => {
    const res = await postBody(validNew);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.images).toEqual(['/a.jpg', '/b.jpg']);
    expect(body.agentIds).toEqual([1, 2]);
    expect(body.isActive).toBe(true);
    expect(body.hasElevator).toBe(true);

    // Arrays are persisted as JSON strings.
    const data = create.mock.calls[0][0].data;
    expect(data.title).toBe('New');
    expect(data.images).toBe('["/a.jpg"]');
    expect(data.agentIds).toBe('[1,2]');
  });

  it('returns 500 when the create query throws', async () => {
    create.mockRejectedValue(new Error('constraint failed'));
    const res = await postBody(validNew);
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: 'Failed to create property' });
  });
});

describe('GET /api/admin/properties', () => {
  beforeEach(() => {
    findMany.mockReset().mockResolvedValue([createdRow()]);
  });

  it('returns the formatted property list', async () => {
    const res = await GET(new NextRequest('http://localhost/api/admin/properties'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body[0].images).toEqual(['/a.jpg', '/b.jpg']);
    expect(body[0].agentIds).toEqual([1, 2]);
    expect(findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
  });

  it('returns 500 when the query throws', async () => {
    findMany.mockRejectedValue(new Error('db down'));
    const res = await GET(new NextRequest('http://localhost/api/admin/properties'));
    expect(res.status).toBe(500);
  });
});
