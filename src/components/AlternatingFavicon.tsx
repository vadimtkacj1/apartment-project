'use client';

import { useEffect } from 'react';

export default function AlternatingFavicon() {
  useEffect(() => {
    const href = '/favicon.png';

    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      link.href = href;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = href;
      document.head.appendChild(newLink);
    }
  }, []);

  return null;
}
