'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Phone, Mail, Trash2, Eye, Home, Inbox, Star, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/shadcn/sonner';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Textarea } from '@/components/shadcn/textarea';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/shadcn/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/shadcn/dialog';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/shadcn/alert-dialog';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/shadcn/table';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/shadcn/tooltip';
import MetricCardGrid from '@/components/admin/MetricCardGrid';
import { IcInbox, IcStar, IcClock, IcCheckCircle } from '@/components/admin/AdminIcons';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminMessages, useAdminI18n } from '@/lib/adminI18n';
import { inquiriesMessages } from '@/lib/adminI18n/messages/inquiries';

interface Inquiry {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  status: 'new' | 'in_progress' | 'closed';
  source: string | null;
  agentId: string | null;
  notes: string | null;
  propertyId: number | null;
  property: { id: number; title: string; location: string } | null;
  createdAt: string;
}

interface TeamOption {
  id: number;
  name: string;
}

const STATUSES: Inquiry['status'][] = ['new', 'in_progress', 'closed'];

// Maps each status to its pill role class (see SHARED PILL-CLASS CONTRACT).
const STATUS_PILL_CLASS: Record<Inquiry['status'], string> = {
  new: 'new',
  in_progress: 'progress',
  closed: 'closed',
};

// Sentinel used to represent "unassigned" in the (clearable) agent select.
const NO_AGENT = '__none__';

