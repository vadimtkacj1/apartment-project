'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, CheckCircle2, Ban } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/shadcn/sonner';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Switch } from '@/components/shadcn/switch';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/shadcn/select';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/shadcn/alert-dialog';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/shadcn/table';
import MetricCardGrid from '@/components/admin/MetricCardGrid';
import { IcUser, IcCheckCircle, IcBan } from '@/components/admin/AdminIcons';
import AdminAvatar from '@/components/admin/AdminAvatar';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminMessages } from '@/lib/adminI18n';
import { ownersMessages } from '@/lib/adminI18n/messages/owners';

interface Owner {
  id: number;
  name: string;
  title: string;
  image: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function OwnersPage() {
  const t = useAdminMessages(ownersMessages);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await fetch('/api/admin/owners');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      console.error('Error fetching owners:', error);
      setOwners([]);
      toast.error(t.loadListError);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = owners.length;
    const active = owners.filter((o) => o.isActive).length;
    const inactive = owners.filter((o) => !o.isActive).length;
    return { total, active, inactive };
  }, [owners]);

  const filteredOwners = useMemo(() => {
    return owners.filter((owner) => {
      const matchesSearch =
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.email && owner.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && owner.isActive) ||
        (filterStatus === 'inactive' && !owner.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [owners, searchTerm, filterStatus]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`/api/admin/owners/${deleteTarget}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setDeleteTarget(null);
      fetchOwners();
      toast.success(t.deleteSuccess);
    } catch (error) {
      console.error('Error deleting owner:', error);
      toast.error(t.deleteError);
    }
  };

  const handleStatusChange = async (ownerId: number, value: boolean) => {
    try {
      const owner = owners.find((o) => o.id === ownerId);
      if (!owner) return;
      const response = await fetch(`/api/admin/owners/${ownerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...owner, isActive: value }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchOwners();
      toast.success(value ? t.activatedSuccess : t.deactivatedSuccess);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t.statusUpdateError);
    }
  };

  const dash = <span className="text-muted-foreground">—</span>;

  return (
    <div>
      <AdminPageHeader
        title={t.title}
        extra={
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/admin/owners/new"><Plus className="size-4" />{t.addNew}</Link>
          </Button>
        }
      />

      <MetricCardGrid
        items={[
          { icon: <IcUser className="size-5" />, label: t.statTotal, value: stats.total, accent: '#354AC4' },
          { icon: <IcCheckCircle className="size-5" />, label: t.statActive, value: stats.active, accent: '#2A69C4' },
          { icon: <IcBan className="size-5" />, label: t.statInactive, value: stats.inactive, accent: '#64748B' },
        ]}
      />

      {/* Filters */}
      <Card className="mb-6 p-5">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-50"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAllStatuses}</SelectItem>
              <SelectItem value="active">{t.statusActive}</SelectItem>
              <SelectItem value="inactive">{t.statusInactive}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Desktop table */}
      <div className="admin-only-desktop">
        <Card className="p-2">
          {loading ? (
            <div className="p-4"><Skeleton className="h-64 w-full" /></div>
          ) : filteredOwners.length === 0 ? (
            <AdminEmptyState message={t.emptyMessage} addHref="/admin/owners/new" addLabel={t.emptyAddLabel} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.fieldName}</TableHead>
                  <TableHead>{t.fieldEmail}</TableHead>
                  <TableHead>{t.fieldPhone}</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead className="text-center">{t.fieldOrder}</TableHead>
                  <TableHead className="text-center">{t.fieldStatus}</TableHead>
                  <TableHead>{t.colActions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <AdminAvatar src={record.image} name={record.name} />
                        <div className="min-w-0">
                          <Link href={`/admin/owners/${record.id}`} className="block truncate text-sm font-semibold text-primary">
                            {record.name}
                          </Link>
                          <div className="truncate text-[12.5px] text-muted-foreground">{record.title}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{record.email ? <bdi>{record.email}</bdi> : dash}</TableCell>
                    <TableCell>{record.phone ? <span dir="ltr">{record.phone}</span> : dash}</TableCell>
                    <TableCell>{record.whatsapp ? <span dir="ltr">{record.whatsapp}</span> : dash}</TableCell>
                    <TableCell className="text-center">{record.order}</TableCell>
                    <TableCell className="text-center">
                      <Switch checked={record.isActive} onCheckedChange={(v) => handleStatusChange(record.id, v)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label={t.edit}>
                          <Link href={`/admin/owners/${record.id}`}><Pencil className="size-4" /></Link>
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteTarget(record.id)} aria-label={t.delete}
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

      {/* Mobile card list */}
      <div className="admin-only-mobile">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : filteredOwners.length === 0 ? (
          <AdminEmptyState message={t.emptyMessage} addHref="/admin/owners/new" addLabel={t.emptyAddLabel} />
        ) : (
          <div className="admin-card-list">
            {filteredOwners.map((owner) => (
              <div key={owner.id} className="admin-card">
                <div className="admin-card__head">
                  <AdminAvatar src={owner.image} name={owner.name} />
                  <div className="min-w-0 flex-1">
                    <div className="admin-card__title">{owner.name}</div>
                    <div className="admin-card__meta">{owner.title}</div>
                  </div>
                </div>
                <div className="admin-card__fields">
                  {owner.phone && <span><b>{t.fieldPhone}</b> <span dir="ltr">{owner.phone}</span></span>}
                  {owner.whatsapp && <span><b>WhatsApp</b> <span dir="ltr">{owner.whatsapp}</span></span>}
                  {owner.email && <span><b>{t.fieldEmail}</b> <span dir="ltr">{owner.email}</span></span>}
                  <span><b>{t.fieldOrder}</b> {owner.order}</span>
                </div>
                <div className="admin-card__actions">
                  <Switch checked={owner.isActive} onCheckedChange={(v) => handleStatusChange(owner.id, v)} />
                  <span className="admin-card__grow flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/owners/${owner.id}`}><Pencil className="size-4" />{t.edit}</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTarget(owner.id)}
                    >
                      <Trash2 className="size-4" />{t.delete}
                    </Button>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteConfirmBody}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>{t.delete}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
