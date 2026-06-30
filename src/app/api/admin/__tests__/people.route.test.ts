import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const { requireAdmin, prismaMock } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  prismaMock: {
    owner: { findMany: vi.fn(), create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
    teamMember: { findMany: vi.fn(), create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}));
vi.mock('@/lib/require-admin', () => ({ requireAdmin }));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

import { GET as ownerList, POST as ownerCreate } from '@/app/api/admin/owners/route';
import { GET as ownerGet, PUT as ownerPut, DELETE as ownerDelete } from '@/app/api/admin/owners/[id]/route';
import { GET as teamList, POST as teamCreate } from '@/app/api/admin/team/route';
import { GET as teamGet, PUT as teamPut, DELETE as teamDelete } from '@/app/api/admin/team/[id]/route';

const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
const jsonReq = (body: unknown) =>
  new NextRequest('http://localhost/api/admin/x', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const plainReq = () => new NextRequest('http://localhost/api/admin/x');
const denied = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

beforeEach(() => {
  requireAdmin.mockReset().mockResolvedValue(null); // authorized by default
  Object.values(prismaMock).forEach((m) =>
    Object.values(m).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset())
  );
});

describe('admin owners', () => {
  it('GET lists all owners (incl. inactive)', async () => {
    prismaMock.owner.findMany.mockResolvedValue([{ id: 1 }]);
    const res = await ownerList(plainReq());
    expect(res.status).toBe(200);
    expect(prismaMock.owner.findMany).toHaveBeenCalledWith({ orderBy: { order: 'asc' } });
  });

  it('POST blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    const res = await ownerCreate(jsonReq({ name: 'X' }));
    expect(res.status).toBe(401);
    expect(prismaMock.owner.create).not.toHaveBeenCalled();
  });

  it('POST creates an owner (201) with null-coalesced optional fields', async () => {
    prismaMock.owner.create.mockResolvedValue({ id: 9, name: 'Ram' });
    const res = await ownerCreate(jsonReq({ name: 'Ram', title: 'Founder' }));
    expect(res.status).toBe(201);
    const data = prismaMock.owner.create.mock.calls[0][0].data;
    expect(data.name).toBe('Ram');
    expect(data.phone).toBeNull();
    expect(data.order).toBe(0);
    expect(data.isActive).toBe(true);
  });

  it('POST returns 500 on create error', async () => {
    prismaMock.owner.create.mockRejectedValue(new Error('x'));
    expect((await ownerCreate(jsonReq({ name: 'Ram' }))).status).toBe(500);
  });

  it('GET [id] returns the owner or 404', async () => {
    prismaMock.owner.findUnique.mockResolvedValueOnce({ id: 3, name: 'Ram' });
    expect((await ownerGet(plainReq(), ctx('3'))).status).toBe(200);
    prismaMock.owner.findUnique.mockResolvedValueOnce(null);
    expect((await ownerGet(plainReq(), ctx('404'))).status).toBe(404);
  });

  it('PUT updates an owner by numeric id', async () => {
    prismaMock.owner.update.mockResolvedValue({ id: 3, name: 'Updated' });
    const res = await ownerPut(jsonReq({ name: 'Updated', title: 'T' }), ctx('3'));
    expect(res.status).toBe(200);
    expect(prismaMock.owner.update.mock.calls[0][0].where).toEqual({ id: 3 });
  });

  it('PUT blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await ownerPut(jsonReq({ name: 'X' }), ctx('3'))).status).toBe(401);
    expect(prismaMock.owner.update).not.toHaveBeenCalled();
  });

  it('DELETE removes an owner and reports success', async () => {
    prismaMock.owner.delete.mockResolvedValue({ id: 3 });
    const res = await ownerDelete(plainReq(), ctx('3'));
    await expect(res.json()).resolves.toEqual({ success: true });
    expect(prismaMock.owner.delete).toHaveBeenCalledWith({ where: { id: 3 } });
  });

  it('DELETE blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await ownerDelete(plainReq(), ctx('3'))).status).toBe(401);
  });
});

describe('admin team members', () => {
  it('GET lists all team members', async () => {
    prismaMock.teamMember.findMany.mockResolvedValue([{ id: 1 }]);
    expect((await teamList(plainReq())).status).toBe(200);
  });

  it('POST creates a team member (201)', async () => {
    prismaMock.teamMember.create.mockResolvedValue({ id: 4, name: 'Agent' });
    const res = await teamCreate(jsonReq({ name: 'Agent', role: 'Broker' }));
    expect(res.status).toBe(201);
    expect(prismaMock.teamMember.create.mock.calls[0][0].data.name).toBe('Agent');
  });

  it('POST blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await teamCreate(jsonReq({ name: 'A' }))).status).toBe(401);
  });

  it('GET [id] 404s for a missing member', async () => {
    prismaMock.teamMember.findUnique.mockResolvedValue(null);
    expect((await teamGet(plainReq(), ctx('77'))).status).toBe(404);
  });

  it('PUT updates and DELETE removes a team member', async () => {
    prismaMock.teamMember.update.mockResolvedValue({ id: 4 });
    expect((await teamPut(jsonReq({ name: 'New', role: 'r' }), ctx('4'))).status).toBe(200);

    prismaMock.teamMember.delete.mockResolvedValue({ id: 4 });
    const del = await teamDelete(plainReq(), ctx('4'));
    await expect(del.json()).resolves.toEqual({ success: true });
  });
});
