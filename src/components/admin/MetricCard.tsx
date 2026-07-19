import React from 'react';
import { Card } from 'antd';

/**
 * Shared admin KPI tile — one identical stat-card language on every admin page
 * (dashboard / properties / inquiries / owners / team / analytics).
 *
 * Layout (Polar / Fernand analytics style): an accent icon in a tinted chip,
 * a muted label above, and a big deep-navy ink value with tabular figures.
 * Colour lives only in the icon chip so the numbers stay calm and scannable.
 */
export default function MetricCard({
  icon,
  label,
  value,
  suffix,
  accent = '#354AC4',
}: {
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: number | string;
  suffix?: string;
  accent?: string;
}) {
  return (
    <Card style={{ height: '100%' }}>
      {/* Text at the inline-start, icon chip in the opposite corner — fills the
          tile's width instead of clustering everything at one edge. */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ color: '#64748B', fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>{label}</div>
          <div
            dir="ltr"
            style={{
              color: '#051150',
              fontSize: 27,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              unicodeBidi: 'isolate',
              textAlign: 'start',
            }}
          >
            {typeof value === 'number' ? value.toLocaleString('en-US') : value}
            {suffix ? <span style={{ fontSize: 17, color: '#64748B', fontWeight: 700 }}>{suffix}</span> : null}
          </div>
        </div>
        {icon ? (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 42,
              height: 42,
              borderRadius: 12,
              flexShrink: 0,
              background: `${accent}16`,
              color: accent,
              fontSize: 19,
            }}
          >
            {icon}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
