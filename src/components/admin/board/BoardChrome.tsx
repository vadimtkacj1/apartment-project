'use client';

/**
 * Shared chrome for a customisable board: the header buttons that toggle edit
 * mode, the in-page hint shown while editing, and the scoped CSS for the widget
 * frames. Kept apart from WidgetBoard so a page can place the buttons in its own
 * header component.
 */

import React from 'react';
import { Check, LayoutGrid, Plus, RotateCcw } from 'lucide-react';

import { Button } from '@/components/shadcn/button';

import type { BoardLabels } from './types';

export function BoardControls({
  editing,
  onEdit,
  onDone,
  onAdd,
  onReset,
  canReset,
  labels,
}: {
  editing: boolean;
  onEdit: () => void;
  onDone: () => void;
  onAdd: () => void;
  onReset: () => void;
  canReset: boolean;
  labels: BoardLabels;
}) {
  if (!editing) {
    return (
      <Button type="button" variant="outline" onClick={onEdit}>
        <LayoutGrid className="size-4" />
        {labels.customize}
      </Button>
    );
  }
  return (
    <>
      <Button type="button" variant="outline" onClick={onAdd}>
        <Plus className="size-4" />
        {labels.addBlock}
      </Button>
      <Button type="button" variant="outline" onClick={onReset} disabled={!canReset}>
        <RotateCcw className="size-4" />
        {labels.resetLayout}
      </Button>
      <Button type="button" onClick={onDone}>
        <Check className="size-4" />
        {labels.doneEditing}
      </Button>
    </>
  );
}

export function BoardHint({ labels }: { labels: BoardLabels }) {
  return (
    <div className="admin-board-hint" role="status">
      <LayoutGrid className="size-4 shrink-0" aria-hidden="true" />
      <span>{labels.customizeHint}</span>
    </div>
  );
}

/** Frames, drag handle and hint styling. Rendered once per board page. */
export function BoardStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
.admin-board-hint{display:flex;align-items:center;gap:8px;margin-bottom:20px;padding:10px 14px;border-radius:12px;font-size:13px;font-weight:600;color:#2A69C4;background:rgba(85,148,241,.10);border:1px solid rgba(85,148,241,.28);}
/* Edit mode: the whole block is the drag surface, so it carries the grab cursor
   and opts out of touch scrolling. */
.admin-widget.is-editing{border:1px dashed rgba(53,74,196,.45);border-radius:16px;padding:8px;background:rgba(53,74,196,.025);cursor:grab;touch-action:none;}
.admin-widget.is-editing:hover{border-color:rgba(53,74,196,.7);background:rgba(53,74,196,.05);}
/* The empty slot left behind while the card itself follows the cursor — reads
   as a drop zone in both read and edit mode. */
.admin-widget.is-placeholder>*{visibility:hidden;}
.admin-widget.is-placeholder{border:2px dashed rgba(53,74,196,.5);border-radius:16px;background:rgba(53,74,196,.06);min-block-size:96px;}
.admin-widget-bar{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.admin-widget-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:700;color:#051150;}
.admin-widget-pos{margin-inline-start:8px;font-size:11px;font-weight:600;color:#6C76A0;font-variant-numeric:tabular-nums;unicode-bidi:isolate;}
.admin-widget-tools{display:flex;align-items:center;gap:4px;cursor:default;}
.admin-widget-handle{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;flex-shrink:0;border-radius:8px;border:1px solid var(--border,#e4e8f2);background:#fff;color:#354AC4;cursor:grab;touch-action:none;}
.admin-widget-handle:active{cursor:grabbing;}
.admin-widget-handle:focus-visible{outline:2px solid var(--brand,#354ac4);outline-offset:2px;}
/* Read mode: a quiet corner grip that fades in on hover, so a card can be
   moved without entering customise mode while staying fully clickable. */
.admin-widget-grip{position:absolute;inset-block-start:-10px;inset-inline-start:-10px;z-index:5;display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;border:1px solid var(--border,#e4e8f2);background:#fff;color:#354AC4;box-shadow:0 6px 16px -8px rgba(5,17,80,.45);cursor:grab;touch-action:none;opacity:0;transform:scale(.9);transition:opacity .15s ease,transform .15s ease;}
.admin-widget:hover>.admin-widget-grip,.admin-widget-grip:focus-visible{opacity:1;transform:none;}
.admin-widget-grip:active{cursor:grabbing;}
.admin-widget-grip:focus-visible{outline:2px solid var(--brand,#354ac4);outline-offset:2px;}
@media (hover:none){.admin-widget-grip{display:none;}}
/* While a drag is in flight nothing on the board should select or react. */
.admin-board.is-dragging{user-select:none;-webkit-user-select:none;}
.admin-board.is-dragging .admin-widget:not(.is-placeholder){cursor:grabbing;}
.admin-board.is-dragging .admin-widget-grip{opacity:0;}
/* The lifted copy under the cursor — the real card, slightly raised. */
.admin-widget-preview{position:relative;cursor:grabbing;transform:scale(1.015);filter:drop-shadow(0 22px 40px rgba(5,17,80,.28));}
/* Tall cards are clipped so the dragged copy stays manageable; the fade keeps
   the cut from looking like a rendering glitch. */
.admin-widget-preview .admin-widget-preview-body{pointer-events:none;max-height:420px;overflow:hidden;border-radius:14px;-webkit-mask-image:linear-gradient(to bottom,#000 78%,transparent 100%);mask-image:linear-gradient(to bottom,#000 78%,transparent 100%);}
.admin-widget-preview-grip{position:absolute;inset-block-start:-14px;inset-inline-start:12px;z-index:2;display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:999px;background:#354AC4;color:#fff;font-size:11.5px;font-weight:700;box-shadow:0 10px 20px -10px rgba(5,17,80,.6);max-inline-size:min(80%,320px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
`,
      }}
    />
  );
}
