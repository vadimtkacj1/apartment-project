'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Button, Spin, Typography } from 'antd';
import {
  HomeOutlined,
  PhoneOutlined,
  PlusOutlined,
  ShoppingOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Title } = Typography;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    forSale: 0,
    forRent: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/properties');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      const properties = await response.json();

      const total = properties.length;
      const forSale = properties.filter((p: any) => p.dealType === 'sale').length;
      const forRent = properties.filter((p: any) => p.dealType === 'rent').length;
      const active = properties.filter((p: any) => p.isActive).length;

      setStats({ total, forSale, forRent, active });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ total: 0, forSale: 0, forRent: 0, active: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-0">
      <Title level={2} style={{ marginBottom: '16px', color: '#141414', fontSize: 'clamp(1.25rem, 5vw, 1.5rem)' }}>
        לוח בקרה
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{ borderTop: '3px solid #1890ff' }}
              >
                <Statistic
                  title={<span style={{ color: '#595959', fontWeight: 600 }}>סה״כ נכסים במערכת</span>}
                  value={stats.total}
                  prefix={<AppstoreOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#141414', fontWeight: 700, fontSize: '28px' }}
                />
                <div style={{ marginTop: '12px' }}>
                  <Link href="/admin/properties" style={{ color: '#1890ff', fontWeight: 600, fontSize: '13px' }}>
                    צפה בהכל ←
                  </Link>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{ borderTop: '3px solid #52c41a' }}
              >
                <Statistic
                  title={<span style={{ color: '#595959', fontWeight: 600 }}>נכסים למכירה</span>}
                  value={stats.forSale}
                  prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
                  valueStyle={{ color: '#141414', fontWeight: 700, fontSize: '28px' }}
                />
                <div style={{ marginTop: '12px' }}>
                  <Link href="/admin/properties?type=sale" style={{ color: '#52c41a', fontWeight: 600, fontSize: '13px' }}>
                    צפה בהכל ←
                  </Link>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{ borderTop: '3px solid #1890ff' }}
              >
                <Statistic
                  title={<span style={{ color: '#595959', fontWeight: 600 }}>נכסים להשכרה</span>}
                  value={stats.forRent}
                  prefix={<KeyOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#141414', fontWeight: 700, fontSize: '28px' }}
                />
                <div style={{ marginTop: '12px' }}>
                  <Link href="/admin/properties?type=rent" style={{ color: '#1890ff', fontWeight: 600, fontSize: '13px' }}>
                    צפה בהכל ←
                  </Link>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{ borderTop: '3px solid #faad14' }}
              >
                <Statistic
                  title={<span style={{ color: '#595959', fontWeight: 600 }}>נכסים פעילים</span>}
                  value={stats.active}
                  prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />}
                  valueStyle={{ color: '#141414', fontWeight: 700, fontSize: '28px' }}
                />
                <div style={{ marginTop: '12px' }}>
                  <Link href="/admin/properties" style={{ color: '#faad14', fontWeight: 600, fontSize: '13px' }}>
                    צפה בהכל ←
                  </Link>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
