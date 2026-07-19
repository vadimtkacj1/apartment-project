'use client';

import React, { useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAdminI18n, useAdminMessages, DEFAULT_ADMIN_LOCALE, dirOf } from '@/lib/adminI18n';
import { loginMessages } from '@/lib/adminI18n/messages/login';
import LanguageSwitcher from '@/components/admin/LanguageSwitcher';

function AiterraLogo({ size = 56 }: { size?: number }) {
  return (
    <img
      src="/aiterra-logo.png"
      alt="Aiterra"
      width={size}
      height={Math.round(size * 0.72)}
      style={{ display: 'block' }}
    />
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const { dir } = useAdminI18n();
  const t = useAdminMessages(loginMessages);

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
        setError(t.invalidCredentials);
        return;
      }

      if (result?.ok) {
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={dir}
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
          border: '1px solid #E4E8F2',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <LanguageSwitcher compact />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 76,
                height: 76,
                borderRadius: 20,
                background: '#ffffff',
                boxShadow: '0 10px 24px rgba(53, 74, 196, 0.30)',
              }}
            >
              <AiterraLogo size={48} />
            </div>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
            {t.title}
          </h1>
          <p style={{ color: '#8c8c8c', marginTop: '8px' }}>
            {t.subtitle}
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
            label={t.username}
            name="username"
            rules={[{ required: true, message: t.usernameRequired }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t.usernamePlaceholder}
              disabled={loading}
              dir="ltr"
              style={{ textAlign: 'left' }}
            />
          </Form.Item>

          <Form.Item
            label={t.password}
            name="password"
            rules={[{ required: true, message: t.passwordRequired }]}
          >
            <div dir="ltr">
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t.passwordPlaceholder}
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
              {t.submit}
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
        dir={dirOf(DEFAULT_ADMIN_LOCALE)}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <div style={{ fontSize: '18px' }}>
          {loginMessages[DEFAULT_ADMIN_LOCALE].loading}
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
