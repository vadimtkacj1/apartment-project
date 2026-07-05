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
  TeamOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { useAdminMessages } from '@/lib/adminI18n';
import { teamMessages } from '@/lib/adminI18n/messages/team';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string | null;
  phone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TeamPage() {
  const t = useAdminMessages(teamMessages);
  const { message } = App.useApp();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
      message.error(t.loadListError);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = teamMembers.length;
    const active = teamMembers.filter((m) => m.isActive).length;
    const inactive = teamMembers.filter((m) => !m.isActive).length;
    return { total, active, inactive };
  }, [teamMembers]);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && member.isActive) ||
        (filterStatus === 'inactive' && !member.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [teamMembers, searchTerm, filterStatus]);

  const handleDelete = async () => {
    if (!selectedMember) return;
    try {
      const response = await fetch(`/api/admin/team/${selectedMember}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setDeleteModal(false);
      setSelectedMember(null);
      fetchTeamMembers();
      message.success(t.deleteSuccess);
    } catch (error) {
      console.error('Error deleting team member:', error);
      message.error(t.deleteError);
    }
  };

  const handleStatusChange = async (memberId: number, value: boolean) => {
    try {
      const member = teamMembers.find((m) => m.id === memberId);
      if (!member) return;
      const response = await fetch(`/api/admin/team/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...member, isActive: value }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchTeamMembers();
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
        <Link href="/admin/team/new" className="w-full sm:w-auto">
          <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full sm:w-auto">
            {t.addNew}
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card><Statistic title={t.statTotal} value={stats.total} prefix={<TeamOutlined />} /></Card>
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

      {/* Team Members Table — desktop */}
      <div className="admin-only-desktop">
      <Card>
        <Table
          dataSource={filteredMembers}
          loading={loading}
          rowKey="id"
          size="middle"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => t.paginationTotal(total),
          }}
          scroll={{ x: 1200 }}
          locale={{ emptyText: <AdminEmptyState message={t.emptyMessage} addHref="/admin/team/new" addLabel={t.emptyAddLabel} /> }}
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
                      alt="Team Member"
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
                        background: '#E6E8EC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TeamOutlined style={{ fontSize: '24px', color: '#bfbfbf' }} />
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
              dataIndex: 'role',
              key: 'role',
              width: 150,
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
              title: t.fieldMobile,
              dataIndex: 'mobile',
              key: 'mobile',
              width: 120,
              render: (mobile: string | null) => mobile || '-',
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
              render: (_, record: TeamMember) => (
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
              render: (_, record: TeamMember) => (
                <Space size={4}>
                  <Link href={`/admin/team/${record.id}`}>
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
                      setSelectedMember(record.id);
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

      {/* Team Members — mobile card list */}
      <div className="admin-only-mobile">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : filteredMembers.length === 0 ? (
          <AdminEmptyState message={t.emptyMessage} addHref="/admin/team/new" addLabel={t.emptyAddLabel} />
        ) : (
          <div className="admin-card-list">
            {filteredMembers.map((member) => (
              <div key={member.id} className="admin-card">
                <div className="admin-card__head">
                  {member.image ? (
                    <img className="admin-card__thumb" src={member.image} alt={member.name} />
                  ) : (
                    <div
                      className="admin-card__thumb"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#E6E8EC',
                      }}
                    >
                      <TeamOutlined style={{ fontSize: '22px', color: '#bfbfbf' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-card__title">{member.name}</div>
                    <div className="admin-card__meta">{member.role}</div>
                  </div>
                </div>
                <div className="admin-card__fields">
                  {member.phone && <span><b>{t.fieldPhone}</b> <span dir="ltr">{member.phone}</span></span>}
                  {member.mobile && <span><b>{t.fieldMobile}</b> <span dir="ltr">{member.mobile}</span></span>}
                  {member.email && <span><b>{t.fieldEmail}</b> <span dir="ltr">{member.email}</span></span>}
                  <span><b>{t.fieldOrder}</b> {member.order}</span>
                </div>
                <div className="admin-card__actions">
                  <Switch
                    checked={member.isActive}
                    onChange={(v) => handleStatusChange(member.id, v)}
                    checkedChildren={t.statusActive}
                    unCheckedChildren={t.switchOff}
                  />
                  <span className="admin-card__grow">
                    <Link href={`/admin/team/${member.id}`}>
                      <Button type="primary" icon={<EditOutlined />}>{t.edit}</Button>
                    </Link>
                  </span>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      setSelectedMember(member.id);
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
          setSelectedMember(null);
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
