'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BRAND } from '@/lib/adminTheme';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Select,
  Input,
  App,
  Popconfirm,
  Segmented,
  Statistic,
  Drawer,
  Tooltip,
  Skeleton,
} from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  InboxOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import MetricCardGrid from '@/components/admin/MetricCardGrid';
import Link from 'next/link';
import type { ColumnsType } from 'antd/es/table';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminMessages, useAdminI18n } from '@/lib/adminI18n';
import { inquiriesMessages } from '@/lib/adminI18n/messages/inquiries';

interface Inquiry {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  status: 'new' | 'in_progress' | 'closed';
  source: string | null;
  agentId: string | null;
  notes: string | null;
  propertyId: number | null;
  property: { id: number; title: string; location: string } | null;
  createdAt: string;
}

interface TeamOption {
  id: number;
  name: string;
}

const STATUSES: Inquiry['status'][] = ['new', 'in_progress', 'closed'];

// Maps each status to its pill role class (see SHARED PILL-CLASS CONTRACT).
const STATUS_PILL_CLASS: Record<Inquiry['status'], string> = {
  new: 'new',
  in_progress: 'progress',
  closed: 'closed',
};

const { TextArea } = Input;

export default function InquiriesPage() {
  const { message } = App.useApp();
  const t = useAdminMessages(inquiriesMessages);
  const { locale, dir } = useAdminI18n();
  const dateLocale = locale === 'he' ? 'he-IL' : 'en-GB';
  const statusLabels: Record<Inquiry['status'], string> = {
    new: t.statusNew,
    in_progress: t.statusInProgress,
    closed: t.statusClosed,
  };
  const statusPill = (status: Inquiry['status']) => (
    <span className={`admin-pill admin-pill--${STATUS_PILL_CLASS[status]}`}>
      {statusLabels[status]}
    </span>
  );
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [team, setTeam] = useState<TeamOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Inquiry['status']>('all');

  // Details / edit modal
  const [active, setActive] = useState<Inquiry | null>(null);
  const [draftNotes, setDraftNotes] = useState('');
  const [draftAgent, setDraftAgent] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInquiries();
    fetchTeam();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      if (!res.ok) throw new Error('failed');
      setInquiries(await res.json());
    } catch {
      message.error(t.loadError);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/admin/team');
      if (res.ok) {
        const data = await res.json();
        setTeam((data || []).map((t: any) => ({ id: t.id, name: t.name })));
      }
    } catch {
      /* non-fatal — agent assignment just won't have options */
    }
  };

  const patchInquiry = async (id: number, body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('failed');
    return res.json();
  };

  const changeStatus = async (id: number, status: Inquiry['status']) => {
    // Optimistic update for snappy status changes.
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    try {
      await patchInquiry(id, { status });
    } catch {
      message.error(t.statusUpdateError);
      fetchInquiries();
    }
  };

  const openDetails = (inq: Inquiry) => {
    setActive(inq);
    setDraftNotes(inq.notes || '');
    setDraftAgent(inq.agentId || undefined);
  };

  const saveDetails = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const updated = await patchInquiry(active.id, {
        notes: draftNotes,
        agentId: draftAgent ?? null,
      });
      setInquiries((prev) => prev.map((i) => (i.id === active.id ? { ...i, ...updated } : i)));
      message.success(t.updated);
      setActive(null);
    } catch {
      message.error(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const deleteInquiry = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('failed');
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      message.success(t.deleted);
    } catch {
      message.error(t.deleteError);
    }
  };

  const stats = useMemo(() => {
    const by = (s: Inquiry['status']) => inquiries.filter((i) => i.status === s).length;
    return { total: inquiries.length, new: by('new'), in_progress: by('in_progress'), closed: by('closed') };
  }, [inquiries]);

  const filtered = useMemo(
    () => (filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter)),
    [inquiries, filter]
  );

  const agentName = (agentId: string | null) => {
    if (!agentId) return null;
    const id = Number(agentId.replace(/^team-/, ''));
    return team.find((t) => t.id === id)?.name || agentId;
  };

  const columns: ColumnsType<Inquiry> = [
    {
      title: t.colStatus,
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: Inquiry['status'], rec) => (
        <Select
          value={status}
          size="small"
          style={{ width: 110 }}
          onChange={(v) => changeStatus(rec.id, v)}
          options={STATUSES.map((s) => ({
            value: s,
            label: statusPill(s),
          }))}
        />
      ),
    },
    {
      title: t.colClient,
      key: 'client',
      render: (_, r) => (
        <div>
          <button
            type="button"
            onClick={() => openDetails(r)}
            style={{ fontWeight: 600, color: '#051150', cursor: 'pointer', background: 'none', border: 0, padding: 0, font: 'inherit', textAlign: 'start' }}
          >
            {r.name}
          </button>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4, fontSize: 13 }}>
            {r.phone && (
              <a href={`tel:${r.phone}`} style={{ color: '#354AC4' }}>
                <PhoneOutlined /> {r.phone}
              </a>
            )}
            {r.email && (
              <a href={`mailto:${r.email}`} style={{ color: '#354AC4' }}>
                <MailOutlined /> {r.email}
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      title: t.colMessage,
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (m: string | null) =>
        m ? <Tooltip title={m}><span>{m}</span></Tooltip> : <span style={{ color: '#94A3B8' }}>—</span>,
    },
    {
      title: t.colProperty,
      key: 'property',
      width: 150,
      render: (_, r) =>
        r.property ? (
          <Link href={`/admin/properties/${r.property.id}`} style={{ color: '#354AC4' }}>
            <HomeOutlined /> {r.property.title}
          </Link>
        ) : (
          <span style={{ color: '#94A3B8' }}>—</span>
        ),
    },
    {
      title: t.colAgent,
      key: 'agent',
      width: 110,
      render: (_, r) =>
        agentName(r.agentId) || <span style={{ color: '#94A3B8' }}>—</span>,
    },
    {
      title: t.colDate,
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (d: string) => new Date(d).toLocaleDateString(dateLocale),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip title={t.detailsTooltip}>
            <Button type="text" icon={<EyeOutlined />} onClick={() => openDetails(r)} />
          </Tooltip>
          <Popconfirm
            title={t.deleteConfirm}
            okText={t.deleteOk}
            cancelText={t.cancel}
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteInquiry(r.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader title={t.title} />

      <MetricCardGrid
        items={[
          { icon: <InboxOutlined />, label: t.statTotal, value: stats.total, accent: '#354AC4' },
          { icon: <StarOutlined />, label: t.statNew, value: stats.new, accent: '#5594F1' },
          { icon: <ClockCircleOutlined />, label: t.statInProgress, value: stats.in_progress, accent: '#354AC4' },
          { icon: <CheckCircleOutlined />, label: t.statClosed, value: stats.closed, accent: '#2A69C4' },
        ]}
      />

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Segmented
            value={filter}
            onChange={(v) => setFilter(v as typeof filter)}
            options={[
              { label: t.filterAll(stats.total), value: 'all' },
              { label: t.filterNew(stats.new), value: 'new' },
              { label: t.filterInProgress(stats.in_progress), value: 'in_progress' },
              { label: t.filterClosed(stats.closed), value: 'closed' },
            ]}
          />
        </div>
        <div className="admin-only-desktop">
          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 20, showSizeChanger: true }}
            scroll={{ x: 800 }}
            locale={{ emptyText: <AdminEmptyState message={t.empty} /> }}
          />
        </div>

        <div className="admin-only-mobile">
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : filtered.length === 0 ? (
            <AdminEmptyState message={t.empty} />
          ) : (
            <div className="admin-card-list">
              {filtered.map((r) => (
                <div key={r.id} className="admin-card">
                  <div className="admin-card__head">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="admin-card__title">{r.name}</div>
                      <div className="admin-card__meta">
                        {new Date(r.createdAt).toLocaleDateString(dateLocale)}
                      </div>
                    </div>
                    <Select
                      value={r.status}
                      style={{ width: 120 }}
                      onChange={(v) => changeStatus(r.id, v)}
                      options={STATUSES.map((s) => ({
                        value: s,
                        label: statusPill(s),
                      }))}
                    />
                  </div>

                  <div className="admin-card__fields">
                    {r.phone && (
                      <span>
                        <b>{t.fieldPhone}</b>{' '}
                        <a href={`tel:${r.phone}`} style={{ color: '#354AC4' }}>
                          {r.phone}
                        </a>
                      </span>
                    )}
                    {r.email && (
                      <span>
                        <b>{t.fieldEmail}</b>{' '}
                        <a href={`mailto:${r.email}`} style={{ color: '#354AC4' }}>
                          {r.email}
                        </a>
                      </span>
                    )}
                    {r.property && (
                      <span>
                        <b>{t.fieldProperty}</b>{' '}
                        <Link href={`/admin/properties/${r.property.id}`} style={{ color: '#354AC4' }}>
                          {r.property.title}
                        </Link>
                      </span>
                    )}
                    {agentName(r.agentId) && (
                      <span>
                        <b>{t.fieldAgent}</b> {agentName(r.agentId)}
                      </span>
                    )}
                  </div>

                  <div className="admin-card__actions">
                    <Button icon={<EyeOutlined />} onClick={() => openDetails(r)}>
                      {t.detailsButton}
                    </Button>
                    <Popconfirm
                      title={t.deleteConfirm}
                      okText={t.deleteOk}
                      cancelText={t.cancel}
                      okButtonProps={{ danger: true }}
                      onConfirm={() => deleteInquiry(r.id)}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        {t.deleteButton}
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Drawer
        open={!!active}
        title={active ? t.modalTitle(active.name) : ''}
        onClose={() => setActive(null)}
        placement={dir === 'rtl' ? 'left' : 'right'}
        width="min(440px, 100vw)"
        destroyOnHidden
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => setActive(null)}>{t.close}</Button>
            <Button type="primary" loading={saving} onClick={saveDetails}>
              {t.save}
            </Button>
          </div>
        }
      >
        {active && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>{statusPill(active.status)}</div>

            {active.message && (
              <div>
                <div style={{ color: '#64748B', fontSize: 12.5, marginBottom: 4 }}>{t.messageLabel}</div>
                <div style={{ background: '#F1F3F5', padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap' }}>
                  {active.message}
                </div>
              </div>
            )}

            {active.phone && (
              <div>
                <div style={{ color: '#64748B', fontSize: 12.5, marginBottom: 2 }}>{t.fieldPhone}</div>
                <a href={`tel:${active.phone}`} style={{ color: '#354AC4' }}>
                  <PhoneOutlined /> {active.phone}
                </a>
              </div>
            )}
            {active.email && (
              <div>
                <div style={{ color: '#64748B', fontSize: 12.5, marginBottom: 2 }}>{t.fieldEmail}</div>
                <a href={`mailto:${active.email}`} style={{ color: '#354AC4' }}>
                  <MailOutlined /> {active.email}
                </a>
              </div>
            )}
            {active.source && (
              <div style={{ color: '#94A3B8', fontSize: 13 }}>{t.sourceLabel(active.source)}</div>
            )}

            <div>
              <div style={{ color: '#64748B', fontSize: 12.5, marginBottom: 4 }}>{t.assignedAgent}</div>
              <Select
                allowClear
                placeholder={t.assignAgentPlaceholder}
                style={{ width: '100%' }}
                value={draftAgent}
                onChange={setDraftAgent}
                options={team.map((tm) => ({ label: tm.name, value: `team-${tm.id}` }))}
              />
            </div>
            <div>
              <div style={{ color: '#64748B', fontSize: 12.5, marginBottom: 4 }}>{t.internalNotes}</div>
              <TextArea rows={4} value={draftNotes} onChange={(e) => setDraftNotes(e.target.value)} placeholder={t.notesPlaceholder} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