export default function InquiriesPage() {
  const t = useAdminMessages(inquiriesMessages);
  const { locale } = useAdminI18n();
  const dateLocale = locale === 'he' ? 'he-IL' : 'en-GB';
  const statusLabels: Record<Inquiry['status'], string> = {
    new: t.statusNew,
    in_progress: t.statusInProgress,
    closed: t.statusClosed,
  };
  const statusPill = (status: Inquiry['status']) => (
    <span className={`admin-pill admin-pill--${STATUS_PILL_CLASS[status]}`}>
      {statusLabels[status]}
    </span>
  );
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [team, setTeam] = useState<TeamOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Inquiry['status']>('all');
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);

  // Details / edit modal
  const [active, setActive] = useState<Inquiry | null>(null);
  const [draftNotes, setDraftNotes] = useState('');
  const [draftAgent, setDraftAgent] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInquiries();
    fetchTeam();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      if (!res.ok) throw new Error('failed');
      setInquiries(await res.json());
    } catch {
      toast.error(t.loadError);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/admin/team');
      if (res.ok) {
        const data = await res.json();
        setTeam((data || []).map((tm: any) => ({ id: tm.id, name: tm.name })));
      }
    } catch {
      /* non-fatal — agent assignment just won't have options */
    }
  };

  const patchInquiry = async (id: number, body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('failed');
    return res.json();
  };

  const changeStatus = async (id: number, status: Inquiry['status']) => {
    // Optimistic update for snappy status changes.
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    try {
      await patchInquiry(id, { status });
    } catch {
      toast.error(t.statusUpdateError);
      fetchInquiries();
    }
  };

  const openDetails = (inq: Inquiry) => {
    setActive(inq);
    setDraftNotes(inq.notes || '');
    setDraftAgent(inq.agentId || undefined);
  };

  const saveDetails = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const updated = await patchInquiry(active.id, {
        notes: draftNotes,
        agentId: draftAgent ?? null,
      });
      setInquiries((prev) => prev.map((i) => (i.id === active.id ? { ...i, ...updated } : i)));
      toast.success(t.updated);
      setActive(null);
    } catch {
      toast.error(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  const deleteInquiry = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('failed');
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      toast.success(t.deleted);
    } catch {
      toast.error(t.deleteError);
    } finally {
      setDeleteTarget(null);
    }
  };

  const stats = useMemo(() => {
    const by = (s: Inquiry['status']) => inquiries.filter((i) => i.status === s).length;
    return { total: inquiries.length, new: by('new'), in_progress: by('in_progress'), closed: by('closed') };
  }, [inquiries]);

  const filtered = useMemo(
    () => (filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter)),
    [inquiries, filter]
  );

  const agentName = (agentId: string | null) => {
    if (!agentId) return null;
    const id = Number(agentId.replace(/^team-/, ''));
    return team.find((tm) => tm.id === id)?.name || agentId;
  };

  const dash = <span className="text-slate-400">—</span>;

  const filterOptions: { label: string; value: 'all' | Inquiry['status'] }[] = [
    { label: t.filterAll(stats.total), value: 'all' },
    { label: t.filterNew(stats.new), value: 'new' },
    { label: t.filterInProgress(stats.in_progress), value: 'in_progress' },
    { label: t.filterClosed(stats.closed), value: 'closed' },
  ];

  const statusSelect = (r: Inquiry, triggerClass: string) => (
    <Select value={r.status} onValueChange={(v) => changeStatus(r.id, v as Inquiry['status'])}>
      <SelectTrigger className={triggerClass}><SelectValue /></SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s} value={s}>{statusPill(s)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div>
      <AdminPageHeader title={t.title} />

      <MetricCardGrid
        items={[
          { icon: <IcInbox className="size-5" />, label: t.statTotal, value: stats.total, accent: '#354AC4' },
          { icon: <IcStar className="size-5" />, label: t.statNew, value: stats.new, accent: '#5594F1' },
          { icon: <IcClock className="size-5" />, label: t.statInProgress, value: stats.in_progress, accent: '#354AC4' },
          { icon: <IcCheckCircle className="size-5" />, label: t.statClosed, value: stats.closed, accent: '#2A69C4' },
        ]}
      />

      <Card className="p-4">
        {/* filter toggle */}
        <div className="mb-4 overflow-x-auto">
          <div role="group" className="inline-flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
            {filterOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setFilter(o.value)}
                aria-pressed={filter === o.value}
                className={cn(
                  'whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                  filter === o.value
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* desktop — table */}
        <div className="admin-only-desktop">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : filtered.length === 0 ? (
            <AdminEmptyState message={t.empty} />
          ) : (
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[130px]">{t.colStatus}</TableHead>
                  <TableHead>{t.colClient}</TableHead>
                  <TableHead>{t.colMessage}</TableHead>
                  <TableHead className="w-[150px]">{t.colProperty}</TableHead>
                  <TableHead className="w-[110px]">{t.colAgent}</TableHead>
                  <TableHead className="w-[120px]">{t.colDate}</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{statusSelect(r, 'h-8 w-[120px]')}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => openDetails(r)}
                        className="cursor-pointer border-0 bg-transparent p-0 text-start font-semibold text-[#051150]"
                      >
                        {r.name}
                      </button>
                      <div className="mt-1 flex flex-wrap gap-3 text-[13px]">
                        {r.phone && (
                          <a href={`tel:${r.phone}`} className="inline-flex items-center gap-1 text-[#354AC4]">
                            <Phone className="size-3.5" /> {r.phone}
                          </a>
                        )}
                        {r.email && (
                          <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 text-[#354AC4]">
                            <Mail className="size-3.5" /> {r.email}
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {r.message ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="block max-w-[280px] truncate">{r.message}</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs whitespace-pre-wrap">{r.message}</TooltipContent>
                        </Tooltip>
                      ) : (
                        dash
                      )}
                    </TableCell>
                    <TableCell>
                      {r.property ? (
                        <Link
                          href={`/admin/properties/${r.property.id}`}
                          className="inline-flex items-center gap-1 text-[#354AC4]"
                        >
                          <Home className="size-3.5" /> {r.property.title}
                        </Link>
                      ) : (
                        dash
                      )}
                    </TableCell>
                    <TableCell>{agentName(r.agentId) || dash}</TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleDateString(dateLocale)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetails(r)}
                              aria-label={t.detailsTooltip}
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t.detailsTooltip}</TooltipContent>
                        </Tooltip>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeleteTarget(r)}
                          aria-label={t.deleteButton}
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
        </div>

        {/* mobile — card list */}
        <div className="admin-only-mobile">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : filtered.length === 0 ? (
            <AdminEmptyState message={t.empty} />
          ) : (
            <div className="admin-card-list">
              {filtered.map((r) => (
                <div key={r.id} className="admin-card">
                  <div className="admin-card__head">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="admin-card__title">{r.name}</div>
                      <div className="admin-card__meta">
                        {new Date(r.createdAt).toLocaleDateString(dateLocale)}
                      </div>
                    </div>
                    {statusSelect(r, 'w-[120px]')}
                  </div>

                  <div className="admin-card__fields">
                    {r.phone && (
                      <span>
                        <b>{t.fieldPhone}</b>{' '}
                        <a href={`tel:${r.phone}`} className="text-[#354AC4]">
                          {r.phone}
                        </a>
                      </span>
                    )}
                    {r.email && (
                      <span>
                        <b>{t.fieldEmail}</b>{' '}
                        <a href={`mailto:${r.email}`} className="text-[#354AC4]">
                          {r.email}
                        </a>
                      </span>
                    )}
                    {r.property && (
                      <span>
                        <b>{t.fieldProperty}</b>{' '}
                        <Link href={`/admin/properties/${r.property.id}`} className="text-[#354AC4]">
                          {r.property.title}
                        </Link>
                      </span>
                    )}
                    {agentName(r.agentId) && (
                      <span>
                        <b>{t.fieldAgent}</b> {agentName(r.agentId)}
                      </span>
                    )}
                  </div>

                  <div className="admin-card__actions">
                    <Button type="button" variant="outline" size="sm" onClick={() => openDetails(r)}>
                      <Eye className="size-4" />{t.detailsButton}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTarget(r)}
                    >
                      <Trash2 className="size-4" />{t.deleteButton}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Details modal */}
      <Dialog open={!!active} onOpenChange={(o) => { if (!o) setActive(null); }}>
        <DialogContent className="max-w-[440px]">
          <DialogHeader>
            <DialogTitle>{active ? t.modalTitle(active.name) : ''}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="flex flex-col gap-4">
              <div>{statusPill(active.status)}</div>

              {active.message && (
                <div>
                  <div className="mb-1 text-[12.5px] text-[#64748B]">{t.messageLabel}</div>
                  <div className="whitespace-pre-wrap rounded-lg bg-[#F1F3F5] p-3">
                    {active.message}
                  </div>
                </div>
              )}

              {active.phone && (
                <div>
                  <div className="mb-0.5 text-[12.5px] text-[#64748B]">{t.fieldPhone}</div>
                  <a href={`tel:${active.phone}`} className="inline-flex items-center gap-1 text-[#354AC4]">
                    <Phone className="size-3.5" /> {active.phone}
                  </a>
                </div>
              )}
              {active.email && (
                <div>
                  <div className="mb-0.5 text-[12.5px] text-[#64748B]">{t.fieldEmail}</div>
                  <a href={`mailto:${active.email}`} className="inline-flex items-center gap-1 text-[#354AC4]">
                    <Mail className="size-3.5" /> {active.email}
                  </a>
                </div>
              )}
              {active.source && (
                <div className="text-[13px] text-[#94A3B8]">{t.sourceLabel(active.source)}</div>
              )}

              <div>
                <div className="mb-1 text-[12.5px] text-[#64748B]">{t.assignedAgent}</div>
                <Select
                  value={draftAgent ?? ''}
                  onValueChange={(v) => setDraftAgent(v === NO_AGENT ? undefined : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t.assignAgentPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_AGENT}>{t.assignAgentPlaceholder}</SelectItem>
                    {team.map((tm) => (
                      <SelectItem key={tm.id} value={`team-${tm.id}`}>{tm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="mb-1 text-[12.5px] text-[#64748B]">{t.internalNotes}</div>
                <Textarea
                  rows={4}
                  value={draftNotes}
                  onChange={(e) => setDraftNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                />
              </div>
            </div>
          )}
          <DialogFooter className="mt-2 gap-2">
            <Button type="button" variant="outline" onClick={() => setActive(null)}>{t.close}</Button>
            <Button type="button" disabled={saving} onClick={saveDetails}>{saving ? '…' : t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirm}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => deleteTarget && deleteInquiry(deleteTarget.id)}>
              {t.deleteOk}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
