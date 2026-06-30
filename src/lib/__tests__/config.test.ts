import { describe, it, expect } from 'vitest';
import { siteUrl } from '@/lib/config';

describe('siteUrl', () => {
  it('is a defined, absolute https URL', () => {
    expect(typeof siteUrl).toBe('string');
    expect(siteUrl).toMatch(/^https?:\/\//);
  });

  it('has no trailing slash so paths can be appended directly', () => {
    expect(siteUrl.endsWith('/')).toBe(false);
  });

  it('defaults to the production domain when the env var is unset', () => {
    // NEXT_PUBLIC_SITE_URL is not set in the test environment.
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      expect(siteUrl).toBe('https://ram-haim.co.il');
    } else {
      expect(siteUrl).toBe(process.env.NEXT_PUBLIC_SITE_URL);
    }
  });
});
