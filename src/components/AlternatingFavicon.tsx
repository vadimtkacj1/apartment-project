'use client';

import { useEffect } from 'react';

export default function AlternatingFavicon() {
  useEffect(() => {
    const favicons = ['/favicon-ha.png', '/favicon-rm.png'];
    let currentIndex = 0;

    // Update favicon function
    const updateFavicon = (href: string) => {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (link) {
        link.href = href;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = href;
        document.head.appendChild(newLink);
      }
    };

    // Set initial favicon
    updateFavicon(favicons[0]);

    // Alternate every 3 seconds
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % favicons.length;
      updateFavicon(favicons[currentIndex]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
