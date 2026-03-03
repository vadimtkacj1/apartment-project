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
        // Страница уже загружена (например, кэш)
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
        background: '#faf7f2',
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Логотип / название */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-caramel), cursive',
            fontSize: '28px',
            color: '#1c3664',
            letterSpacing: '0.05em',
          }}
        >
          רם נכסים
        </div>
      </div>

      {/* Спиннер */}
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        {/* Внешнее кольцо */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid #e8e0d4',
            borderTopColor: '#1c3664',
            animation: 'page-spin 0.9s linear infinite',
          }}
        />
        {/* Внутреннее кольцо */}
        <div
          style={{
            position: 'absolute',
            inset: '10px',
            borderRadius: '50%',
            border: '3px solid #e8e0d4',
            borderBottomColor: '#c9a96e',
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

