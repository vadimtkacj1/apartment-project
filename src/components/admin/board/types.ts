import type React from 'react';

import type { MessagesShape } from '@/lib/adminI18n';
import type { boardMessages } from '@/lib/adminI18n/messages/board';

/** Resolved board chrome messages for the active admin locale. */
export type BoardLabels = MessagesShape<(typeof boardMessages)['he']>;

/** Column span on the 6-column desktop grid: ⅓ · ½ · ⅔ · full. */
export type WidgetSpan = 2 | 3 | 4 | 6;

export const WIDGET_SPANS: readonly WidgetSpan[] = [2, 3, 4, 6] as const;

/**
 * One block of a customisable admin board. Widgets are pure functions of the
 * page's context object, so a page can reorder, resize, hide or add them
 * without any change to how its data is loaded.
 */
export interface BoardWidgetDef<Ctx> {
  id: string;
  /** Title for the card header, the edit toolbar and the block picker. */
  title: (ctx: Ctx) => string;
  defaultSpan: WidgetSpan;
  /** Part of the stock layout, or an extra offered in the block picker. */
  defaultVisible: boolean;
  /** Widths offered in the edit toolbar (defaults to all four). */
  allowedSpans?: readonly WidgetSpan[];
  /** Renders its own card/chrome — the board adds no Card and no title row. */
  bare?: boolean;
  render: (ctx: Ctx) => React.ReactNode;
}

/** One entry of a persisted board layout. */
export interface BoardLayoutItem {
  id: string;
  span: WidgetSpan;
  visible: boolean;
}
