'use client';

import React, { useState } from 'react';

interface AdminAvatarProps {
  src?: string | null;
  name: string;
  className?: string;
}

/**
 * Unified 44px round avatar for the admin "people" pages (owners, team).
 * Shows the image when available; falls back to the first letter of the name
 * on a brand-wash circle instead of an empty gray placeholder.
 */
export default function AdminAvatar({ src, name, className }: AdminAvatarProps) {
  const [broken, setBroken] = useState(false);
  const initial = (name || '').trim().charAt(0);

  return (
    <span
      className={`flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-[var(--brand-wash,#eef1fb)] ${className ?? ''}`}
    >
      {src && !broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          onError={() => setBroken(true)}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden="true" className="text-base font-bold text-primary">
          {initial}
        </span>
      )}
    </span>
  );
}
