'use client';

import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';

/**
 * Branded empty state for admin tables. Replaces antd's bare "No data" /
 * plain-text `emptyText` with an icon, a clear message and an optional
 * "add new" call-to-action — so an empty list guides the next step instead
 * of being a dead end (NN/g empty-state guidance).
 */
export default function AdminEmptyState({
  message,
  addHref,
  addLabel,
}: {
  message: string;
  addHref?: string;
  addLabel?: string;
}) {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={<span style={{ color: '#8c8c8c' }}>{message}</span>}
      style={{ padding: '36px 0' }}
    >
      {addHref && addLabel && (
        <Link href={addHref}>
          <Button type="primary" icon={<PlusOutlined />}>
            {addLabel}
          </Button>
        </Link>
      )}
    </Empty>
  );
}
