'use client';

/**
 * Block picker — every widget in the page's registry that is currently hidden,
 * ready to be dropped onto the board. Stays open after a pick so several blocks
 * can be added in one go; the list shrinks as blocks move onto the board. Once
 * the catalogue grows past a handful of blocks a search field filters it.
 */

import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';

import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';

import { spanLabel } from './WidgetBoard';
import type { BoardLabels, BoardWidgetDef } from './types';

const SEARCH_THRESHOLD = 6;

export default function AddWidgetDialog<Ctx>({
  open,
  onOpenChange,
  hidden,
  onAdd,
  ctx,
  labels,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hidden: BoardWidgetDef<Ctx>[];
  onAdd: (id: string) => void;
  ctx: Ctx;
  labels: BoardLabels;
}) {
  const [query, setQuery] = useState('');

  const entries = useMemo(
    () => hidden.map((def) => ({ def, title: def.title(ctx) })),
    [hidden, ctx]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.title.toLowerCase().includes(q));
  }, [entries, query]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setQuery('');
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{labels.addDialogTitle}</DialogTitle>
          <DialogDescription>{labels.addDialogDescription}</DialogDescription>
        </DialogHeader>

        {entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{labels.noHiddenBlocks}</p>
        ) : (
          <>
            {entries.length > SEARCH_THRESHOLD && (
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground" style={{ insetInlineStart: 12 }} />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={labels.searchBlocks}
                  aria-label={labels.searchBlocks}
                  style={{ paddingInlineStart: 36 }}
                />
              </div>
            )}
            <p className="m-0 text-xs text-muted-foreground">{labels.blocksAvailable(entries.length)}</p>

            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">{labels.noSearchResults}</p>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {filtered.map(({ def, title }) => (
                  <li key={def.id}>
                    <button
                      type="button"
                      onClick={() => onAdd(def.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#051150]">{title}</span>
                        <span className="block text-xs text-muted-foreground">{spanLabel(labels, def.defaultSpan)}</span>
                      </span>
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[rgba(53,74,196,.09)] text-[#354AC4]">
                        <Plus className="size-4" aria-hidden="true" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{labels.close}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
