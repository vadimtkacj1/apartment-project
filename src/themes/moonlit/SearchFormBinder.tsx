'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Makes the template's search bar work: it lives inside raw template markup, so
 * the handler is attached here. Submitting just rewrites the current URL's query
 * string, which keeps the preview inside the preview and the live catalogue on
 * /apartments.
 */
export default function SearchFormBinder() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const form = document.getElementById('moonlit-search-form') as HTMLFormElement | null;
    if (!form) return;

    const onSubmit = (e: Event) => {
      e.preventDefault();
      const data = new FormData(form);
      const params = new URLSearchParams();
      for (const key of ['dealType', 'city', 'minRooms']) {
        const value = String(data.get(key) ?? '');
        if (value) params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    };

    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, [router, pathname]);

  return null;
}
