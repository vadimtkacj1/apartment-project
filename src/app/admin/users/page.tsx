'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Switch,
  Modal,
  Form,
  Input,
  Select,
  App,
  Popconfirm,
  Skeleton,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { ColumnsType } from 'antd/es/table';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminMessages } from '@/lib/adminI18n';
import { usersMessages } from '@/lib/adminI18n/messages/users';

interface AdminUser {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  role: 'admin' | 'agent';
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const { message } = App.useApp();
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useAdminMessages(usersMessages);

  const ROLE_META: Record<AdminUser['role'], { label: string; pill: string }> = {
    admin: { label: t.roleAdmin, pill: 'admin-pill admin-pill--admin' },
    agent: { label: t.roleAgent, pill: 'admin-pill admin-pill--neutral' },
  };

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminUser | null>(null); // null=closed
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  // Page-level admin guard (defence-in-depth; API + nav already gate this).
  const role = (session?.user as { role?: string } | undefined)?.role;
  useEffect(() => {
    if (status === 'authenticated' && role !== 'admin') router.replace('/admin');
  }, [status, role, router]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('failed');
      setUsers(await res.json());
    } catch {
      message.error(t.loadError);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ role: 'agent', isActive: true });
  };

  const openEdit = (u: AdminUser) => {
    setCreating(false);
    setEditing(u);
    form.resetFields();
    form.setFieldsValue({ name: u.name, email: u.email, role: u.role, isActive: u.isActive, password: '' });
  };

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const submit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      if (creating) {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'failed');
        message.success(t.userCreated);
      } else if (editing) {
        const payload: Record<string, unknown> = {
          name: values.name,
          email: values.email,
          role: values.role,
          isActive: values.isActive,
        };
        if (values.password) payload.password = values.password;
        const res = await fetch(`/api/admin/users/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'failed');
        message.success(t.userUpdated);
      }
      closeModal();
      fetchUsers();
    } catch (e: any) {
      message.error(e?.message || t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u: AdminUser, isActive: boolean) => {
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive } : x)));
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'failed');
    } catch (e: any) {
      message.error(e?.message || t.updateError);
      fetchUsers();
    }
  };

  const deleteUser = async (u: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'failed');
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
      message.success(t.userDeleted);
    } catch (e: any) {
      message.error(e?.message || t.deleteError);
    }
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: t.username,
      dataIndex: 'username',
      key: 'username',
      render: (u: string) => <span style={{ fontWeight: 600, color: '#141414' }}><UserOutlined /> {u}</span>,
    },
    { title: t.name, dataIndex: 'name', key: 'name', render: (n: string | null) => n || <span style={{ color: '#bfbfbf' }}>—</span> },
    { title: t.email, dataIndex: 'email', key: 'email', render: (e: string | null) => e || <span style={{ color: '#bfbfbf' }}>—</span> },
    {
      title: t.role,
      dataIndex: 'role',
      key: 'role',
      width: 110,
      render: (r: AdminUser['role']) => <span className={ROLE_META[r].pill}>{ROLE_META[r].label}</span>,
    },
    {
      title: t.active,
      dataIndex: 'isActive',
      key: 'isActive',
      width: 90,
      render: (active: boolean, rec) => (
        <Switch checked={active} onChange={(v) => toggleActive(rec, v)} />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, rec) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(rec)} />
          <Popconfirm
            title={t.deleteConfirm}
            okText={t.deleteOk}
            cancelText={t.cancel}
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteUser(rec)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title={t.title}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>{t.addUser}</Button>}
      />

      {/* desktop — existing table, unchanged, just wrapped */}
      <div className="admin-only-desktop">
        <Card>
          <Table
            dataSource={users}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: 700 }}
            locale={{ emptyText: <AdminEmptyState message={t.noUsers} /> }}
          />
        </Card>
      </div>

      {/* mobile — card list */}
      <div className="admin-only-mobile">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : users.length === 0 ? (
          <AdminEmptyState message={t.noUsers} />
        ) : (
          <div className="admin-card-list">
            {users.map((u) => (
              <div key={u.id} className="admin-card">
                <div className="admin-card__head">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-card__title">
                      <UserOutlined /> {u.username}
                    </div>
                  </div>
                  <span className={ROLE_META[u.role].pill}>{ROLE_META[u.role].label}</span>
                </div>
                <div className="admin-card__fields">
                  <span>
                    <b>{t.name}</b> {u.name || '—'}
                  </span>
                  <span>
                    <b>{t.email}</b> {u.email ? <bdi>{u.email}</bdi> : '—'}
                  </span>
                </div>
                <div className="admin-card__actions">
                  <Switch checked={u.isActive} onChange={(v) => toggleActive(u, v)} />
                  <span className="admin-card__grow">
                    <Button icon={<EditOutlined />} onClick={() => openEdit(u)}>
                      {t.edit}
                    </Button>
                    <Popconfirm
                      title={t.deleteConfirm}
                      okText={t.deleteOk}
                      cancelText={t.cancel}
                      okButtonProps={{ danger: true }}
                      onConfirm={() => deleteUser(u)}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        {t.deleteAction}
                      </Button>
                    </Popconfirm>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={creating || !!editing}
        title={creating ? t.addUser : t.editUser}
        width={520}
        onCancel={closeModal}
        onOk={submit}
        okText={t.save}
        cancelText={t.cancel}
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          {creating && (
            <Form.Item
              label={t.username}
              name="username"
              rules={[{ required: true, min: 3, message: t.minChars(3) }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
          )}
          <Form.Item label={t.fullName} name="name">
            <Input />
          </Form.Item>
          <Form.Item label={t.email} name="email" rules={[{ type: 'email', message: t.invalidEmail }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label={t.role} name="role" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'admin', label: t.roleAdminOption },
                { value: 'agent', label: t.roleAgentOption },
              ]}
            />
          </Form.Item>
          <Form.Item label={t.active} name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label={creating ? t.password : t.newPasswordLabel}
            name="password"
            rules={creating ? [{ required: true, min: 6, message: t.minChars(6) }] : [{ min: 6, message: t.minChars(6) }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
