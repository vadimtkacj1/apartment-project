'use client';

import { Layout } from 'antd';
import { useAdminMessages } from '@/lib/adminI18n';
import { navMessages } from '@/lib/adminI18n/messages/nav';

export default function Footer() {
  const { Footer: AntFooter } = Layout;
  const t = useAdminMessages(navMessages);
  const year = new Date().getFullYear();

  return (
    <AntFooter style={{ background: 'transparent', padding: '12px 24px' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          color: '#64748B',
          fontSize: 12.5,
        }}
      >
        <span>{t.footerRights(year)}</span>
        <span style={{ color: '#64748B', fontWeight: 600 }}>{t.footerSystem}</span>
      </div>
    </AntFooter>
  );
}
