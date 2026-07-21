'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/shadcn/sonner';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Switch } from '@/components/shadcn/switch';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/shadcn/dialog';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/shadcn/alert-dialog';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/shadcn/select';
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from '@/components/shadcn/form';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/shadcn/table';
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

interface FormValues {
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'agent';
  isActive: boolean;
  password: string;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useAdminMessages(usersMessages);

  const ROLE_META: Record<AdminUser['role'], { label: string; pill: string }> = {
    admin: { label: t.roleAdmin, pill: 'admin-pill admin-pill--admin' },
    agent: { label: t.roleAgent, pill: 'admin-pill admin-pill--neutral' },
  };

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const form = useForm<FormValues>({
    defaultValues: { username: '', name: '', email: '', role: 'agent', isActive: true, password: '' },
  });

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
      toast.error(t.loadError);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setCreating(true);
    setEditing(null);
    setShowPassword(false);
    form.reset({ username: '', name: '', email: '', role: 'agent', isActive: true, password: '' });
  };

  const openEdit = (u: AdminUser) => {
    setCreating(false);
    setEditing(u);
    setShowPassword(false);
    form.reset({
      username: u.username,
      name: u.name ?? '',
      email: u.email ?? '',
      role: u.role,
      isActive: u.isActive,
      password: '',
    });
  };

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
  };

  const submit = form.handleSubmit(async (values) => {
    setSaving(true);
    try {
      if (creating) {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'failed');
        toast.success(t.userCreated);
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
        toast.success(t.userUpdated);
      }
      closeModal();
      fetchUsers();
    } catch (e: any) {
      toast.error(e?.message || t.saveError);
    } finally {
      setSaving(false);
    }
  });

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
      toast.error(e?.message || t.updateError);
      fetchUsers();
    }
  };

  const deleteUser = async (u: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'failed');
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
      toast.success(t.userDeleted);
    } catch (e: any) {
      toast.error(e?.message || t.deleteError);
    } finally {
      setDeleteTarget(null);
    }
  };

  const dash = <span className="text-slate-300">—</span>;

  return (
    <div>
      <AdminPageHeader
        title={t.title}
        extra={<Button onClick={openCreate}><Plus className="size-4" />{t.addUser}</Button>}
      />

      {/* desktop — table */}
      <div className="admin-only-desktop">
        <Card className="p-2">
          {loading ? (
            <div className="p-4"><Skeleton className="h-64 w-full" /></div>
          ) : users.length === 0 ? (
            <AdminEmptyState message={t.noUsers} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.username}</TableHead>
                  <TableHead>{t.name}</TableHead>
                  <TableHead>{t.email}</TableHead>
                  <TableHead className="w-[110px]">{t.role}</TableHead>
                  <TableHead className="w-[90px]">{t.active}</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#141414]">
                        <UserIcon className="size-4 text-muted-foreground" /> {u.username}
                      </span>
                    </TableCell>
                    <TableCell>{u.name || dash}</TableCell>
                    <TableCell>{u.email ? <bdi>{u.email}</bdi> : dash}</TableCell>
                    <TableCell><span className={ROLE_META[u.role].pill}>{ROLE_META[u.role].label}</span></TableCell>
                    <TableCell><Switch checked={u.isActive} onCheckedChange={(v) => toggleActive(u, v)} /></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(u)} aria-label={t.edit}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteTarget(u)} aria-label={t.deleteAction}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      {/* mobile — card list */}
      <div className="admin-only-mobile">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : users.length === 0 ? (
          <AdminEmptyState message={t.noUsers} />
        ) : (
          <div className="admin-card-list">
            {users.map((u) => (
              <div key={u.id} className="admin-card">
                <div className="admin-card__head">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-card__title">
                      <UserIcon className="inline size-4" /> {u.username}
                    </div>
                  </div>
                  <span className={ROLE_META[u.role].pill}>{ROLE_META[u.role].label}</span>
                </div>
                <div className="admin-card__fields">
                  <span><b>{t.name}</b> {u.name || '—'}</span>
                  <span><b>{t.email}</b> {u.email ? <bdi>{u.email}</bdi> : '—'}</span>
                </div>
                <div className="admin-card__actions">
                  <Switch checked={u.isActive} onCheckedChange={(v) => toggleActive(u, v)} />
                  <span className="admin-card__grow flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                      <Pencil className="size-4" />{t.edit}
                    </Button>
                    <Button
                      variant="outline" size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTarget(u)}
                    >
                      <Trash2 className="size-4" />{t.deleteAction}
                    </Button>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / edit modal */}
      <Dialog open={creating || !!editing} onOpenChange={(o) => { if (!o) closeModal(); }}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>{creating ? t.addUser : t.editUser}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={submit} className="mt-1 flex flex-col gap-4">
              {creating && (
                <FormField
                  control={form.control}
                  name="username"
                  rules={{ required: t.usernameRequired ?? t.minChars(3), minLength: { value: 3, message: t.minChars(3) } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.username}</FormLabel>
                      <FormControl><Input autoComplete="off" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.fullName}</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                rules={{ validate: (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || t.invalidEmail }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.email}</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.role}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="admin">{t.roleAdminOption}</SelectItem>
                        <SelectItem value="agent">{t.roleAgentOption}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex-row items-center justify-between">
                    <FormLabel>{t.active}</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{
                  validate: (v: string) => {
                    if (creating) return (!!v && v.length >= 6) || t.minChars(6);
                    return !v || v.length >= 6 || t.minChars(6);
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{creating ? t.password : t.newPasswordLabel}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          className="pe-9"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                          aria-label={showPassword ? 'Hide' : 'Show'}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-2 gap-2">
                <Button type="button" variant="outline" onClick={closeModal}>{t.cancel}</Button>
                <Button type="submit" disabled={saving}>{saving ? '…' : t.save}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>{deleteTarget?.username}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => deleteTarget && deleteUser(deleteTarget)}>
              {t.deleteOk}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
