'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BRAND } from '@/lib/adminTheme';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Select,
  Modal,
  App,
  Statistic,
  Space,
  Switch,
  Table,
  Image,
  Skeleton,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { useAdminMessages } from '@/lib/adminI18n';
import { ownersMessages } from '@/lib/adminI18n/messages/owners';

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
  const { message } = App.useApp();
  const t = useAdminMessages(ownersMessages);
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
      message.error(t.loadListError);
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
      message.success(t.deleteSuccess);
    } catch (error) {
      console.error('Error deleting owner:', error);
      message.error(t.deleteError);
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
      message.success(value ? t.activatedSuccess : t.deactivatedSuccess);
    } catch (error) {
      console.error('Error updating status:', error);
      message.error(t.statusUpdateError);
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-0">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="text-4xl font-bold" style={{ margin: 0 }}>{t.title}</h1>
        <Link href="/admin/owners/new" className="w-full sm:w-auto">
          <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full sm:w-auto">
            {t.addNew}
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card><Statistic title={t.statTotal} value={stats.total} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card><Statistic title={t.statActive} value={stats.active} styles={{ content: { color: BRAND.success } }} /></Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card><Statistic title={t.statInactive} value={stats.inactive} styles={{ content: { color: BRAND.danger } }} /></Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <Space vertical style={{ width: '100%' }} size="middle">
          <Input
            placeholder={t.searchPlaceholder}
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
            <Select.Option value="all">{t.filterAllStatuses}</Select.Option>
            <Select.Option value="active">{t.statusActive}</Select.Option>
            <Select.Option value="inactive">{t.statusInactive}</Select.Option>
          </Select>
        </Space>
      </Card>

      {/* Owners Table — desktop */}
      <div className="admin-only-desktop">
      <Card>
        <Table
          dataSource={filteredOwners}
          loading={loading}
          rowKey="id"
          size="middle"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => t.paginationTotal(total),
          }}
          scroll={{ x: 1000 }}
          locale={{ emptyText: <AdminEmptyState message={t.emptyMessage} addHref="/admin/owners/new" addLabel={t.emptyAddLabel} /> }}
          columns={[
            {
              title: t.colImage,
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
              title: t.fieldName,
              dataIndex: 'name',
              key: 'name',
              width: 150,
            },
            {
              title: t.fieldRole,
              dataIndex: 'title',
              key: 'title',
              width: 200,
            },
            {
              title: t.fieldEmail,
              dataIndex: 'email',
              key: 'email',
              width: 200,
              render: (email: string | null) => email || '-',
            },
            {
              title: t.fieldPhone,
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
              title: t.fieldOrder,
              dataIndex: 'order',
              key: 'order',
              width: 80,
              align: 'center',
            },
            {
              title: t.fieldStatus,
              key: 'status',
              width: 100,
              align: 'center',
              render: (_, record: Owner) => (
                <Switch
                  checked={record.isActive}
                  onChange={(v) => handleStatusChange(record.id, v)}
                  checkedChildren={t.statusActive}
                  unCheckedChildren={t.switchOff}
                />
              ),
            },
            {
              title: t.colActions,
              key: 'actions',
              width: 150,
              render: (_, record: Owner) => (
                <Space size={4}>
                  <Link href={`/admin/owners/${record.id}`}>
                    <Button type="primary" icon={<EditOutlined />} size="small">
                      {t.edit}
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
                    {t.delete}
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
      </div>

      {/* Owners — mobile card list */}
      <div className="admin-only-mobile">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : filteredOwners.length === 0 ? (
          <AdminEmptyState message={t.emptyMessage} addHref="/admin/owners/new" addLabel={t.emptyAddLabel} />
        ) : (
          <div className="admin-card-list">
            {filteredOwners.map((owner) => (
              <div key={owner.id} className="admin-card">
                <div className="admin-card__head">
                  {owner.image ? (
                    <img className="admin-card__thumb" src={owner.image} alt={owner.name} />
                  ) : (
                    <div
                      className="admin-card__thumb"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f0f0f0',
                      }}
                    >
                      <UserOutlined style={{ fontSize: '22px', color: '#bfbfbf' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-card__title">{owner.name}</div>
                    <div className="admin-card__meta">{owner.title}</div>
                  </div>
                </div>
                <div className="admin-card__fields">
                  {owner.phone && <span><b>{t.fieldPhone}</b> <span dir="ltr">{owner.phone}</span></span>}
                  {owner.whatsapp && <span><b>WhatsApp</b> <span dir="ltr">{owner.whatsapp}</span></span>}
                  {owner.email && <span><b>{t.fieldEmail}</b> <span dir="ltr">{owner.email}</span></span>}
                  <span><b>{t.fieldOrder}</b> {owner.order}</span>
                </div>
                <div className="admin-card__actions">
                  <Switch
                    checked={owner.isActive}
                    onChange={(v) => handleStatusChange(owner.id, v)}
                    checkedChildren={t.statusActive}
                    unCheckedChildren={t.switchOff}
                  />
                  <span className="admin-card__grow">
                    <Link href={`/admin/owners/${owner.id}`}>
                      <Button type="primary" icon={<EditOutlined />}>{t.edit}</Button>
                    </Link>
                  </span>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setSelectedOwner(owner.id);
                      setDeleteModal(true);
                    }}
                  >
                    {t.delete}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title={t.deleteConfirmTitle}
        open={deleteModal}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModal(false);
          setSelectedOwner(null);
        }}
        okText={t.delete}
        cancelText={t.cancel}
        okButtonProps={{ danger: true }}
      >
        <p>{t.deleteConfirmBody}</p>
      </Modal>
    </div>
  );
}
