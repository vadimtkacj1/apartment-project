'use client';

import React from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';

// Public components use the lightweight `m` component instead of `motion`.
// LazyMotion supplies the animation feature set. We load `domAnimation`
// synchronously (not via an async import) so animations are active the instant
// the page hydrates — no delay and no risk of content that starts at
// `opacity: 0` ever being left invisible if a deferred chunk failed to load.
//
// The win over importing full `motion` everywhere: `m` + domAnimation excludes
// the layout/drag/projection engine (nothing in the app uses it), trimming the
// animation runtime that ships on every public page.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  // No `strict`: the admin section (outside the public tree but still under
  // this root-level provider) keeps using the full `motion` component.
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
