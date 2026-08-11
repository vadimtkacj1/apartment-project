'use client';

/**
 * Drag-and-drop board shared by the admin dashboard and the analytics console.
 *
 * Read mode is plain cards — indistinguishable from a hand-written layout. Edit
 * mode adds a toolbar per block (drag handle, width, hide), turns the content
 * inert so a drag never lands on a chart tooltip, and makes the WHOLE block a
 * drag surface (the handle stays as the keyboard activator: focus → Space →
 * arrows → Space). The block being dragged leaves a dashed placeholder behind
 * and follows the cursor as a light chip, so heavy charts never drag around.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronLeft, ChevronRight, EyeOff, GripVertical } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

import { useBoardTransitions } from './useBoardTransitions';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/shadcn/select';

import { WIDGET_SPANS, type BoardLabels, type BoardLayoutItem, type BoardWidgetDef, type WidgetSpan } from './types';

/** Static class names so Tailwind keeps them in the build. */
const SPAN_CLASS: Record<WidgetSpan, string> = {
  2: 'lg:col-span-2',
  3: 'lg:col-span-3',
  4: 'lg:col-span-4',
  6: 'lg:col-span-6',
};

export function spanLabel(labels: BoardLabels, span: WidgetSpan): string {
  switch (span) {
    case 2: return labels.widthThird;
    case 3: return labels.widthHalf;
    case 4: return labels.widthTwoThirds;
    default: return labels.widthFull;
  }
}

interface SortableWidgetProps<Ctx> {
  def: BoardWidgetDef<Ctx>;
  span: WidgetSpan;
  editing: boolean;
  ctx: Ctx;
  labels: BoardLabels;
  position: number;
  total: number;
  rtl: boolean;
  /** Read-mode grip; mounted only on the client (its aria ids are generated). */
  showGrip: boolean;
  onSpanChange: (id: string, span: WidgetSpan) => void;
  onHide: (id: string) => void;
  onStep: (id: string, delta: -1 | 1) => void;
}

