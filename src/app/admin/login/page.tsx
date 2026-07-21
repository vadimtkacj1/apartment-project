'use client';

import React, { useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import { Alert, AlertDescription } from '@/components/shadcn/alert';
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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!username || !password) return;
    setError(null);
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        username,
        password,
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
              }}
            >
              <AiterraLogo size={48} />
            </div>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0, color: '#051150' }}>{t.title}</h1>
          <p style={{ color: '#8c8c8c', marginTop: '8px' }}>{t.subtitle}</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-username">
              {t.username} <span className="text-destructive">*</span>
            </Label>
            <div className="relative" dir="ltr">
              <User className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.usernamePlaceholder}
                disabled={loading}
                autoComplete="username"
                className="ps-9 text-left"
              />
            </div>
            {touched && !username && (
              <span className="text-xs font-medium text-destructive">{t.usernameRequired}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">
              {t.password} <span className="text-destructive">*</span>
            </Label>
            <div className="relative" dir="ltr">
              <Lock className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                disabled={loading}
                autoComplete="current-password"
                className="px-9 text-left"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {touched && !password && (
              <span className="text-xs font-medium text-destructive">{t.passwordRequired}</span>
            )}
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? '…' : t.submit}
          </Button>
        </form>
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
