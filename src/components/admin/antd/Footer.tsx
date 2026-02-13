'use client';

import { Layout, Row, Col } from 'antd';
import { HeartFilled } from '@ant-design/icons';

export default function Footer() {
  const { Footer: AntFooter } = Layout;

  return (
    <AntFooter style={{ background: 'transparent', padding: '16px 24px' }}>
      <Row>
        <Col xs={24} md={12}>
          <div style={{ color: '#8c8c8c', fontSize: '13px', textAlign: 'center' }}>
            © 2024 מערכת ניהול נכסים {' '}
            <HeartFilled style={{ color: '#f5222d', margin: '0 4px' }} />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div style={{ textAlign: 'center' }}>
            <a href="/admin" style={{ color: '#8c8c8c', fontSize: '13px', textDecoration: 'none' }}>
              לוח בקרה
            </a>
          </div>
        </Col>
      </Row>
    </AntFooter>
  );
}
