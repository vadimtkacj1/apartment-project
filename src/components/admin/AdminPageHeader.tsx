import React from 'react';

/**
 * Shared admin page header — one consistent brand moment on every admin page.
 * Ink title (#051150) with tight tracking, an optional muted subtitle, and an
 * optional right-aligned action slot (e.g. an "Add" button). RTL-safe (logical
 * props, text-align:start).
 */
export default function AdminPageHeader({
  title,
  subtitle,
  extra,
  style,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 28,
        ...style,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: '#051150',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle ? (
          <div style={{ color: '#64748B', fontSize: 14, marginTop: 4 }}>{subtitle}</div>
        ) : null}
      </div>
      {extra ? <div style={{ flexShrink: 0 }}>{extra}</div> : null}
    </div>
  );
}
