// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { usePerformanceSettings } from '@/lib/usePerformanceSettings';

const setWidth = (px: number) => {
  Object.defineProperty(window, 'innerWidth', { value: px, configurable: true, writable: true });
};

describe('usePerformanceSettings', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('reports desktop (isMobile=false) for a wide viewport', () => {
    setWidth(1280);
    const { result } = renderHook(() => usePerformanceSettings());
    expect(result.current.isMobile).toBe(false);
  });

  it('reports mobile (isMobile=true) below the 768px breakpoint', () => {
    setWidth(500);
    const { result } = renderHook(() => usePerformanceSettings());
    expect(result.current.isMobile).toBe(true);
  });

  it('updates on resize after the debounce window', () => {
    setWidth(1280);
    const { result } = renderHook(() => usePerformanceSettings());
    expect(result.current.isMobile).toBe(false);

    act(() => {
      setWidth(400);
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(200); // past the 150ms debounce
    });
    expect(result.current.isMobile).toBe(true);
  });

  it('removes its resize listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => usePerformanceSettings());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
