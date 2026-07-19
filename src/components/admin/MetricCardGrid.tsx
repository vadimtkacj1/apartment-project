import React from 'react';
import { Row, Col } from 'antd';
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
    <Row gutter={[20, 20]} style={{ marginBottom: 28, ...style }}>
      {items.map((m, i) => (
        <Col key={m.key ?? i} xs={four ? 12 : 24} sm={four ? 12 : 8} lg={four ? 6 : 8}>
          <MetricCard icon={m.icon} label={m.label} value={m.value} suffix={m.suffix} accent={m.accent} />
        </Col>
      ))}
    </Row>
  );
}
