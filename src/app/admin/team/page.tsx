'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Users, UserCheck, UserX } from 'lucide-react';
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
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminMessages } from '@/lib/adminI18n';
import { teamMessages } from '@/lib/adminI18n/messages/team';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string | null;
  phone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
  propertiesCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function TeamPage() {
  const t = useAdminMessages(teamMessages);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
      toast.error(t.loadListError);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = teamMembers.length;
    const active = teamMembers.filter((m) => m.isActive).length;
    const inactive = teamMembers.filter((m) => !m.isActive).length;
    return { total, active, inactive };
  }, [teamMembers]);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && member.isActive) ||
        (filterStatus === 'inactive' && !member.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [teamMembers, searchTerm, filterStatus]);

  const deleteMember = async (member: TeamMember) => {
    try {
      const response = await fetch(`/api/admin/team/${member.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchTeamMembers();
      toast.success(t.deleteSuccess);
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error(t.deleteError);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = async (memberId: number, value: boolean) => {
    try {
      const member = teamMembers.find((m) => m.id === memberId);
      if (!member) return;
      const response = await fetch(`/api/admin/team/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...member, isActive: value }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchTeamMembers();
      toast.success(value ? t.activatedSuccess : t.deactivatedSuccess);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t.statusUpdateError);
    }
  };

  const dash = <span style={{ color: '#94A3B8' }}>-</span>;

  return (
    <div>
      {/* Header */}
      <AdminPageHeader
        title={t.title}
        extra={
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/admin/team/new">
              <Plus className="size-4" />
              {t.addNew}
            </Link>
          </Button>
        }
      />

      {/* Statistics */}
      <MetricCardGrid
        items={[
          { icon: <Users className="size-5" />, label: t.statTotal, value: stats.total, accent: '#354AC4' },
          { icon: <UserCheck className="size-5" />, label: t.statActive, value: stats.active, accent: '#2A69C4' },
          { icon: <UserX className="size-5" />, label: t.statInactive, value: stats.inactive, accent: '#64748B' },
        ]}
      />

      {/* Filters */}
      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ps-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full max-w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAllStatuses}</SelectItem>
              <SelectItem value="active">{t.statusActive}</SelectItem>
              <SelectItem value="inactive">{t.statusInactive}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Team Members Table — desktop */}
      <div className="admin-only-desktop">
        <Card className="p-2">
          {loading ? (
            <div className="p-4"><Skeleton className="h-64 w-full" /></div>
          ) : filteredMembers.length === 0 ? (
            <AdminEmptyState message={t.emptyMessage} addHref="/admin/team/new" addLabel={t.emptyAddLabel} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">{t.colImage}</TableHead>
                  <TableHead>{t.fieldName}</TableHead>
                  <TableHead>{t.fieldRole}</TableHead>
                  <TableHead>{t.fieldEmail}</TableHead>
                  <TableHead>{t.fieldPhone}</TableHead>
                  <TableHead>{t.fieldMobile}</TableHead>
                  <TableHead className="text-center">{t.fieldProperties}</TableHead>
                  <TableHead className="text-center">{t.fieldSold}</TableHead>
                  <TableHead className="text-center">{t.fieldOrder}</TableHead>
                  <TableHead className="text-center">{t.fieldStatus}</TableHead>
                  <TableHead className="w-[110px]">{t.colActions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {member.image ? (
                          <div
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: '2px solid #E4E8F2',
                              flexShrink: 0,
                              background: '#F4F6FB',
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={member.image}
                              alt={member.name}
                              onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              background: '#E4E8F2',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Users className="size-6" style={{ color: '#94A3B8' }} />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/team/${member.id}`} style={{ fontWeight: 600, color: '#354AC4' }}>
                        {member.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {member.role ? <span className="admin-pill admin-pill--neutral">{member.role}</span> : dash}
                    </TableCell>
                    <TableCell>{member.email ? <bdi>{member.email}</bdi> : dash}</TableCell>
                    <TableCell>{member.phone ? <span dir="ltr">{member.phone}</span> : dash}</TableCell>
                    <TableCell>{member.mobile ? <span dir="ltr">{member.mobile}</span> : dash}</TableCell>
                    <TableCell className="text-center">
                      {member.propertiesCount > 0 ? (
                        <span className="admin-pill admin-pill--sale">{member.propertiesCount}</span>
                      ) : (
                        <span style={{ color: '#94A3B8' }}>0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {member.soldCount > 0 ? (
                        <span className="admin-pill admin-pill--closed">{member.soldCount}</span>
                      ) : (
                        <span style={{ color: '#94A3B8' }}>0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{member.order}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={member.isActive}
                        onCheckedChange={(v) => handleStatusChange(member.id, v)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button asChild variant="ghost" size="icon" aria-label={t.edit}>
                          <Link href={`/admin/team/${member.id}`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteTarget(member)}
                          aria-label={t.delete}
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

      {/* Team Members — mobile card list */}
      <div className="admin-only-mobile">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : filteredMembers.length === 0 ? (
          <AdminEmptyState message={t.emptyMessage} addHref="/admin/team/new" addLabel={t.emptyAddLabel} />
        ) : (
          <div className="admin-card-list">
            {filteredMembers.map((member) => (
              <div key={member.id} className="admin-card">
                <div className="admin-card__head">
                  {member.image ? (
                    <img className="admin-card__thumb admin-card__thumb--round" src={member.image} alt={member.name} />
                  ) : (
                    <div
                      className="admin-card__thumb admin-card__thumb--round"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#E4E8F2',
                      }}
                    >
                      <Users className="size-6" style={{ color: '#94A3B8' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-card__title">{member.name}</div>
                    {member.role ? (
                      <div style={{ marginTop: 4 }}>
                        <span className="admin-pill admin-pill--neutral">{member.role}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="admin-card__fields">
                  {member.phone && <span><b>{t.fieldPhone}</b> <span dir="ltr">{member.phone}</span></span>}
                  {member.mobile && <span><b>{t.fieldMobile}</b> <span dir="ltr">{member.mobile}</span></span>}
                  {member.email && <span><b>{t.fieldEmail}</b> <span dir="ltr">{member.email}</span></span>}
                  <span><b>{t.fieldProperties}</b> {member.propertiesCount}</span>
                  <span><b>{t.fieldSold}</b> {member.soldCount}</span>
                  <span><b>{t.fieldOrder}</b> {member.order}</span>
                </div>
                <div className="admin-card__actions">
                  <Switch
                    checked={member.isActive}
                    onCheckedChange={(v) => handleStatusChange(member.id, v)}
                  />
                  <span className="admin-card__grow flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/team/${member.id}`}>
                        <Pencil className="size-4" />{t.edit}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTarget(member)}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteConfirmBody}{deleteTarget ? ` (${deleteTarget.name})` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => deleteTarget && deleteMember(deleteTarget)}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
