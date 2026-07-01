import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, cn } from '@/lib/utils';

describe('formatPrice', () => {
  it('formats an integer as RUB currency with no fraction digits', () => {
    // Intl inserts non-breaking spaces as grouping separators; normalise them.
    const out = formatPrice(1500000).replace(/ | /g, ' ');
    expect(out).toContain('1');
    expect(out).toContain('₽');
    expect(out).not.toContain(',00');
    expect(out).not.toContain('.00');
  });

  it('handles zero', () => {
    const out = formatPrice(0).replace(/ | /g, ' ');
    expect(out).toContain('0');
    expect(out).toContain('₽');
  });

  it('shows no decimal part for whole-number input (minimumFractionDigits: 0)', () => {
    const out = formatPrice(250000);
    expect(out).not.toMatch(/[.,]\d{2}/);
  });

  it('keeps fractional digits for non-integer input', () => {
    // minimumFractionDigits:0 suppresses decimals only for whole numbers;
    // fractional values still render up to the currency default (2 dp).
    expect(formatPrice(99.99)).toMatch(/99[.,]99/);
  });

  it('is deterministic for the same input', () => {
    expect(formatPrice(250000)).toBe(formatPrice(250000));
  });
});

describe('formatDate', () => {
  it('formats a date in Russian long form', () => {
    const out = formatDate(new Date('2026-06-28T00:00:00Z'));
    expect(out).toMatch(/2026/);
    // Russian month name for June.
    expect(out).toMatch(/июн/i);
  });

  it('returns a non-empty string', () => {
    expect(formatDate(new Date('2020-01-01T12:00:00Z')).length).toBeGreaterThan(0);
  });
});

describe('cn', () => {
  it('joins truthy class names with a single space', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('drops falsy values (undefined, null, false, empty string)', () => {
    expect(cn('a', undefined, null, false, '', 'b')).toBe('a b');
  });

  it('returns an empty string when everything is falsy', () => {
    expect(cn(undefined, null, false)).toBe('');
  });

  it('supports conditional className patterns', () => {
    const isActive = true;
    const isHidden = false;
    expect(cn('base', isActive && 'active', isHidden && 'hidden')).toBe('base active');
  });
});
