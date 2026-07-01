'use client';

import { Grid } from 'antd';

/**
 * True when the viewport is below antd's `md` breakpoint (<768px) — phones and
 * small tablets in portrait. Backed by antd's Grid.useBreakpoint (matchMedia),
 * so it stays in sync with the CSS breakpoints used across the admin shell.
 *
 * SSR / first paint returns `false` (Grid.useBreakpoint is `{}` before mount),
 * so components render the desktop branch first. For flash-free table→card
 * swaps prefer the CSS utilities `.admin-only-desktop` / `.admin-only-mobile`;
 * reach for this hook only where BEHAVIOR (not just visibility) must change —
 * e.g. recharts axis sizing or how many data points to slice.
 */
export function useIsMobile(): boolean {
  const screens = Grid.useBreakpoint();
  return screens.md === false;
}

export default useIsMobile;
