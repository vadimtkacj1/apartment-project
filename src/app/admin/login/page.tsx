'use client';

import React, { useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function AiterraLogo({ size = 56, color = '#1C3664' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
      role="img"
      aria-label="Aiterra"
    >
      <path fill="currentColor" d="M55.03 5.92L88.17 68.07L73.41 67.96L54.82 33.88L32.67 75.40L47.28 75.45L55.92 88.59L11.31 88.70Z" />
      <path fill="currentColor" d="M57.49 75.50L92.21 75.45L99.27 88.70L66.86 88.75Z" />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();

  const nextUrl = useMemo(() => search.get('next') || '/admin', [search]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: { username: string; password: string }) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
        callbackUrl: nextUrl,
      });

      if (result?.error) {
        setError('שם משתמש או סיסמה שגויים');
        return;
      }

      if (result?.ok) {
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: '#fff',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid #E6E8EC',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <AiterraLogo size={56} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
            לוח ניהול
          </h1>
          <p style={{ color: '#8c8c8c', marginTop: '8px' }}>
            התחבר למערכת
          </p>
        </div>

        {error && (
          <Alert
            title={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            label="שם משתמש"
            name="username"
            rules={[{ required: true, message: 'אנא הכנס שם משתמש!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="הכנס שם משתמש"
              disabled={loading}
              dir="ltr"
              style={{ textAlign: 'left' }}
            />
          </Form.Item>

          <Form.Item
            label="סיסמה"
            name="password"
            rules={[{ required: true, message: 'אנא הכנס סיסמה!' }]}
          >
            <div dir="ltr">
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="הכנס סיסמה"
                disabled={loading}
                style={{ textAlign: 'left' }}
              />
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              התחבר
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div
        dir="rtl"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <div style={{ fontSize: '18px' }}>טוען...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
