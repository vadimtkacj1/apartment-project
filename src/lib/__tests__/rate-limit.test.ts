import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// Each test uses a unique key so the module-level bucket map never bleeds
// state between cases.
let counter = 0;
const freshKey = () => `test-key-${counter++}-${Math.random()}`;

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows the first request and reports remaining budget', () => {
    const res = rateLimit(freshKey(), 5, 1000);
    expect(res.ok).toBe(true);
    expect(res.remaining).toBe(4);
    expect(res.retryAfter).toBe(0);
  });

  it('decrements remaining on each subsequent request within the window', () => {
    const key = freshKey();
    expect(rateLimit(key, 3, 1000).remaining).toBe(2);
    expect(rateLimit(key, 3, 1000).remaining).toBe(1);
    expect(rateLimit(key, 3, 1000).remaining).toBe(0);
  });

  it('blocks once the limit is reached and returns a retryAfter', () => {
    const key = freshKey();
    rateLimit(key, 2, 10_000);
    rateLimit(key, 2, 10_000);
    const blocked = rateLimit(key, 2, 10_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(10);
  });

  it('resets the window after windowMs elapses', () => {
    const key = freshKey();
    rateLimit(key, 1, 1000); // consume the only slot
    expect(rateLimit(key, 1, 1000).ok).toBe(false);

    vi.advanceTimersByTime(1001);

    const afterReset = rateLimit(key, 1, 1000);
    expect(afterReset.ok).toBe(true);
    expect(afterReset.remaining).toBe(0);
  });

  it('tracks distinct keys independently', () => {
    const a = freshKey();
    const b = freshKey();
    rateLimit(a, 1, 1000);
    expect(rateLimit(a, 1, 1000).ok).toBe(false);
    // Different key still has its full budget.
    expect(rateLimit(b, 1, 1000).ok).toBe(true);
  });

  it('computes retryAfter as whole seconds (ceil)', () => {
    const key = freshKey();
    rateLimit(key, 1, 4500); // 4.5s window
    const blocked = rateLimit(key, 1, 4500);
    expect(blocked.retryAfter).toBe(5); // ceil(4.5) -> 5
  });
});

describe('getClientIp', () => {
  const makeReq = (headers: Record<string, string>) =>
    new Request('http://localhost/', { headers });

  it('prefers cf-connecting-ip', () => {
    const req = makeReq({
      'cf-connecting-ip': '1.1.1.1',
      'x-real-ip': '2.2.2.2',
      'x-forwarded-for': '3.3.3.3',
    });
    expect(getClientIp(req)).toBe('1.1.1.1');
  });

  it('falls back to x-real-ip when cf header is absent', () => {
    const req = makeReq({ 'x-real-ip': '2.2.2.2', 'x-forwarded-for': '3.3.3.3' });
    expect(getClientIp(req)).toBe('2.2.2.2');
  });

  it('uses the first entry of x-forwarded-for', () => {
    const req = makeReq({ 'x-forwarded-for': '3.3.3.3, 4.4.4.4, 5.5.5.5' });
    expect(getClientIp(req)).toBe('3.3.3.3');
  });

  it('trims whitespace from header values', () => {
    const req = makeReq({ 'cf-connecting-ip': '  9.9.9.9  ' });
    expect(getClientIp(req)).toBe('9.9.9.9');
  });

  it('returns "unknown" when no proxy headers are present', () => {
    expect(getClientIp(makeReq({}))).toBe('unknown');
  });
});
