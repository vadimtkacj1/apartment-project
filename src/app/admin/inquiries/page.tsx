'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BRAND } from '@/lib/adminTheme';
import {
  Row,
  Col,
  Card,
  Table,
  Tag,
  Button,
  Select,
  Input,
  App,
  Popconfirm,
  Segmented,
  Statistic,
  Modal,
  Tooltip,
  Skeleton,
} from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import type { ColumnsType } from 'antd/es/table';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

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

const STATUS_META: Record<Inquiry['status'], { label: string; color: string }> = {
  new: { label: 'חדשה', color: 'gold' },
  in_progress: { label: 'בטיפול', color: 'blue' },
  closed: { label: 'סגורה', color: 'green' },
};

const { TextArea } = Input;

export default function InquiriesPage() {
  const { message } = App.useApp();
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
      message.error('שגיאה בטעינת הפניות');
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
      message.error('שגיאה בעדכון הסטטוס');
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
      message.success('הפנייה עודכנה');
      setActive(null);
    } catch {
      message.error('שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  const deleteInquiry = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('failed');
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      message.success('הפנייה נמחקה');
    } catch {
      message.error('שגיאה במחיקה');
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
      title: 'סטטוס',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: Inquiry['status'], rec) => (
        <Select
          value={status}
          size="small"
          style={{ width: 110 }}
          onChange={(v) => changeStatus(rec.id, v)}
          options={(Object.keys(STATUS_META) as Inquiry['status'][]).map((s) => ({
            value: s,
            label: <Tag color={STATUS_META[s].color} style={{ marginInlineEnd: 0 }}>{STATUS_META[s].label}</Tag>,
          }))}
        />
      ),
    },
    {
      title: 'לקוח',
      key: 'client',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#141414' }}>{r.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 4, fontSize: 13 }}>
            {r.phone && (
              <a href={`tel:${r.phone}`} style={{ color: '#1C3664' }}>
                <PhoneOutlined /> {r.phone}
              </a>
            )}
            {r.email && (
              <a href={`mailto:${r.email}`} style={{ color: '#1C3664' }}>
                <MailOutlined /> {r.email}
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'הודעה',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (m: string | null) =>
        m ? <Tooltip title={m}><span>{m}</span></Tooltip> : <span style={{ color: '#bfbfbf' }}>—</span>,
    },
    {
      title: 'נכס',
      key: 'property',
      width: 150,
      render: (_, r) =>
        r.property ? (
          <Link href={`/admin/properties/${r.property.id}`} style={{ color: '#1C3664' }}>
            <HomeOutlined /> {r.property.title}
          </Link>
        ) : (
          <span style={{ color: '#bfbfbf' }}>—</span>
        ),
    },
    {
      title: 'סוכן',
      key: 'agent',
      width: 110,
      render: (_, r) =>
        agentName(r.agentId) || <span style={{ color: '#bfbfbf' }}>—</span>,
    },
    {
      title: 'תאריך',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (d: string) => new Date(d).toLocaleDateString('he-IL'),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip title="פרטים והערות">
            <Button type="text" icon={<EyeOutlined />} onClick={() => openDetails(r)} />
          </Tooltip>
          <Popconfirm
            title="למחוק את הפנייה?"
            okText="מחק"
            cancelText="ביטול"
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
      <h1 className="text-4xl font-bold" style={{ marginBottom: 16 }}>פניות לקוחות</h1>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} lg={6}><Card><Statistic title="סה״כ" value={stats.total} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="חדשות" value={stats.new} styles={{ content: { color: BRAND.goldText } }} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="בטיפול" value={stats.in_progress} styles={{ content: { color: BRAND.navy } }} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="סגורות" value={stats.closed} styles={{ content: { color: BRAND.success } }} /></Card></Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Segmented
            value={filter}
            onChange={(v) => setFilter(v as typeof filter)}
            options={[
              { label: `הכל (${stats.total})`, value: 'all' },
              { label: `חדשות (${stats.new})`, value: 'new' },
              { label: `בטיפול (${stats.in_progress})`, value: 'in_progress' },
              { label: `סגורות (${stats.closed})`, value: 'closed' },
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
            locale={{ emptyText: <AdminEmptyState message="אין עדיין פניות" /> }}
          />
        </div>

        <div className="admin-only-mobile">
          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : filtered.length === 0 ? (
            <AdminEmptyState message="אין עדיין פניות" />
          ) : (
            <div className="admin-card-list">
              {filtered.map((r) => (
                <div key={r.id} className="admin-card">
                  <div className="admin-card__head">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="admin-card__title">{r.name}</div>
                      <div className="admin-card__meta">
                        {new Date(r.createdAt).toLocaleDateString('he-IL')}
                      </div>
                    </div>
                    <Select
                      value={r.status}
                      style={{ width: 120 }}
                      onChange={(v) => changeStatus(r.id, v)}
                      options={(Object.keys(STATUS_META) as Inquiry['status'][]).map((s) => ({
                        value: s,
                        label: (
                          <Tag color={STATUS_META[s].color} style={{ marginInlineEnd: 0 }}>
                            {STATUS_META[s].label}
                          </Tag>
                        ),
                      }))}
                    />
                  </div>

                  <div className="admin-card__fields">
                    {r.phone && (
                      <span>
                        <b>טלפון</b>{' '}
                        <a href={`tel:${r.phone}`} style={{ color: '#1C3664' }}>
                          {r.phone}
                        </a>
                      </span>
                    )}
                    {r.email && (
                      <span>
                        <b>אימייל</b>{' '}
                        <a href={`mailto:${r.email}`} style={{ color: '#1C3664' }}>
                          {r.email}
                        </a>
                      </span>
                    )}
                    {r.property && (
                      <span>
                        <b>נכס</b>{' '}
                        <Link href={`/admin/properties/${r.property.id}`} style={{ color: '#1C3664' }}>
                          {r.property.title}
                        </Link>
                      </span>
                    )}
                    {agentName(r.agentId) && (
                      <span>
                        <b>סוכן</b> {agentName(r.agentId)}
                      </span>
                    )}
                  </div>

                  <div className="admin-card__actions">
                    <Button icon={<EyeOutlined />} onClick={() => openDetails(r)}>
                      פרטים
                    </Button>
                    <Popconfirm
                      title="למחוק את הפנייה?"
                      okText="מחק"
                      cancelText="ביטול"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => deleteInquiry(r.id)}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        מחיקה
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Modal
        open={!!active}
        title={active ? `פנייה — ${active.name}` : ''}
        onCancel={() => setActive(null)}
        onOk={saveDetails}
        okText="שמירה"
        cancelText="סגירה"
        confirmLoading={saving}
        destroyOnHidden
      >
        {active && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {active.message && (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>הודעה</div>
                <div style={{ background: '#F1F3F5', padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap' }}>
                  {active.message}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 14 }}>
              {active.phone && <a href={`tel:${active.phone}`} style={{ color: '#1C3664' }}><PhoneOutlined /> {active.phone}</a>}
              {active.email && <a href={`mailto:${active.email}`} style={{ color: '#1C3664' }}><MailOutlined /> {active.email}</a>}
              {active.source && <span style={{ color: '#8c8c8c' }}>מקור: {active.source}</span>}
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>סוכן מטפל</div>
              <Select
                allowClear
                placeholder="שייך סוכן"
                style={{ width: '100%' }}
                value={draftAgent}
                onChange={setDraftAgent}
                options={team.map((t) => ({ label: t.name, value: `team-${t.id}` }))}
              />
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>הערות פנימיות</div>
              <TextArea rows={4} value={draftNotes} onChange={(e) => setDraftNotes(e.target.value)} placeholder="הערות לצוות..." />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
