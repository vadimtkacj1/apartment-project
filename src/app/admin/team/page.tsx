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
  TeamOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import MetricCardGrid from '@/components/admin/MetricCardGrid';
import Link from 'next/link';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
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
  propertiesCount: number;
  soldCount: number;
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
    <div>
      {/* Header */}
      <AdminPageHeader
        title={t.title}
        extra={
          <Link href="/admin/team/new" className="w-full sm:w-auto">
            <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full sm:w-auto">
              {t.addNew}
            </Button>
          </Link>
        }
      />

      {/* Statistics */}
      <MetricCardGrid
        items={[
          { icon: <TeamOutlined />, label: t.statTotal, value: stats.total, accent: '#354AC4' },
          { icon: <CheckCircleOutlined />, label: t.statActive, value: stats.active, accent: '#2A69C4' },
          { icon: <StopOutlined />, label: t.statInactive, value: stats.inactive, accent: '#64748B' },
        ]}
      />

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
          scroll={{ x: 1440 }}
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
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #E4E8F2',
                        flexShrink: 0,
                        background: '#F4F6FB',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt="Team Member"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: '#E4E8F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TeamOutlined style={{ fontSize: '24px', color: '#94A3B8' }} />
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
              render: (name: string, record: TeamMember) => (
                <Link href={`/admin/team/${record.id}`} style={{ fontWeight: 600, color: '#354AC4' }}>
                  {name}
                </Link>
              ),
            },
            {
              title: t.fieldRole,
              dataIndex: 'role',
              key: 'role',
              width: 150,
              render: (role: string) =>
                role ? <span className="admin-pill admin-pill--neutral">{role}</span> : '-',
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
              title: t.fieldProperties,
              dataIndex: 'propertiesCount',
              key: 'propertiesCount',
              width: 120,
              align: 'center',
              render: (count: number) =>
                count > 0 ? (
                  <span className="admin-pill admin-pill--sale">{count}</span>
                ) : (
                  <span style={{ color: '#94A3B8' }}>0</span>
                ),
            },
            {
              title: t.fieldSold,
              dataIndex: 'soldCount',
              key: 'soldCount',
              width: 120,
              align: 'center',
              render: (count: number) =>
                count > 0 ? (
                  <span className="admin-pill admin-pill--closed">{count}</span>
                ) : (
                  <span style={{ color: '#94A3B8' }}>0</span>
                ),
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
                    <img className="admin-card__thumb admin-card__thumb--round" src={member.image} alt={member.name} />
                  ) : (
                    <div
                      className="admin-card__thumb admin-card__thumb--round"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#E4E8F2',
                      }}
                    >
                      <TeamOutlined style={{ fontSize: '22px', color: '#94A3B8' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-card__title">{member.name}</div>
                    {member.role ? (
                      <div style={{ marginTop: 4 }}>
                        <span className="admin-pill admin-pill--neutral">{member.role}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="admin-card__fields">
                  {member.phone && <span><b>{t.fieldPhone}</b> <span dir="ltr">{member.phone}</span></span>}
                  {member.mobile && <span><b>{t.fieldMobile}</b> <span dir="ltr">{member.mobile}</span></span>}
                  {member.email && <span><b>{t.fieldEmail}</b> <span dir="ltr">{member.email}</span></span>}
                  <span><b>{t.fieldProperties}</b> {member.propertiesCount}</span>
                  <span><b>{t.fieldSold}</b> {member.soldCount}</span>
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
