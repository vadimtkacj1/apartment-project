'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

// Global top navigation progress bar for the App Router.
// There is no built-in "navigation pending" UI in Next: clicking a <Link>
// blocks on the new route's server render with zero feedback. This bar starts
// the moment a same-origin link is clicked (or back/forward fires), holds while
// the server renders, and — crucially — does NOT disappear until the new page's
// above-the-fold content (images + fonts) has actually finished loading.
function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // progress: -1 = hidden/idle, 0..100 = visible width %
  const [progress, setProgress] = useState<number>(-1);

  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef<boolean>(false);
  // Bumped on every commit; lets a stale content-wait know it was superseded.
  const waitTokenRef = useRef<number>(0);
  // Tears down the in-flight "wait for images/fonts" watcher.
  const contentCleanupRef = useRef<(() => void) | null>(null);

  const clearTrickle = () => {
    if (trickleRef.current) { clearInterval(trickleRef.current); trickleRef.current = null; }
  };
  const clearSafety = () => {
    if (safetyRef.current) { clearTimeout(safetyRef.current); safetyRef.current = null; }
  };
  const clearContentWatch = () => {
    if (contentCleanupRef.current) { contentCleanupRef.current(); contentCleanupRef.current = null; }
  };

  // The bar is truly done: snap to 100, fade out, reset to hidden.
  const finalize = () => {
    activeRef.current = false;
    clearTrickle();
    clearSafety();
    clearContentWatch();
    setProgress(100);
    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setProgress(-1), 240);
  };

  // Begin a navigation: show the bar, trickle toward ~90% but never reach 100.
  const start = () => {
    // Already navigating (rapid clicks / back-forward): keep it visible, don't
    // reset to 0.
    if (activeRef.current) return;
    activeRef.current = true;
    if (hideRef.current) clearTimeout(hideRef.current);
    clearTrickle();
    clearSafety();
    clearContentWatch();
    setProgress(8); // instant visible feedback

    trickleRef.current = setInterval(() => {
      setProgress((p) => {
        if (p < 0) return p;
        if (p >= 90) return p; // hold near the end until the route commits
        const step = p < 40 ? 6 : p < 70 ? 3 : 1.5;
        return Math.min(p + step, 90);
      });
    }, 200);

    // Hard ceiling: even if the route never commits AND content never settles,
    // never leave the bar stuck on screen.
    safetyRef.current = setTimeout(() => finalize(), 15000);
  };

  // Wait until the freshly-committed route's above-the-fold content has loaded:
  // every non-lazy <img> is complete and web fonts are ready. Returns a cleanup.
  // `done` is called exactly once (also via the internal cap so it can't hang).
  const waitForContent = (done: () => void): (() => void) => {
    let finished = false;
    let raf1 = 0;
    let raf2 = 0;
    const detachers: Array<() => void> = [];

    const finish = () => {
      if (finished) return;
      finished = true;
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      detachers.forEach((fn) => fn());
      clearTimeout(cap);
      done();
    };

    // Independent cap so a slow/hanging image can't keep the bar up forever.
    const cap = setTimeout(finish, 6000);

    // Two RAFs: let React paint the new route before we inspect the DOM.
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const imgs = Array.from(document.images).filter(
          (img) => img.getAttribute('src') && img.loading !== 'lazy' && !img.complete,
        );

        let remaining = imgs.length;
        const tickets: Promise<void>[] = [];

        for (const img of imgs) {
          tickets.push(
            new Promise<void>((resolve) => {
              const onSettle = () => {
                img.removeEventListener('load', onSettle);
                img.removeEventListener('error', onSettle);
                remaining--;
                resolve();
              };
              img.addEventListener('load', onSettle);
              img.addEventListener('error', onSettle);
              detachers.push(onSettle);
            }),
          );
        }

        if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
          tickets.push(document.fonts.ready.then(() => undefined).catch(() => undefined));
        }

        Promise.all(tickets).then(finish);
        // Nothing to wait for -> finish on the next microtask.
        if (remaining === 0 && tickets.length === 0) finish();
      });
    });

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      detachers.forEach((fn) => fn());
      clearTimeout(cap);
    };
  };

  // The committed route changed (Link click, back/forward, or search-only nav).
  // Don't finish yet — hold the bar and wait for content to actually load.
  const onCommit = () => {
    if (!activeRef.current) return;
    clearTrickle();
    clearSafety();
    clearContentWatch();
    // Jump near the end so the commit is visible, then creep slowly while the
    // page's images/fonts load.
    setProgress((p) => (p < 0 || p < 90 ? 90 : p));
    trickleRef.current = setInterval(() => {
      setProgress((p) => (p >= 0 && p < 98 ? p + 0.4 : p));
    }, 240);

    const token = ++waitTokenRef.current;
    contentCleanupRef.current = waitForContent(() => {
      // A newer navigation started while we were waiting: let it own the bar.
      if (token !== waitTokenRef.current) return;
      finalize();
    });
  };

  // FINISH/commit trigger: runs on mount and on every pathname/searchParams
  // change. Skip the very first mount (no navigation happened yet).
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    onCommit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // START trigger #1: capture-phase document click — catches every same-origin
  // <Link>/<a> left-click before Next begins the navigation.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) {
        return;
      }

      const anchor = (e.target as Element | null)?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      if (/^(mailto:|tel:|sms:|javascript:|blob:|data:)/i.test(href)) return;

      const target = anchor.getAttribute('target');
      if (target && target !== '_self') return;

      if (anchor.hasAttribute('download')) return;

      let dest: URL;
      try {
        dest = new URL(href, window.location.href);
      } catch {
        return;
      }

      // External origin: the browser leaves the app, no in-app bar.
      if (dest.origin !== window.location.origin) return;

      // Same page, hash-only jump: not a route change.
      const samePathAndQuery =
        dest.pathname === window.location.pathname &&
        dest.search === window.location.search;
      if (samePathAndQuery && dest.hash) return;

      // Clicking the exact current URL: no navigation.
      if (
        dest.pathname === window.location.pathname &&
        dest.search === window.location.search &&
        dest.hash === window.location.hash
      ) {
        return;
      }

      start();
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // START trigger #2: browser back / forward.
  useEffect(() => {
    const onPopState = () => start();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clean up everything on unmount.
  useEffect(() => {
    return () => {
      clearTrickle();
      clearSafety();
      clearContentWatch();
      if (hideRef.current) clearTimeout(hideRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (progress < 0) return null;

  const done = progress >= 100;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 2147483647, // above sticky header, modals, a11y + WhatsApp widgets
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          marginInlineStart: 0,
          background:
            'linear-gradient(90deg, #1c3664 0%, #2a4f8f 60%, #3a66b0 100%)',
          boxShadow: '0 0 8px rgba(28, 54, 100, 0.55), 0 0 4px rgba(28, 54, 100, 0.45)',
          borderRadius: '0 2px 2px 0',
          transition: done
            ? 'width 180ms ease-out, opacity 220ms ease-in 80ms'
            : 'width 200ms ease-out',
          opacity: done ? 0 : 1,
        }}
      />
    </div>
  );
}

// useSearchParams() requires a Suspense boundary, so it's baked in here.
export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
