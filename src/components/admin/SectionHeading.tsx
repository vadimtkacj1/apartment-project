import React from 'react';

/**
 * Shared section heading for admin pages (matches AdminPageHeader's ink
 * title). Top margin separates it from the previous section; the smaller
 * bottom margin keeps it visually attached to its own cards.
 */
export default function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: '24px 2px 16px' }}>
      <div style={{ fontWeight: 700, color: '#051150', fontSize: 18, letterSpacing: '-0.01em' }}>
        {children}
      </div>
    </div>
  );
}
