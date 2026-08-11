'use client';

/**
 * Layout store for a customisable admin board.
 *
 * Order, width and visibility of every block live here and persist per admin
 * browser in localStorage (same pattern as the admin locale). The saved list is
 * always reconciled against the page's widget registry, so blocks added in a
 * later release appear with their defaults and blocks removed from the code
 * drop out silently instead of breaking the page.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import { WIDGET_SPANS, type BoardLayoutItem, type BoardWidgetDef, type WidgetSpan } from './types';

const STORAGE_VERSION = 1;

function isSpan(value: unknown): value is WidgetSpan {
  return WIDGET_SPANS.includes(value as WidgetSpan);
}

/** Nearest allowed width for a widget (widths can be restricted per widget). */
function clampSpan<Ctx>(def: BoardWidgetDef<Ctx>, span: WidgetSpan): WidgetSpan {
  const allowed = def.allowedSpans ?? WIDGET_SPANS;
  if (allowed.includes(span)) return span;
  return allowed.reduce((best, s) => (Math.abs(s - span) < Math.abs(best - span) ? s : best), allowed[0]);
}

export function useWidgetLayout<Ctx>(storageKey: string, widgets: BoardWidgetDef<Ctx>[]) {
  const byId = useMemo(
    () => Object.fromEntries(widgets.map((w) => [w.id, w])) as Record<string, BoardWidgetDef<Ctx>>,
    [widgets]
  );

  const defaultLayout = useCallback(
    (): BoardLayoutItem[] => widgets.map((w) => ({ id: w.id, span: w.defaultSpan, visible: w.defaultVisible })),
    [widgets]
  );

  /** Saved layout ∩ registry, then every unseen widget appended with its defaults. */
  const normalize = useCallback((raw: unknown): BoardLayoutItem[] => {
    const saved = Array.isArray((raw as { items?: unknown })?.items) ? (raw as { items: unknown[] }).items : null;
    if (!saved) return defaultLayout();

    const out: BoardLayoutItem[] = [];
    const seen = new Set<string>();

    for (const entry of saved) {
      const item = entry as Partial<BoardLayoutItem>;
      const def = typeof item?.id === 'string' ? byId[item.id] : undefined;
      if (!def || seen.has(def.id)) continue;
      seen.add(def.id);
      out.push({
        id: def.id,
        span: clampSpan(def, isSpan(item.span) ? item.span : def.defaultSpan),
        visible: item.visible !== false,
      });
    }

    for (const def of widgets) {
      if (seen.has(def.id)) continue;
      out.push({ id: def.id, span: def.defaultSpan, visible: def.defaultVisible });
    }

    return out;
  }, [byId, defaultLayout, widgets]);

  // First paint always renders the stock layout (matches SSR markup); the saved
  // one is promoted right after mount.
  const [layout, setLayout] = useState<BoardLayoutItem[]>(defaultLayout);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setLayout(normalize(JSON.parse(raw)));
    } catch {
      /* storage unavailable or corrupt JSON — keep the stock layout */
    }
    setHydrated(true);
    // Registry identity is module-level and storageKey is a constant per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return; // never write the defaults over a saved layout
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ v: STORAGE_VERSION, items: layout }));
    } catch {
      /* non-fatal */
    }
  }, [layout, hydrated, storageKey]);

  /** Reorder by id (drag-and-drop and keyboard both land here). */
  const moveWidget = useCallback((activeId: string, overId: string) => {
    if (activeId === overId) return;
    setLayout((prev) => {
      const from = prev.findIndex((i) => i.id === activeId);
      const to = prev.findIndex((i) => i.id === overId);
      if (from === -1 || to === -1) return prev;
      const next = prev.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const setSpan = useCallback((id: string, span: WidgetSpan) => {
    setLayout((prev) => prev.map((i) => {
      if (i.id !== id) return i;
      const def = byId[id];
      return { ...i, span: def ? clampSpan(def, span) : span };
    }));
  }, [byId]);

  const hideWidget = useCallback((id: string) => {
    setLayout((prev) => prev.map((i) => (i.id === id ? { ...i, visible: false } : i)));
  }, []);

  /** Adding puts the block at the end of the board, where the admin can see it. */
  const addWidget = useCallback((id: string) => {
    setLayout((prev) => {
      const def = byId[id];
      if (!def) return prev;
      const existing = prev.find((i) => i.id === id);
      return [...prev.filter((i) => i.id !== id), { id, span: existing?.span ?? def.defaultSpan, visible: true }];
    });
  }, [byId]);

  const resetLayout = useCallback(() => {
    setLayout(defaultLayout());
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* non-fatal */
    }
  }, [defaultLayout, storageKey]);

  const visibleItems = useMemo(() => layout.filter((i) => i.visible && byId[i.id]), [layout, byId]);

  const hiddenWidgets = useMemo(
    () => layout.filter((i) => !i.visible).map((i) => byId[i.id]).filter(Boolean),
    [layout, byId]
  );

  /** True once the layout differs from the stock one — drives "reset" affordances. */
  const isCustomized = useMemo(() => {
    const base = defaultLayout();
    if (base.length !== layout.length) return true;
    return layout.some((item, i) => {
      const d = base[i];
      return item.id !== d.id || item.span !== d.span || item.visible !== d.visible;
    });
  }, [layout, defaultLayout]);

  return {
    layout,
    visibleItems,
    hiddenWidgets,
    hydrated,
    isCustomized,
    moveWidget,
    setSpan,
    hideWidget,
    addWidget,
    resetLayout,
  };
}
