// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Analytics fires a fetch on mount; stub it so the hook stays pure under test.
// vi.hoisted because vi.mock factories run before top-level statements.
const { trackPropertyView } = vi.hoisted(() => ({ trackPropertyView: vi.fn() }));
vi.mock('@/lib/analytics', () => ({
  analytics: { trackPropertyView, trackPropertyClick: vi.fn() },
}));

import { usePropertyData } from '@/hooks/usePropertyData';

type Spec = { label: string; value: string; icon: unknown };
const specVal = (specs: Spec[], label: string) => specs.find((s) => s.label === label)?.value;

const fullData = {
  id: 5,
  title: 'Penthouse',
  location: 'Holon',
  city: 'holon',
  area: 90,
  rooms: 4,
  floor: 2,
  totalFloors: 6,
  builtArea: 100,
  balconySize: 12,
  bathrooms: 2,
  propertyType: 'penthouse',
  parking: 'double',
  position: 'front',
  furniture: 'full',
  kitchen: 'upgraded',
  vacancyDate: 'מיד',
  directions: ['north', 'west'],
  images: ['/x.jpg'],
  description: 'desc',
  isSold: false,
  hasAirConditioning: true,
  hasSunroom: true,
  hasSafeRoom: true,
  agents: [],
  owners: [],
};

describe('usePropertyData with SSR initialData', () => {
  beforeEach(() => trackPropertyView.mockReset());

  it('maps initial data synchronously (no loading state)', () => {
    const { result } = renderHook(() => usePropertyData('5', fullData));
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.property).not.toBeNull();
    expect(result.current.property!.id).toBe(5);
    expect(result.current.property!.bedrooms).toBe(4); // rooms -> bedrooms
  });

  it('records a property view exactly once when SSR data is present', () => {
    renderHook(() => usePropertyData('5', fullData));
    expect(trackPropertyView).toHaveBeenCalledWith('5');
    expect(trackPropertyView).toHaveBeenCalledTimes(1);
  });

  it('builds the spec rows with Hebrew labels and formatted values', () => {
    const { result } = renderHook(() => usePropertyData('5', fullData));
    const specs = result.current.property!.specs as Spec[];

    expect(specVal(specs, 'קומה')).toBe('2 מתוך 6');
    expect(specVal(specs, 'גודל במ"ר')).toBe('90');
    expect(specVal(specs, 'שטח בנוי במ"ר')).toBe('100');
    expect(specVal(specs, 'גודל מרפסת שמש (מ״ר)')).toBe('12');
    expect(specVal(specs, 'חדרים')).toBe('4');
    expect(specVal(specs, 'חדרי רחצה')).toBe('2');
    expect(specVal(specs, 'סוג נכס')).toBe('פנטהאוז'); // penthouse
    expect(specVal(specs, 'חניה')).toBe('כפולה'); // double
    expect(specVal(specs, 'מיקום בבניין')).toBe('חזית'); // front
    expect(specVal(specs, 'ריהוט')).toBe('מלא'); // full
    expect(specVal(specs, 'מטבח')).toBe('משודרג'); // upgraded
    expect(specVal(specs, 'תאריך פינוי')).toBe('מיד');
    expect(specVal(specs, 'כיווני אוויר')).toBe('צפון, מערב'); // north, west
  });

  it('maps amenity flags (note: solarHeater<-hasSunroom, mamad<-hasSafeRoom)', () => {
    const { result } = renderHook(() => usePropertyData('5', fullData));
    const { amenities } = result.current.property!;
    expect(amenities.ac).toBe(true);
    expect(amenities.solarHeater).toBe(true);
    expect(amenities.mamad).toBe(true);
    expect(amenities.elevator).toBe(false);
    expect(amenities.pets).toBe(false);
  });

  it('shows floor without "out of" when totalFloors is missing', () => {
    const { result } = renderHook(() =>
      usePropertyData('5', { ...fullData, floor: 3, totalFloors: 0 })
    );
    const specs = result.current.property!.specs as Spec[];
    expect(specVal(specs, 'קומה')).toBe('3');
  });

  it('special-cases flexible ("גמיש") vacancy dates', () => {
    const { result } = renderHook(() =>
      usePropertyData('5', { ...fullData, vacancyDate: 'גמיש' })
    );
    const specs = result.current.property!.specs as Spec[];
    expect(specVal(specs, 'תאריך פינוי')).toBe('גמיש');
  });

  it('formats an ISO vacancy date to DD/MM/YYYY', () => {
    const { result } = renderHook(() =>
      usePropertyData('5', { ...fullData, vacancyDate: '2026-12-15T12:00:00.000Z' })
    );
    const specs = result.current.property!.specs as Spec[];
    expect(specVal(specs, 'תאריך פינוי')).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('falls back to a default image and description when missing', () => {
    const { result } = renderHook(() =>
      usePropertyData('5', { ...fullData, images: [], description: '' })
    );
    expect(result.current.property!.images).toEqual(['/images/hero/sales.jpg']);
    expect(result.current.property!.description).toBe('אין תיאור זמין');
  });

  it('omits optional specs that are absent', () => {
    const minimal = { id: 1, title: 't', area: 50, rooms: 3, images: ['/a.jpg'] };
    const { result } = renderHook(() => usePropertyData('1', minimal));
    const specs = result.current.property!.specs as Spec[];
    const labels = specs.map((s) => s.label);
    expect(labels).toContain('גודל במ"ר');
    expect(labels).toContain('חדרים');
    expect(labels).not.toContain('קומה');
    expect(labels).not.toContain('חניה');
    expect(labels).not.toContain('תאריך פינוי');
  });
});

describe('usePropertyData client fetch (no initialData)', () => {
  beforeEach(() => {
    trackPropertyView.mockReset();
    vi.unstubAllGlobals();
  });

  it('fetches, maps and records a view on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...fullData, id: 8 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => usePropertyData('8'));
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledWith('/api/properties/8');
    expect(result.current.property!.id).toBe(8);
    expect(result.current.error).toBeNull();
    expect(trackPropertyView).toHaveBeenCalledWith('8');
  });

  it('sets a Hebrew error message when the request fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => usePropertyData('9'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.property).toBeNull();
    expect(result.current.error).toBe('שגיאה בטעינת הנכס');
  });
});
