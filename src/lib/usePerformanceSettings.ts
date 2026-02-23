"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook to detect mobile devices for performance optimization
 * Optimized with debouncing and memoization
 */
export function usePerformanceSettings() {
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Initial check
    checkMobile();

    // Debounce resize handler for better performance
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    // Listen to window resize
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [checkMobile]);

  return { isMobile };
}
