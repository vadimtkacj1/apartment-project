'use client';

import { Inbox, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/shadcn/button';

/**
 * Branded empty state for admin tables. Replaces antd's bare "No data" with an
 * icon, a clear message and an optional "add new" call-to-action — so an empty
 * list guides the next step instead of being a dead end (NN/g guidance).
 */
export default function AdminEmptyState({
  message,
  addHref,
  addLabel,
}: {
  message: string;
  addHref?: string;
  addLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-9 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="size-7" aria-hidden="true" />
      </span>
      <p className="m-0 text-sm text-muted-foreground">{message}</p>
      {addHref && addLabel && (
        <Button asChild className="mt-1">
          <Link href={addHref}>
            <Plus className="size-4" />
            {addLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
