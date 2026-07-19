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
  Skeleton,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import MetricCard from '@/components/admin/MetricCard';
import Link from 'next/link';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
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
    <div>
      {/* Header */}
      <AdminPageHeader
        title={t.title}
        extra={
          <Link href="/admin/owners/new" className="w-full sm:w-auto">
            <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full sm:w-auto">
              {t.addNew}
            </Button>
          </Link>
        }
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <MetricCard icon={<UserOutlined />} label={t.statTotal} value={stats.total} accent="#354AC4" />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <MetricCard icon={<CheckCircleOutlined />} label={t.statActive} value={stats.active} accent="#2A69C4" />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <MetricCard icon={<StopOutlined />} label={t.statInactive} value={stats.inactive} accent="#64748B" />
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
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: <AdminEmptyState message={t.emptyMessage} addHref="/admin/owners/new" addLabel={t.emptyAddLabel} /> }}
          columns={[
            {
              title: t.fieldName,
              key: 'owner',
              width: 260,
              render: (_, record: Owner) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  {record.image ? (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1px solid #E4E8F2',
                        flexShrink: 0,
                        background: '#F4F6FB',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={record.image}
                        alt={record.name}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: '#F4F6FB',
                        border: '1px solid #E4E8F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <UserOutlined style={{ fontSize: 20, color: '#94A3B8' }} />
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/admin/owners/${record.id}`}
                      style={{
                        display: 'block',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#354AC4',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {record.name}
                    </Link>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: '#64748B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {record.title}
                    </div>
                  </div>
                </div>
              ),
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
                    <img className="admin-card__thumb admin-card__thumb--round" src={owner.image} alt={owner.name} />
                  ) : (
                    <div
                      className="admin-card__thumb admin-card__thumb--round"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#F4F6FB',
                      }}
                    >
                      <UserOutlined style={{ fontSize: '22px', color: '#94A3B8' }} />
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
