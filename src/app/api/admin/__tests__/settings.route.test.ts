import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

const { requireAdmin, prismaMock, fsMock } = vi.hoisted(() => ({
  requireAdmin: vi.fn(),
  prismaMock: {
    contactInfo: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
    clickEvent: { deleteMany: vi.fn() },
    propertyView: { deleteMany: vi.fn() },
    homepageSettings: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
  fsMock: { access: vi.fn(), mkdir: vi.fn(), readFile: vi.fn(), writeFile: vi.fn() },
}));
vi.mock('@/lib/require-admin', () => ({ requireAdmin }));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));
vi.mock('fs/promises', () => ({ default: fsMock, ...fsMock }));

import { GET as contactGet, POST as contactPost } from '@/app/api/admin/contact-info/route';
import { DELETE as analyticsDelete } from '@/app/api/analytics/delete/route';
import { GET as titlesGet, PUT as titlesPut } from '@/app/api/admin/homepage-titles/route';
import { GET as settingsGet, PUT as settingsPut } from '@/app/api/admin/homepage-settings/route';

const bodyReq = (body: unknown, method = 'POST') =>
  new NextRequest('http://localhost/api/admin/x', {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
const plainReq = () => new NextRequest('http://localhost/api/admin/x');
const denied = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

beforeEach(() => {
  requireAdmin.mockReset().mockResolvedValue(null);
  Object.values(prismaMock).forEach((m) =>
    Object.values(m).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset())
  );
  Object.values(fsMock).forEach((fn) => fn.mockReset().mockResolvedValue(undefined));
});

describe('admin contact-info', () => {
  it('GET returns the record, or null when none exists', async () => {
    prismaMock.contactInfo.findFirst.mockResolvedValueOnce({ id: 1, phone: '03-1' });
    await expect((await contactGet(plainReq())).json()).resolves.toMatchObject({ phone: '03-1' });
    prismaMock.contactInfo.findFirst.mockResolvedValueOnce(null);
    await expect((await contactGet(plainReq())).json()).resolves.toBeNull();
  });

  it('GET blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await contactGet(plainReq())).status).toBe(401);
    expect(prismaMock.contactInfo.findFirst).not.toHaveBeenCalled();
  });

  it('POST blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await contactPost(bodyReq({ phone: '1' }))).status).toBe(401);
  });

  it('POST creates a record when none exists', async () => {
    prismaMock.contactInfo.findFirst.mockResolvedValue(null);
    prismaMock.contactInfo.create.mockResolvedValue({ id: 1 });
    const res = await contactPost(bodyReq({ phone: '03-1', email: 'a@b.c', address: 'St', city: 'Holon' }));
    expect(res.status).toBe(200);
    expect(prismaMock.contactInfo.create).toHaveBeenCalled();
    expect(prismaMock.contactInfo.update).not.toHaveBeenCalled();
  });

  it('POST updates the existing record', async () => {
    prismaMock.contactInfo.findFirst.mockResolvedValue({ id: 7 });
    prismaMock.contactInfo.update.mockResolvedValue({ id: 7 });
    await contactPost(bodyReq({ phone: '03-2' }));
    expect(prismaMock.contactInfo.update.mock.calls[0][0].where).toEqual({ id: 7 });
  });
});

describe('analytics delete', () => {
  it('blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await analyticsDelete(bodyReq({ type: 'all' }, 'DELETE'))).status).toBe(401);
  });

  it('type=all wipes both clicks and views', async () => {
    await analyticsDelete(bodyReq({ type: 'all' }, 'DELETE'));
    expect(prismaMock.clickEvent.deleteMany).toHaveBeenCalled();
    expect(prismaMock.propertyView.deleteMany).toHaveBeenCalled();
  });

  it('type=views wipes only views', async () => {
    await analyticsDelete(bodyReq({ type: 'views' }, 'DELETE'));
    expect(prismaMock.propertyView.deleteMany).toHaveBeenCalled();
    expect(prismaMock.clickEvent.deleteMany).not.toHaveBeenCalled();
  });

  it('type=clicks wipes only clicks', async () => {
    await analyticsDelete(bodyReq({ type: 'clicks' }, 'DELETE'));
    expect(prismaMock.clickEvent.deleteMany).toHaveBeenCalled();
    expect(prismaMock.propertyView.deleteMany).not.toHaveBeenCalled();
  });

  it('rejects an unknown type with 400', async () => {
    const res = await analyticsDelete(bodyReq({ type: 'bogus' }, 'DELETE'));
    expect(res.status).toBe(400);
  });
});

