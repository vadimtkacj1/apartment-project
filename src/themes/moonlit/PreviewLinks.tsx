'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Paths the preview route can actually render (see
 * src/app/theme-preview/[theme]/[[...rest]]/page.tsx). Anything else — a policy
 * page, a single article, an admin-added menu entry — is left alone: escaping
 * to the live theme beats a 404 inside the preview.
 */
const PREVIEWABLE = /^\/(?:apartments(?:\/\d+)?|about|articles)?$/;

/**
 * Keeps a theme preview session inside the preview.
 *
 * The preview must not change what visitors see, so the active theme stays
 * whatever the admin picked. That means every normal link (a property, the
 * catalogue, the menu) would drop you back onto the live theme mid-browse.
 * This rewrites those clicks to the matching /theme-preview/<theme>/... route,
 * so the whole site can be walked through in the theme without switching it on.
 */
export default function PreviewLinks({ theme }: { theme: string }) {
  const router = useRouter();

  useEffect(() => {
    const base = `/theme-preview/${theme}`;

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;
      if (anchor.target && anchor.target !== '_self') return; // opens elsewhere anyway
      if (anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/')) return; // external, mailto:, tel:, #anchor

      const path = href.replace(/[?#].*$/, '').replace(/(.)\/$/, '$1');
      if (!PREVIEWABLE.test(path)) return;

      // Capture phase, so this lands BEFORE next/link's own handler: Link calls
      // preventDefault() and navigates on its way up, and a document-level
      // listener would arrive too late (and bail on defaultPrevented) — which is
      // exactly how property cards used to escape the preview.
      e.preventDefault();
      e.stopPropagation();
      router.push(base + href);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router, theme]);

  return null;
}
