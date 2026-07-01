// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analytics, trackEvent } from '@/lib/analytics';

describe('client analytics', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
  });
  afterEach(() => vi.unstubAllGlobals());

  const lastBody = () => {
    const calls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls;
    return JSON.parse(calls.at(-1)![1].body as string);
  };

  it('POSTs the event to the tracking endpoint with a session id and url', async () => {
    await trackEvent({ eventType: 'custom_event', propertyId: 7 });
    const [url, init] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('/api/analytics/track');
    expect(init.method).toBe('POST');
    const body = lastBody();
    expect(body.eventType).toBe('custom_event');
    expect(body.propertyId).toBe(7);
    expect(typeof body.sessionId).toBe('string');
    expect(body.sessionId.length).toBeGreaterThan(0);
    expect(typeof body.url).toBe('string');
  });

  it('reuses the same session id across successive events', async () => {
    await trackEvent({ eventType: 'a' });
    const first = lastBody().sessionId;
    await trackEvent({ eventType: 'b' });
    const second = lastBody().sessionId;
    expect(first).toBeTruthy();
    expect(first).toBe(second);
  });

  it('never throws when the network request fails', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('offline'));
    await expect(trackEvent({ eventType: 'x' })).resolves.toBeUndefined();
  });

  it('trackPropertyView fires a property_view event', async () => {
    analytics.trackPropertyView(11);
    await vi.waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    expect(lastBody()).toMatchObject({ eventType: 'property_view', propertyId: 11 });
  });

  it('trackPhoneClick tags the element type and id', async () => {
    analytics.trackPhoneClick(3);
    await vi.waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    expect(lastBody()).toMatchObject({
      eventType: 'click_phone',
      propertyId: 3,
      elementType: 'button',
      elementId: 'phone-button',
    });
  });

  it('trackButtonClick forwards the button id', async () => {
    analytics.trackButtonClick('cta-top', 9);
    await vi.waitFor(() => expect(globalThis.fetch).toHaveBeenCalled());
    expect(lastBody()).toMatchObject({ eventType: 'click_button', elementId: 'cta-top', propertyId: 9 });
  });
});
