import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

import { GET } from '@/app/api/geocode/route';

const fetchMock = () => globalThis.fetch as ReturnType<typeof vi.fn>;
const jsonResp = (value: unknown) => ({ ok: true, json: async () => value });

let ipSeed = 0;
const get = (qs: string, ip = `198.51.100.${ipSeed++}`) =>
  GET(new NextRequest(`http://localhost/api/geocode${qs}`, { headers: { 'x-forwarded-for': ip } }));

describe('GET /api/geocode', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it('returns 400 when no address, postalCode, or lat/lng is given', async () => {
    const res = await get('');
    expect(res.status).toBe(400);
  });

  it('reverse-geocodes lat/lng into a structured address', async () => {
    fetchMock().mockResolvedValue(
      jsonResp({
        lat: '32.01',
        lon: '34.77',
        display_name: 'Holon, Israel',
        address: { city: 'Holon', road: 'Sokolov', house_number: '5', suburb: 'Neot Rabin', postcode: '5801' },
      })
    );
    const body = await (await get('?lat=32.01&lng=34.77')).json();
    expect(body.success).toBe(true);
    expect(body.results[0]).toMatchObject({
      city: 'Holon',
      street: 'Sokolov',
      streetNumber: '5',
      neighborhood: 'Neot Rabin',
    });
  });

  it('fixes swapped coordinates in a reverse-geocode response', async () => {
    // lat/lon swapped (lat looks like a longitude); the route should swap back.
    fetchMock().mockResolvedValue(
      jsonResp({ lat: '34.80', lon: '32.01', display_name: 'X', address: { city: 'Holon' } })
    );
    const body = await (await get('?lat=34.80&lng=32.01')).json();
    expect(body.results[0].lat).toBeCloseTo(32.01, 2);
    expect(body.results[0].lng).toBeCloseTo(34.8, 2);
  });

  it('forward-geocodes an address into result rows', async () => {
    fetchMock().mockResolvedValue(
      jsonResp([
        { lat: '32.01', lon: '34.77', display_name: 'Herzl, Holon', address: { city: 'Holon', road: 'Herzl' } },
      ])
    );
    const body = await (await get('?address=Holon')).json();
    expect(body.success).toBe(true);
    expect(body.results).toHaveLength(1);
    expect(body.results[0].city).toBe('Holon');
    expect(body.results[0].street).toBe('Herzl');
  });

  it('reports success:false with a message when an address has no matches', async () => {
    fetchMock().mockResolvedValue(jsonResp([]));
    const body = await (await get('?address=Nowhereville')).json();
    expect(body.success).toBe(false);
    expect(body.results).toEqual([]);
    expect(typeof body.error).toBe('string');
  });

  it('rate-limits floods from a single IP (429)', async () => {
    fetchMock().mockResolvedValue(jsonResp([]));
    const ip = '198.51.100.240';
    let last = 200;
    for (let i = 0; i < 31; i++) {
      last = (await get('?address=Holon', ip)).status;
    }
    expect(last).toBe(429);
  });
});
