'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';

export default function AdminLoginPage() {
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
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        padding: '20px',
        fontFamily: 'var(--font-opensans-hebrew), Arial, Helvetica, sans-serif',
      }}
    >
      {/* Background overlay pattern */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Logo & Title */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 32px rgba(24, 144, 255, 0.4)',
            }}
          >
            <HomeOutlined style={{ fontSize: '36px', color: '#fff' }} />
          </div>
          <h1
            style={{
              color: '#fff',
              fontSize: '28px',
              fontWeight: 700,
              margin: '0 0 8px',
              fontFamily: 'inherit',
            }}
          >
            לוח ניהול
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '15px',
              margin: 0,
              fontFamily: 'inherit',
            }}
          >
            התחבר כדי לנהל את הנכסים שלך
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '40px 32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 24, borderRadius: '8px' }}
            />
          )}

          <Form
            onFinish={onFinish}
            layout="vertical"
            size="large"
            requiredMark={false}
          >
            <Form.Item
              label={<span style={{ fontWeight: 600, color: '#333', fontSize: '14px' }}>שם משתמש</span>}
              name="username"
              rules={[
                {
                  required: true,
                  message: 'אנא הכנס שם משתמש!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="הכנס שם משתמש"
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  height: '48px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ fontWeight: 600, color: '#333', fontSize: '14px' }}>סיסמה</span>}
              name="password"
              rules={[
                {
                  required: true,
                  message: 'אנא הכנס סיסמה!',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="הכנס סיסמה"
                disabled={loading}
                style={{
                  borderRadius: '10px',
                  height: '48px',
                  fontSize: '15px',
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: '8px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(24, 144, 255, 0.4)',
                }}
              >
                התחבר
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
