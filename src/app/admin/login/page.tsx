'use client';

import React, { useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { Label } from '@/components/shadcn/label';
import { Alert, AlertDescription } from '@/components/shadcn/alert';
import { Card } from '@/components/shadcn/card';
import { Skeleton } from '@/components/shadcn/skeleton';
import { useAdminI18n, useAdminMessages, DEFAULT_ADMIN_LOCALE, dirOf } from '@/lib/adminI18n';
import { loginMessages } from '@/lib/adminI18n/messages/login';
import LanguageSwitcher from '@/components/admin/LanguageSwitcher';

function AiterraLogo({ size = 56 }: { size?: number }) {
  return (
    <img
      src="/aiterra-dark-logo.png"
      alt="Aiterra"
      width={size}
      height={Math.round(size * 0.35)}
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
    <div dir={dir} className="flex min-h-screen items-center justify-center bg-muted p-5">
      <Card className="w-full max-w-100 p-10 shadow-[0_4px_16px_rgba(5,17,80,0.06)]">
        <div className="mb-6 flex justify-center">
          <LanguageSwitcher compact />
        </div>

        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <AiterraLogo size={48} />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">{t.title}</h1>
          <p className="mt-2 text-muted-foreground">{t.subtitle}</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate aria-busy={loading}>
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
                className="ps-9 pe-9 text-left"
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
                className="ps-9 pe-9 text-left"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? t.hidePassword : t.showPassword}
                className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {touched && !password && (
              <span className="text-xs font-medium text-destructive">{t.passwordRequired}</span>
            )}
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : t.submit}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div
        dir={dirOf(DEFAULT_ADMIN_LOCALE)}
        className="flex min-h-screen items-center justify-center bg-muted p-5"
        aria-busy="true"
        aria-label={loginMessages[DEFAULT_ADMIN_LOCALE].loading}
      >
        <Card className="w-full max-w-100 p-10 shadow-[0_4px_16px_rgba(5,17,80,0.06)]">
          <Skeleton className="mx-auto mb-6 h-8 w-20" />
          <Skeleton className="mx-auto mb-4 size-12 rounded-lg" />
          <Skeleton className="mx-auto mb-2 h-7 w-32" />
          <Skeleton className="mx-auto mb-8 h-4 w-40" />
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
