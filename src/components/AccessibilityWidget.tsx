'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Self-hosted, version-pinned (was jsdelivr @latest — uncacheable and a
// third-party dependency on the critical origin set).
const WIDGET_SRC = '/vendor/sienna-accessibility-2.2.333.umd.js';

let injected = false;

function injectScript() {
  if (injected || document.querySelector(`script[src="${WIDGET_SRC}"]`)) return;
  injected = true;
  const s = document.createElement('script');
  s.src = WIDGET_SRC;
  s.defer = true;
  document.body.appendChild(s);
}

/**
 * Loads the accessibility widget on the first user interaction (so it never
 * competes with the critical path), with a timed fallback so it still
 * appears for users who haven't interacted yet.
 */
export default function AccessibilityWidget() {
  const pathname = usePathname();
  const disabled = pathname?.startsWith('/admin') ?? false;

  useEffect(() => {
    if (disabled || injected) return;

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    const onInteract = () => {
      cleanup();
      injectScript();
    };
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, onInteract));
      clearTimeout(fallback);
    };
    events.forEach((e) => window.addEventListener(e, onInteract, { once: true, passive: true }));
    const fallback = setTimeout(onInteract, 6000);

    return cleanup;
  }, [disabled]);

  return null;
}
