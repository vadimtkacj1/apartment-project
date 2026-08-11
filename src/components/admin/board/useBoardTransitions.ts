'use client';

/**
 * Motion for the board: a card that is added fades and lifts into place, and
 * every card around it glides to its new slot instead of jumping.
 *
 * FLIP against the previous commit — each pass measures where the cards are
 * now, compares with where they were, and plays the inverse transform out. It
 * stays out of the way while a drag is in progress (dnd-kit owns the transforms
 * there) and re-baselines on the first commit afterwards, and it does nothing at
 * all when the admin asked for reduced motion.
 */

import { useLayoutEffect, useRef, type RefObject } from 'react';

const DURATION = 320;
const ENTER_DURATION = 380;
const EASING = 'cubic-bezier(.22, 1, .36, 1)';

export function useBoardTransitions(
  containerRef: RefObject<HTMLElement | null>,
  { enabled = true }: { enabled?: boolean } = {}
) {
  const prevRects = useRef<Map<string, DOMRect>>(new Map());
  const knownIds = useRef<Set<string>>(new Set());
  const needsBaseline = useRef(true);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Dragging (or reduced motion): let the next pass re-baseline silently.
    if (!enabled) {
      needsBaseline.current = true;
      return;
    }

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-widget-id]'));
    const nextRects = new Map<string, DOMRect>();
    for (const node of nodes) {
      const id = node.dataset.widgetId;
      if (id) nextRects.set(id, node.getBoundingClientRect());
    }

    if (needsBaseline.current) {
      prevRects.current = nextRects;
      knownIds.current = new Set(nextRects.keys());
      needsBaseline.current = false;
      return;
    }

    for (const node of nodes) {
      const id = node.dataset.widgetId;
      if (!id) continue;
      const rect = nextRects.get(id)!;
      const prev = prevRects.current.get(id);

      if (!prev) {
        // A card that was not on the board a moment ago — fade it in.
        if (!knownIds.current.has(id)) {
          node.animate(
            [
              { opacity: 0, transform: 'translateY(12px) scale(.97)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: ENTER_DURATION, easing: EASING }
          );
        }
        continue;
      }

      const dx = prev.left - rect.left;
      const dy = prev.top - rect.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;

      node.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration: DURATION, easing: EASING }
      );
    }

    prevRects.current = nextRects;
    knownIds.current = new Set(nextRects.keys());
  });
}
