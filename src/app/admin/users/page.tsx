'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Switch,
  Modal,
  Form,
  Input,
  Select,
  App,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { ColumnsType } from 'antd/es/table';
import AdminEmptyState from '@/components/admin/AdminEmptyState';

interface AdminUser {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  role: 'admin' | 'agent';
  isActive: boolean;
  createdAt: string;
}

const ROLE_META: Record<AdminUser['role'], { label: string; color: string }> = {
  admin: { label: 'מנהל', color: '#1C3664' },
  agent: { label: 'סוכן', color: 'gold' },
};

export default function UsersPage() {
  const { message } = App.useApp();
  const { data: session, status } = useSession();
  const router = useRouter();

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
      message.error('שגיאה בטעינת המשתמשים');
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
        message.success('המשתמש נוצר');
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
        message.success('המשתמש עודכן');
      }
      closeModal();
      fetchUsers();
    } catch (e: any) {
      message.error(e?.message || 'שגיאה בשמירה');
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
      message.error(e?.message || 'שגיאה בעדכון');
      fetchUsers();
    }
  };

  const deleteUser = async (u: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'failed');
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
      message.success('המשתמש נמחק');
    } catch (e: any) {
      message.error(e?.message || 'שגיאה במחיקה');
    }
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: 'שם משתמש',
      dataIndex: 'username',
      key: 'username',
      render: (u: string) => <span style={{ fontWeight: 600, color: '#141414' }}><UserOutlined /> {u}</span>,
    },
    { title: 'שם', dataIndex: 'name', key: 'name', render: (n: string | null) => n || <span style={{ color: '#bfbfbf' }}>—</span> },
    { title: 'אימייל', dataIndex: 'email', key: 'email', render: (e: string | null) => e || <span style={{ color: '#bfbfbf' }}>—</span> },
    {
      title: 'תפקיד',
      dataIndex: 'role',
      key: 'role',
      width: 110,
      render: (r: AdminUser['role']) => <Tag color={ROLE_META[r].color}>{ROLE_META[r].label}</Tag>,
    },
    {
      title: 'פעיל',
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
            title="למחוק את המשתמש?"
            okText="מחק"
            cancelText="ביטול"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="text-4xl font-bold" style={{ margin: 0 }}>משתמשי מערכת</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>הוספת משתמש</Button>
      </div>

      <Card>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 700 }}
          locale={{ emptyText: <AdminEmptyState message="אין משתמשים" /> }}
        />
      </Card>

      <Modal
        open={creating || !!editing}
        title={creating ? 'הוספת משתמש' : 'עריכת משתמש'}
        onCancel={closeModal}
        onOk={submit}
        okText="שמירה"
        cancelText="ביטול"
        confirmLoading={saving}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          {creating && (
            <Form.Item
              label="שם משתמש"
              name="username"
              rules={[{ required: true, min: 3, message: 'לפחות 3 תווים' }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
          )}
          <Form.Item label="שם מלא" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="אימייל" name="email" rules={[{ type: 'email', message: 'אימייל לא תקין' }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="תפקיד" name="role" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'admin', label: 'מנהל (גישה מלאה)' },
                { value: 'agent', label: 'סוכן (גישה מוגבלת)' },
              ]}
            />
          </Form.Item>
          <Form.Item label="פעיל" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item
            label={creating ? 'סיסמה' : 'סיסמה חדשה (להשארת ריק — ללא שינוי)'}
            name="password"
            rules={creating ? [{ required: true, min: 6, message: 'לפחות 6 תווים' }] : [{ min: 6, message: 'לפחות 6 תווים' }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
