'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Select,
  Modal,
  message,
  Statistic,
  Space,
  Switch,
  Table,
  Image,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

interface Owner {
  id: number;
  name: string;
  title: string;
  image: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await fetch('/api/admin/owners');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      console.error('Error fetching owners:', error);
      setOwners([]);
      message.error('שגיאה בטעינת הבעלים');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = owners.length;
    const active = owners.filter((o) => o.isActive).length;
    const inactive = owners.filter((o) => !o.isActive).length;
    return { total, active, inactive };
  }, [owners]);

  const filteredOwners = useMemo(() => {
    return owners.filter((owner) => {
      const matchesSearch =
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.email && owner.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && owner.isActive) ||
        (filterStatus === 'inactive' && !owner.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [owners, searchTerm, filterStatus]);

  const handleDelete = async () => {
    if (!selectedOwner) return;
    try {
      const response = await fetch(`/api/admin/owners/${selectedOwner}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setDeleteModal(false);
      setSelectedOwner(null);
      fetchOwners();
      message.success('הבעלים נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting owner:', error);
      message.error('שגיאה במחיקת הבעלים. נסה שוב.');
    }
  };

  const handleStatusChange = async (ownerId: number, value: boolean) => {
    try {
      const owner = owners.find((o) => o.id === ownerId);
      if (!owner) return;
      const response = await fetch(`/api/admin/owners/${ownerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...owner, isActive: value }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchOwners();
      message.success(value ? 'הבעלים הופעל' : 'הבעלים הושבת');
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('שגיאה בעדכון הסטטוס. נסה שוב.');
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-0">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="text-4xl font-bold" style={{ margin: 0 }}>ניהול בעלים</h1>
        <Link href="/admin/owners/new" className="w-full sm:w-auto">
          <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full sm:w-auto">
            הוסף בעלים חדש
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card><Statistic title="סה״כ בעלים" value={stats.total} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card><Statistic title="בעלים פעילים" value={stats.active} valueStyle={{ color: '#3f8600' }} /></Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card><Statistic title="בעלים לא פעילים" value={stats.inactive} valueStyle={{ color: '#cf1322' }} /></Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input
            placeholder="חפש לפי שם או אימייל..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ minWidth: 120, width: '100%', maxWidth: '200px' }}
            size="large"
          >
            <Select.Option value="all">כל הסטטוסים</Select.Option>
            <Select.Option value="active">פעיל</Select.Option>
            <Select.Option value="inactive">לא פעיל</Select.Option>
          </Select>
        </Space>
      </Card>

      {/* Owners Table */}
      <Card>
        <Table
          dataSource={filteredOwners}
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `סה״כ ${total} בעלים`,
          }}
          scroll={{ x: 1000 }}
          locale={{ emptyText: 'לא נמצאו בעלים' }}
          columns={[
            {
              title: 'תמונה',
              dataIndex: 'image',
              key: 'image',
              width: 80,
              render: (image: string | null) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {image ? (
                    <Image
                      src={image}
                      alt="Owner"
                      width={60}
                      height={60}
                      preview={false}
                      style={{
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #d9d9d9',
                      }}
                      fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='%23e5e7eb'/%3E%3C/svg%3E"
                    />
                  ) : (
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <UserOutlined style={{ fontSize: '24px', color: '#bfbfbf' }} />
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: 'שם',
              dataIndex: 'name',
              key: 'name',
              width: 150,
            },
            {
              title: 'תפקיד',
              dataIndex: 'title',
              key: 'title',
              width: 200,
            },
            {
              title: 'אימייל',
              dataIndex: 'email',
              key: 'email',
              width: 200,
              render: (email: string | null) => email || '-',
            },
            {
              title: 'טלפון',
              dataIndex: 'phone',
              key: 'phone',
              width: 120,
              render: (phone: string | null) => phone || '-',
            },
            {
              title: 'WhatsApp',
              dataIndex: 'whatsapp',
              key: 'whatsapp',
              width: 120,
              render: (whatsapp: string | null) => whatsapp || '-',
            },
            {
              title: 'סדר',
              dataIndex: 'order',
              key: 'order',
              width: 80,
              align: 'center',
            },
            {
              title: 'סטטוס',
              key: 'status',
              width: 100,
              align: 'center',
              render: (_, record: Owner) => (
                <Switch
                  checked={record.isActive}
                  onChange={(v) => handleStatusChange(record.id, v)}
                  checkedChildren="פעיל"
                  unCheckedChildren="כבוי"
                />
              ),
            },
            {
              title: 'פעולות',
              key: 'actions',
              width: 150,
              render: (_, record: Owner) => (
                <Space size={4}>
                  <Link href={`/admin/owners/${record.id}`}>
                    <Button type="primary" icon={<EditOutlined />} size="small">
                      ערוך
                    </Button>
                  </Link>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => {
                      setSelectedOwner(record.id);
                      setDeleteModal(true);
                    }}
                  >
                    מחק
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        title="אישור מחיקה"
        open={deleteModal}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModal(false);
          setSelectedOwner(null);
        }}
        okText="מחק"
        cancelText="ביטול"
        okButtonProps={{ danger: true }}
      >
        <p>האם אתה בטוח שברצונך למחוק בעלים זה?</p>
      </Modal>
    </div>
  );
}
