'use client';

import { Layout } from 'antd';

export default function Footer() {
  const { Footer: AntFooter } = Layout;
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
          color: '#9aa0aa',
          fontSize: 12.5,
        }}
      >
        <span>© {year} רם נכסים · כל הזכויות שמורות</span>
        <span style={{ color: '#b08642', fontWeight: 600 }}>מערכת ניהול נכסים</span>
      </div>
    </AntFooter>
  );
}
