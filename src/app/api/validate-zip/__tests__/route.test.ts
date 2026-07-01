import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

import { GET } from '@/app/api/validate-zip/route';

type RespInit = { ok?: boolean; contentType?: string; json?: unknown; text?: string };
const mockResponse = ({ ok = true, contentType = 'application/json', json = {}, text = '' }: RespInit) => ({
  ok,
  headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? contentType : null) },
  json: async () => json,
  text: async () => text,
});

const get = (qs: string) => GET(new NextRequest(`http://localhost/api/validate-zip${qs}`));

describe('GET /api/validate-zip', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it('returns 400 when no zip is provided', async () => {
    const res = await get('');
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toMatchObject({ success: false });
  });

  it('returns 400 for an invalid zip format', async () => {
    const res = await get('?zip=12'); // too short
    expect(res.status).toBe(400);
  });

  it('normalizes spaces/dashes before validating', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse({ json: { city: 'Holon' } })
    );
    const res = await get('?zip=58 10-201'); // -> 5810201 (7 digits, valid)
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.zip).toBe('5810201');
    expect(body.data.city).toBe('Holon');
  });

  it('parses a JSON response from Israel Post', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse({ json: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: '10' } })
    );
    const body = await (await get('?zip=6100000')).json();
    expect(body).toMatchObject({
      success: true,
      data: { city: 'Tel Aviv', street: 'Dizengoff', houseNumber: '10' },
    });
  });

  it('parses a Hebrew HTML response from Israel Post', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockResponse({ contentType: 'text/html', text: 'יישוב: <span>חולון</span>' })
    );
    const body = await (await get('?zip=5810201')).json();
    expect(body.success).toBe(true);
    expect(body.data.city).toBe('חולון');
  });

  it('returns 404 when Israel Post responds with a non-OK status', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse({ ok: false }));
    const res = await get('?zip=9999999');
    expect(res.status).toBe(404);
  });

  it('returns 500 when the upstream fetch throws', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('network'));
    const res = await get('?zip=5810201');
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toMatchObject({ success: false });
  });
});
