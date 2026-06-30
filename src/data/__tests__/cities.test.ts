import { describe, it, expect } from 'vitest';
import {
  ISRAELI_CITIES,
  getCityLabel,
  getCitySlug,
  CENTER_REGION_CITY_SLUGS,
} from '@/data/cities';

describe('ISRAELI_CITIES integrity', () => {
  it('has unique slugs', () => {
    const slugs = ISRAELI_CITIES.map((c) => c.value);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every entry has a non-empty ascii slug and a Hebrew label', () => {
    for (const c of ISRAELI_CITIES) {
      expect(c.value).toMatch(/^[a-z0-9-]+$/);
      expect(c.label.trim().length).toBeGreaterThan(0);
    }
  });

  it('keeps the original four cities first for compatibility', () => {
    expect(ISRAELI_CITIES.slice(0, 4).map((c) => c.value)).toEqual([
      'holon',
      'batyam',
      'rishon',
      'telaviv',
    ]);
  });
});

describe('getCityLabel', () => {
  it('returns the Hebrew label for a known slug', () => {
    expect(getCityLabel('holon')).toBe('חולון');
    expect(getCityLabel('telaviv')).toBe('תל אביב');
  });

  it('falls back to the raw value for an unknown slug', () => {
    expect(getCityLabel('atlantis')).toBe('atlantis');
  });

  it('returns an empty string for null/undefined/empty', () => {
    expect(getCityLabel(null)).toBe('');
    expect(getCityLabel(undefined)).toBe('');
    expect(getCityLabel('')).toBe('');
  });
});

describe('getCitySlug', () => {
  it('maps a Hebrew label to its slug', () => {
    expect(getCitySlug('חולון')).toBe('holon');
    expect(getCitySlug('בת ים')).toBe('batyam');
  });

  it('maps common English/OSM variants to slugs', () => {
    expect(getCitySlug('Tel Aviv-Yafo')).toBe('telaviv');
    expect(getCitySlug('Bat Yam')).toBe('batyam');
    expect(getCitySlug('Beersheba')).toBe('beersheba');
    expect(getCitySlug('Herzliya')).toBe('hertzliya');
  });

  it('slugifies an unknown name (lowercase, spaces->dashes, strip punctuation)', () => {
    expect(getCitySlug('Some New Place')).toBe('some-new-place');
    expect(getCitySlug("O'Brien Town")).toBe('obrien-town');
  });

  it('returns an empty string for null/undefined/empty', () => {
    expect(getCitySlug(null)).toBe('');
    expect(getCitySlug(undefined)).toBe('');
    expect(getCitySlug('')).toBe('');
  });

  it('round-trips known city slug -> label -> slug', () => {
    for (const slug of ['holon', 'telaviv', 'ramat-gan', 'givatayim']) {
      expect(getCitySlug(getCityLabel(slug))).toBe(slug);
    }
  });
});

describe('CENTER_REGION_CITY_SLUGS', () => {
  it('references only slugs that exist in ISRAELI_CITIES', () => {
    const known = new Set(ISRAELI_CITIES.map((c) => c.value));
    for (const slug of CENTER_REGION_CITY_SLUGS) {
      expect(known.has(slug)).toBe(true);
    }
  });

  it('contains the agency home market (holon) and Tel Aviv', () => {
    expect(CENTER_REGION_CITY_SLUGS).toContain('holon');
    expect(CENTER_REGION_CITY_SLUGS).toContain('telaviv');
  });

  it('has no duplicate entries', () => {
    expect(new Set(CENTER_REGION_CITY_SLUGS).size).toBe(CENTER_REGION_CITY_SLUGS.length);
  });
});