describe('admin homepage-titles', () => {
  it('GET blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await titlesGet(plainReq())).status).toBe(401);
  });

  it('GET returns existing settings (no-store)', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue({ id: 1, aboutSectionTitle: 'A' });
    const res = await titlesGet(plainReq());
    expect(res.headers.get('Cache-Control')).toContain('no-store');
    expect(prismaMock.homepageSettings.create).not.toHaveBeenCalled();
  });

  it('GET creates defaults when none exist', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue(null);
    prismaMock.homepageSettings.create.mockResolvedValue({ id: 1 });
    await titlesGet(plainReq());
    expect(prismaMock.homepageSettings.create).toHaveBeenCalled();
  });

  it('PUT updates existing settings', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue({ id: 2, aboutSectionTitle: 'old' });
    prismaMock.homepageSettings.update.mockResolvedValue({ id: 2, aboutSectionTitle: 'new' });
    const res = await titlesPut(bodyReq({ aboutSectionTitle: 'new' }, 'PUT'));
    await expect(res.json()).resolves.toMatchObject({ success: true });
    expect(prismaMock.homepageSettings.update.mock.calls[0][0].where).toEqual({ id: 2 });
  });

  it('PUT creates settings when none exist', async () => {
    prismaMock.homepageSettings.findFirst.mockResolvedValue(null);
    prismaMock.homepageSettings.create.mockResolvedValue({ id: 1 });
    await titlesPut(bodyReq({ aboutSectionTitle: 'x' }, 'PUT'));
    expect(prismaMock.homepageSettings.create).toHaveBeenCalled();
  });
});

describe('admin homepage-settings (file-backed)', () => {
  it('GET blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await settingsGet()).status).toBe(401);
    expect(fsMock.readFile).not.toHaveBeenCalled();
  });

  it('GET returns parsed settings from disk', async () => {
    fsMock.readFile.mockResolvedValue(JSON.stringify({ hotPropositionsMode: 'price', hotPropositionsMaxPrice: 2_000_000 }));
    const res = await settingsGet();
    await expect(res.json()).resolves.toEqual({ hotPropositionsMode: 'price', hotPropositionsMaxPrice: 2_000_000 });
  });

  it('GET falls back to defaults when the file is unreadable', async () => {
    fsMock.readFile.mockRejectedValue(new Error('ENOENT'));
    const res = await settingsGet();
    await expect(res.json()).resolves.toEqual({ hotPropositionsMode: 'manual', hotPropositionsMaxPrice: undefined });
  });

  it('PUT blocks non-admins', async () => {
    requireAdmin.mockResolvedValue(denied);
    expect((await settingsPut(bodyReq({ hotPropositionsMode: 'price' }, 'PUT'))).status).toBe(401);
    expect(fsMock.writeFile).not.toHaveBeenCalled();
  });

  it('PUT persists settings to disk and echoes them back', async () => {
    const res = await settingsPut(bodyReq({ hotPropositionsMode: 'price', hotPropositionsMaxPrice: 1500000 }, 'PUT'));
    expect(fsMock.writeFile).toHaveBeenCalled();
    await expect(res.json()).resolves.toMatchObject({
      success: true,
      settings: { hotPropositionsMode: 'price', hotPropositionsMaxPrice: 1500000 },
    });
  });
});
