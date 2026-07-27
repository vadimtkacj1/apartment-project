'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('/')) return; // external, mailto:, tel:, #anchor
      if (href.startsWith(base) || href.startsWith('/admin') || href.startsWith('/themes')) return;

      e.preventDefault();
      router.push(base + href);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router, theme]);

  return null;
}
