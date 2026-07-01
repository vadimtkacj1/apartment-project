import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const { pvCreate, ceCreate } = vi.hoisted(() => ({ pvCreate: vi.fn(), ceCreate: vi.fn() }));
vi.mock('@/lib/prisma', () => ({
  prisma: { propertyView: { create: pvCreate }, clickEvent: { create: ceCreate } },
}));

import { POST } from '@/app/api/analytics/track/route';

let ipSeed = 0;
const post = (body: unknown, ip = `203.0.113.${ipSeed++}`) =>
  POST(
    new NextRequest('http://localhost/api/analytics/track', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip, 'user-agent': 'jest' },
      body: JSON.stringify(body),
    })
  );

describe('POST /api/analytics/track', () => {
  beforeEach(() => {
    pvCreate.mockReset().mockResolvedValue({});
    ceCreate.mockReset().mockResolvedValue({});
  });

  it('returns 400 when eventType is missing', async () => {
    const res = await post({ propertyId: '7' });
    expect(res.status).toBe(400);
    expect(pvCreate).not.toHaveBeenCalled();
    expect(ceCreate).not.toHaveBeenCalled();
  });

  it('records a property_view with a parsed numeric propertyId', async () => {
    const res = await post({ eventType: 'property_view', propertyId: '7', sessionId: 'sess-1' });
    expect(res.status).toBe(200);
    expect(pvCreate).toHaveBeenCalledTimes(1);
    expect(pvCreate.mock.calls[0][0].data).toMatchObject({ propertyId: 7, sessionId: 'sess-1' });
    expect(ceCreate).not.toHaveBeenCalled();
    await expect(res.json()).resolves.toMatchObject({ success: true, sessionId: 'sess-1' });
  });

  it('records click_* events in the clickEvent table', async () => {
    await post({ eventType: 'click_phone', propertyId: '7', elementId: 'phone-button' });
    expect(ceCreate).toHaveBeenCalledTimes(1);
    expect(ceCreate.mock.calls[0][0].data).toMatchObject({
      eventType: 'click_phone',
      propertyId: 7,
      elementId: 'phone-button',
    });
  });

  it('records contact_form submissions as click events', async () => {
    await post({ eventType: 'contact_form' });
    expect(ceCreate).toHaveBeenCalledTimes(1);
    expect(ceCreate.mock.calls[0][0].data.propertyId).toBeNull();
  });

  it('derives a stable session id from IP + user agent when none is provided', async () => {
    const ip = '203.0.113.200';
    const a = await (await post({ eventType: 'property_view', propertyId: '1' }, ip)).json();
    const b = await (await post({ eventType: 'property_view', propertyId: '1' }, ip)).json();
    expect(a.sessionId).toBeTruthy();
    expect(a.sessionId).toBe(b.sessionId); // same IP+UA -> same id
  });

  it('returns 500 when the DB write throws', async () => {
    pvCreate.mockRejectedValue(new Error('insert failed'));
    const res = await post({ eventType: 'property_view', propertyId: '7' });
    expect(res.status).toBe(500);
  });

  it('rate-limits floods from a single IP (429)', async () => {
    const ip = '203.0.113.250';
    let last = 200;
    for (let i = 0; i < 61; i++) {
      last = (await post({ eventType: 'property_view', propertyId: '1' }, ip)).status;
    }
    expect(last).toBe(429);
  });
});
