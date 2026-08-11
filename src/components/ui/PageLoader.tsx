'use client';

import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const hide = () => {
      setFadeOut(true);
      // Faster fade out on mobile
      const isMobile = window.innerWidth < 768;
      setTimeout(() => setVisible(false), isMobile ? 200 : 500);
    };

    // On mobile, hide faster to improve perceived performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Hide after DOM is ready, don't wait for all resources
      if (document.readyState === 'interactive' || document.readyState === 'complete') {
        setTimeout(hide, 300);
      } else {
        document.addEventListener('DOMContentLoaded', () => setTimeout(hide, 300));
      }
    } else {
      if (document.readyState === 'complete') {
        // Page already loaded (e.g., from cache)
        hide();
      } else {
        window.addEventListener('load', hide);
        return () => window.removeEventListener('load', hide);
      }
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f7fb',
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Logo / Title */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <img
          src="/aiterra-dark-logo.png"
          alt=""
          width={150}
          height={53}
          aria-hidden="true"
          style={{ display: 'block', margin: '0 auto 12px' }}
        />
        <div
          style={{
            fontFamily: 'var(--font-caramel), cursive',
            fontSize: '28px',
            color: '#051150',
            letterSpacing: '0.05em',
          }}
        >
          Aiterra
        </div>
      </div>

      {/* Spinner */}
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        {/* Outer ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid #e8e0d4',
            borderTopColor: '#354AC4',
            animation: 'page-spin 0.9s linear infinite',
          }}
        />
        {/* Inner ring */}
        <div
          style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            border: '3px solid #e8e0d4',
            borderBottomColor: '#5594F1',
            animation: 'page-spin 1.4s linear infinite reverse',
          }}
        />
      </div>

      <style>{`
        @keyframes page-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