function SortableWidget<Ctx>({
  def, span, editing, ctx, labels, position, total, rtl, showGrip, onSpanChange, onHide, onStep,
}: SortableWidgetProps<Ctx>) {
  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging,
  } = useSortable({
    id: def.id,
    // Reordering is available in read mode too (via the corner grip), so the
    // sortable itself is never disabled.
    transition: { duration: 260, easing: 'cubic-bezier(.22, 1, .36, 1)' },
  });

  const title = def.title(ctx);
  const allowed = def.allowedSpans ?? WIDGET_SPANS;
  const body = def.render(ctx);

  // dnd-kit types its listener map loosely; split the two activators we need —
  // pointer on the drag surface, keyboard on the handle.
  const onDragPointerDown = listeners?.onPointerDown as React.PointerEventHandler<HTMLElement> | undefined;
  const onDragKeyDown = listeners?.onKeyDown as React.KeyboardEventHandler<HTMLButtonElement> | undefined;

  // Toward the start of the board / toward the end — mirrored for RTL so the
  // arrow always points where the block will actually go.
  const PrevIcon = rtl ? ChevronRight : ChevronLeft;
  const NextIcon = rtl ? ChevronLeft : ChevronRight;

  return (
    <div
      ref={setNodeRef}
      data-widget-id={def.id}
      className={cn(
        'admin-widget relative flex min-w-0 flex-col',
        SPAN_CLASS[span],
        editing && 'is-editing',
        isDragging && 'is-placeholder'
      )}
      style={{
        // Translate only (never scale) so charts inside keep their proportions.
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      // In edit mode the whole block is the drag surface; the toolbar controls
      // below stop propagation so clicking them never starts a drag.
      onPointerDown={editing ? onDragPointerDown : undefined}
    >
      {/* Read mode keeps the card fully interactive — only this corner grip,
          which fades in on hover/focus, starts a drag. */}
      {!editing && showGrip && (
        <button
          type="button"
          ref={setActivatorNodeRef}
          className="admin-widget-grip"
          aria-label={labels.dragBlock(title)}
          title={labels.dragBlock(title)}
          onPointerDown={onDragPointerDown}
          onKeyDown={onDragKeyDown}
          {...attributes}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
      )}

      {editing && (
        <div className="admin-widget-bar">
          <button
            type="button"
            ref={setActivatorNodeRef}
            className="admin-widget-handle"
            aria-label={labels.dragBlock(title)}
            title={labels.dragBlock(title)}
            onKeyDown={onDragKeyDown}
            {...attributes}
          >
            <GripVertical className="size-4" aria-hidden="true" />
          </button>
          <span className="admin-widget-name">
            {title}
            <span className="admin-widget-pos">{position}/{total}</span>
          </span>
          <div className="admin-widget-tools" onPointerDown={(e) => e.stopPropagation()}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-1.5"
              onClick={() => onStep(def.id, -1)}
              disabled={position === 1}
              aria-label={labels.moveEarlier(title)}
              title={labels.moveEarlier(title)}
            >
              <PrevIcon className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-1.5"
              onClick={() => onStep(def.id, 1)}
              disabled={position === total}
              aria-label={labels.moveLater(title)}
              title={labels.moveLater(title)}
            >
              <NextIcon className="size-4" aria-hidden="true" />
            </Button>
            <Select value={String(span)} onValueChange={(v) => onSpanChange(def.id, Number(v) as WidgetSpan)}>
              <SelectTrigger className="h-8 w-29 text-xs" aria-label={labels.blockWidth}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allowed.map((s) => (
                  <SelectItem key={s} value={String(s)}>{spanLabel(labels, s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => onHide(def.id)}
              aria-label={labels.hideBlock(title)}
              title={labels.hideBlock(title)}
            >
              <EyeOff className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      <div
        className={cn('min-w-0 flex-1', editing && 'pointer-events-none select-none')}
        aria-hidden={editing || undefined}
      >
        {def.bare ? (
          body
        ) : (
          <Card className="ec-card h-full p-6">
            {/* While editing the toolbar above already names the block. */}
            {!editing && <div className="mb-4" style={{ fontWeight: 600 }}>{title}</div>}
            <div className="min-w-0 overflow-x-auto">{body}</div>
          </Card>
        )}
      </div>
    </div>
  );
}

export interface WidgetBoardProps<Ctx> {
  items: BoardLayoutItem[];
  widgets: BoardWidgetDef<Ctx>[];
  ctx: Ctx;
  labels: BoardLabels;
  editing: boolean;
  rtl?: boolean;
  onMove: (activeId: string, overId: string) => void;
  onSpanChange: (id: string, span: WidgetSpan) => void;
  onHide: (id: string) => void;
}

export default function WidgetBoard<Ctx>({
  items, widgets, ctx, labels, editing, rtl = false, onMove, onSpanChange, onHide,
}: WidgetBoardProps<Ctx>) {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Width of the block being dragged, so the floating copy matches it exactly.
  const [activeWidth, setActiveWidth] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // dnd-kit stamps generated aria ids on the activator, which would not match
  // the server-rendered markup — so the read-mode grip appears after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cards glide to their new slots when one is added, hidden or resized.
  useBoardTransitions(gridRef, { enabled: !activeId && !reduced });

  const sensors = useSensors(
    // A few px of travel before a drag starts, so clicks on the block still work.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const byId = useMemo(
    () => Object.fromEntries(widgets.map((w) => [w.id, w])) as Record<string, BoardWidgetDef<Ctx>>,
    [widgets]
  );
  const ids = useMemo(() => items.map((i) => i.id), [items]);

  const nameOf = (id: string | number) => {
    const def = byId[String(id)];
    return def ? def.title(ctx) : String(id);
  };
  const positionOf = (id: string | number) => ids.indexOf(String(id)) + 1;

  // Localised screen-reader narration (dnd-kit's defaults are English-only).
  const announcements: Announcements = {
    onDragStart: ({ active }) => labels.dndPickedUp(nameOf(active.id), positionOf(active.id), ids.length),
    onDragOver: ({ active, over }) => (over ? labels.dndMoved(nameOf(active.id), positionOf(over.id), ids.length) : undefined),
    onDragEnd: ({ active, over }) => (over ? labels.dndDropped(nameOf(active.id), positionOf(over.id), ids.length) : labels.dndCancelled(nameOf(active.id))),
    onDragCancel: ({ active }) => labels.dndCancelled(nameOf(active.id)),
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    setActiveWidth(event.active.rect.current.initial?.width ?? null);
  };

  const endDrag = () => {
    setActiveId(null);
    setActiveWidth(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    endDrag();
    if (over && active.id !== over.id) onMove(String(active.id), String(over.id));
  };

  /** One step toward the start/end of the board — the no-drag path (touch, precision). */
  const stepWidget = (id: string, delta: -1 | 1) => {
    const from = ids.indexOf(id);
    const to = from + delta;
    if (from === -1 || to < 0 || to >= ids.length) return;
    onMove(id, ids[to]);
  };

  const activeDef = activeId ? byId[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={endDrag}
      accessibility={{ announcements, screenReaderInstructions: { draggable: labels.dndInstructions } }}
      // Blocks change height as they change width — always re-measure.
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      // Long boards: pull the page along when the cursor nears an edge.
      autoScroll={{ threshold: { x: 0, y: 0.18 }, acceleration: 14 }}
    >
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <div
          ref={gridRef}
          className={cn('admin-board grid grid-cols-1 gap-6 lg:grid-cols-6', activeId && 'is-dragging')}
        >
          {items.map((item, index) => {
            const def = byId[item.id];
            if (!def) return null;
            return (
              <SortableWidget
                key={def.id}
                def={def}
                span={item.span}
                editing={editing}
                ctx={ctx}
                labels={labels}
                position={index + 1}
                total={items.length}
                rtl={rtl}
                showGrip={mounted}
                onSpanChange={onSpanChange}
                onHide={onHide}
                onStep={stepWidget}
              />
            );
          })}
        </div>
      </SortableContext>

      {/* The card itself, lifted off the board and following the cursor. It is
          mounted once per drag (dnd-kit only moves it), so even a chart block
          costs one render rather than one per pointer move. */}
      <DragOverlay
        dropAnimation={{ duration: 220, easing: 'cubic-bezier(.22, 1, .36, 1)' }}
        style={activeWidth ? { width: activeWidth } : undefined}
      >
        {activeDef ? (
          <div className="admin-widget-preview">
            <span className="admin-widget-preview-grip">
              <GripVertical className="size-4" aria-hidden="true" />
              {activeDef.title(ctx)}
            </span>
            <div className="admin-widget-preview-body">
              {activeDef.bare ? (
                activeDef.render(ctx)
              ) : (
                <Card className="ec-card h-full p-6">
                  <div className="mb-4" style={{ fontWeight: 600 }}>{activeDef.title(ctx)}</div>
                  <div className="min-w-0 overflow-hidden">{activeDef.render(ctx)}</div>
                </Card>
              )}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
