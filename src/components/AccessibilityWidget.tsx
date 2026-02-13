'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function AccessibilityWidget() {
  const pathname = usePathname();
  
  // Don't load accessibility widget on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/sienna-accessibility@latest/dist/sienna-accessibility.umd.js"
      strategy="lazyOnload"
    />
  );
}

