'use client';

import { useEffect, useState } from 'react';

/**
 * True when the viewport is below the `md` breakpoint (<768px) — phones and
 * small tablets in portrait. Backed by matchMedia.
 *
 * SSR / first paint returns `false` (desktop branch first). For flash-free
 * table→card swaps prefer the CSS utilities `.admin-only-desktop` /
 * `.admin-only-mobile`; reach for this hook only where BEHAVIOR (not just
 * visibility) must change — e.g. recharts axis sizing or data slicing.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767.98px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return isMobile;
}

export default useIsMobile;
