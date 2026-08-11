import React from 'react';
import { cn } from '@/lib/utils';
import MetricCard from './MetricCard';

export interface MetricItem {
  key?: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  value: number | string;
  suffix?: string;
  accent?: string;
}

/**
 * Shared KPI row — replaces the hand-rolled <Row><Col><MetricCard/> blocks
 * that every list page repeated. 4+ items: 2-up on phones, 4-up on desktop;
 * 3 items: stacked on phones, 3-up from small screens.
 */
export default function MetricCardGrid({
  items,
  style,
}: {
  items: MetricItem[];
  style?: React.CSSProperties;
}) {
  const four = items.length >= 4;
  return (
    <div
      className={cn('grid gap-5', four ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3')}
      style={{ marginBottom: 28, ...style }}
    >
      {items.map((m, i) => (
        <MetricCard key={m.key ?? i} icon={m.icon} label={m.label} value={m.value} suffix={m.suffix} accent={m.accent} />
      ))}
    </div>
  );
}
