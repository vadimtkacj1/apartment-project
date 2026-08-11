// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard, propertyShareUrl } from '../copy-to-clipboard';

const setClipboard = (value: unknown) => {
  Object.defineProperty(navigator, 'clipboard', {
    value,
    configurable: true,
    writable: true,
  });
};

describe('copyToClipboard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    setClipboard(undefined);
    delete (document as any).execCommand;
  });

  it('uses the async clipboard API when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });

    await expect(copyToClipboard('https://example.com/apartments/7')).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('https://example.com/apartments/7');
  });

  it('falls back to execCommand outside a secure context', async () => {
    setClipboard(undefined);
    let selectedValue = '';
    (document as any).execCommand = vi.fn(() => {
      // Read the scratch textarea while it is still mounted — jsdom's select()
      // does not move document.activeElement.
      selectedValue = document.querySelector('textarea')?.value ?? '';
      return true;
    });

    await expect(copyToClipboard('https://example.com/apartments/9')).resolves.toBe(true);
    expect(selectedValue).toBe('https://example.com/apartments/9');
    // The scratch textarea must not linger in the DOM.
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('falls back when the clipboard API rejects (permission denied)', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('denied')) });
    (document as any).execCommand = vi.fn(() => true);

    await expect(copyToClipboard('x')).resolves.toBe(true);
    expect((document as any).execCommand).toHaveBeenCalledWith('copy');
  });

  it('reports failure when neither path copies', async () => {
    setClipboard(undefined);
    (document as any).execCommand = vi.fn(() => false);

    await expect(copyToClipboard('x')).resolves.toBe(false);
  });
});

describe('propertyShareUrl', () => {
  it('builds an absolute property URL from the current origin', () => {
    expect(propertyShareUrl(42)).toBe(`${window.location.origin}/apartments/42`);
  });
});
