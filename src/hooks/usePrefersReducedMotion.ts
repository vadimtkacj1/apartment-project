'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * True when the user has asked the OS to minimise non-essential motion
 * (System Settings → Accessibility → "reduce motion" and equivalents).
 *
 * SSR / first paint returns `false` (no `window`/`matchMedia` on the server),
 * so components render their animated branch first, then downgrade after mount
 * if the preference is set. Subscribes to changes so a live toggle is honoured.
 *
 * Use it to gate decorative animation — e.g. pass `isAnimationActive={!reduced}`
 * to recharts series — never to hide content.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export default usePrefersReducedMotion;
