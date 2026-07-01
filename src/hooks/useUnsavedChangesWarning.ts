'use client';

import { useEffect } from 'react';

/**
 * Warns before the user loses unsaved form edits.
 *
 * While `when` is true (the form is dirty), navigating away via tab close,
 * refresh, browser back/forward, or an external link triggers the native
 * "Leave site? Changes you made may not be saved." prompt.
 *
 * Usage:
 *   const [dirty, setDirty] = useState(false);
 *   useUnsavedChangesWarning(dirty);
 *   // <Form onValuesChange={() => setDirty(true)} ... />  set false after save
 *
 * Note: the Next.js App Router exposes no public API to block in-app <Link>
 * navigations, so this guards the browser-level `beforeunload` — which covers
 * the most common data-loss vectors (close / refresh / back / external nav).
 */
export function useUnsavedChangesWarning(when: boolean): void {
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Required for the prompt to appear in Chromium-based browsers.
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [when]);
}
