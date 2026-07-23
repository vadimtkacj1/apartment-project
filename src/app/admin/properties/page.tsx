'use client';

import React, { useState, useEffect, useMemo, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  Home,
  Search,
  Tag,
  Key,
  CheckCircle2,
  Ban,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  X,
} from 'lucide-react';
import { toast } from '@/components/shadcn/sonner';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Switch } from '@/components/shadcn/switch';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/shadcn/select';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/shadcn/table';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/shadcn/alert-dialog';
import MetricCard from '@/components/admin/MetricCard';
import { IcBuilding, IcTag, IcKey, IcCheckCircle, IcBan } from '@/components/admin/AdminIcons';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminMessages, useAdminI18n } from '@/lib/adminI18n';
import { propertiesMessages } from '@/lib/adminI18n/messages/properties';
import type { DealType } from '@/types/property.types';
import { getCityLabel } from '@/data/cities';

interface Property {
  id: number;
  dealType: DealType;
  city: string;
  neighborhood: string | null;
  street: string | null;
  streetNumber: string | null;
  apartmentNumber: string | null;
  latitude: number | null;
  longitude: number | null;
  location: string;
  propertyType: string;
  floor: number | null;
  totalFloors: number | null;
  parking: string;
  position: string | null;
  furniture: string;
  directions: string[];
  kitchen: string | null;
  rooms: number;
  area: number;
  builtArea: number | null;
  vacancyDate: string | null;
  hasAirConditioning: boolean;
  hasDisabledAccess: boolean;
  hasSunBalcony: boolean;
  hasStorage: boolean;
  hasSunroom: boolean;
  hasBoiler: boolean;
  hasSafeRoom: boolean;
  hasElevator: boolean;
  title: string;
  description: string;
  price: string;
  originalPrice: string | null;
  images: string[];
  status: string | null;
  bedrooms: number;
  bathrooms: number;
  category: string | null;
  isActive: boolean;
  isSold: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// Persist table view (page + filters) so editing/toggling a property keeps your place
const TABLE_STATE_KEY = 'admin-properties-table-state';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Shared ₪ formatting used by both the desktop table and the mobile card list
function formatPropertyPrice(price: string): string {
  const n = parseInt(String(price ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? `₪${n.toLocaleString('en-US')}` : `₪${price}`;
}

// Numeric price for comparisons (mirrors the dashboard's parseMoney)
const parseMoney = (s: string | null | undefined): number =>
  parseInt(String(s ?? '0').replace(/[^0-9]/g, ''), 10) || 0;

// Deep-link "attention" filters — definitions mirror the dashboard's attention queue:
// price-drop = originalPrice > price, no-photos = no images, hidden = !isActive, sold = isSold
const ATTENTION_FILTERS = ['no-photos', 'price-drop', 'hidden', 'sold'] as const;
type AttentionFilter = (typeof ATTENTION_FILTERS)[number];

// useSearchParams requires a Suspense boundary at the page level
export default function PropertiesPage() {
  return (
    <Suspense fallback={null}>
      <PropertiesPageInner />
    </Suspense>
  );
}

function PropertiesPageInner() {
  const t = useAdminMessages(propertiesMessages);
  const { dir } = useAdminI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDealType, setFilterDealType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [attentionFilter, setAttentionFilter] = useState<AttentionFilter | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [bulkBusy, setBulkBusy] = useState(false);

  // Skip persisting on the very first render (before saved state is restored)
  const skipFirstPersist = useRef(true);

  useEffect(() => {
    // Restore saved table view (page, page size, search, filters) from this session
    try {
      const saved = sessionStorage.getItem(TABLE_STATE_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        if (typeof s.searchTerm === 'string') setSearchTerm(s.searchTerm);
        if (typeof s.filterDealType === 'string') setFilterDealType(s.filterDealType);
        if (typeof s.filterStatus === 'string') setFilterStatus(s.filterStatus);
        if (typeof s.currentPage === 'number') setCurrentPage(s.currentPage);
        if (typeof s.pageSize === 'number') setPageSize(s.pageSize);
      }
    } catch {
      // ignore malformed/blocked storage
    }
    // Deep-link from the dashboard attention queue — the URL param wins on first
    // load and applies its client-side filter on top of the restored view.
    const att = searchParams.get('attention');
    if (att && (ATTENTION_FILTERS as readonly string[]).includes(att)) {
      setAttentionFilter(att as AttentionFilter);
      setCurrentPage(1);
    }
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAttentionFilter = () => {
    setAttentionFilter(null);
    setCurrentPage(1);
    // Drop the ?attention= param without a navigation so the rest of the view state stays put
    window.history.replaceState(null, '', window.location.pathname);
  };

  // Persist the table view whenever it changes
  useEffect(() => {
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false;
      return;
    }
    try {
      sessionStorage.setItem(
        TABLE_STATE_KEY,
        JSON.stringify({ searchTerm, filterDealType, filterStatus, currentPage, pageSize })
      );
    } catch {
      // ignore quota/blocked storage
    }
  }, [searchTerm, filterDealType, filterStatus, currentPage, pageSize]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/admin/properties');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      toast.error(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = properties.length;
    const forSale = properties.filter((p) => p.dealType === 'sale').length;
    const forRent = properties.filter((p) => p.dealType === 'rent').length;
    const active = properties.filter((p) => p.isActive).length;
    const sold = properties.filter((p) => p.isSold).length;
    return { total, forSale, forRent, active, sold };
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const filtered = properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDealType = filterDealType === 'all' || property.dealType === filterDealType;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && property.isActive) ||
        (filterStatus === 'inactive' && !property.isActive) ||
        (filterStatus === 'sold' && property.isSold) ||
        (filterStatus === 'available' && !property.isSold);
      const matchesAttention =
        !attentionFilter ||
        (attentionFilter === 'no-photos' && (!property.images || property.images.length === 0)) ||
        (attentionFilter === 'price-drop' &&
          !!property.originalPrice &&
          parseMoney(property.originalPrice) > parseMoney(property.price)) ||
        (attentionFilter === 'hidden' && !property.isActive) ||
        (attentionFilter === 'sold' && property.isSold);
      return matchesSearch && matchesDealType && matchesStatus && matchesAttention;
    });

    // Push sold / rented-out properties (isSold) to the bottom of the list.
    // Array.sort is stable, so within each group the createdAt-desc order is kept.
    return filtered.sort((a, b) => Number(a.isSold) - Number(b.isSold));
  }, [properties, searchTerm, filterDealType, filterStatus, attentionFilter]);

  // Keep the current page within range when filtering shrinks the result set
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [filteredProperties.length, pageSize, currentPage]);

  // Drop selections that no longer exist (e.g. after a delete + refetch)
  useEffect(() => {
    setSelectedIds((prev) => {
      const next = prev.filter((id) => properties.some((p) => p.id === id));
      return next.length === prev.length ? prev : next;
    });
  }, [properties]);

  // Client-side pagination (replaces antd Table's built-in pager)
  const totalItems = filteredProperties.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageItems = filteredProperties.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async () => {
    if (!selectedProperty) return;
    try {
      const response = await fetch(`/api/admin/properties/${selectedProperty}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setDeleteModal(false);
      setSelectedProperty(null);
      fetchProperties();
      toast.success(t.deleteSuccess);
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error(t.deleteError);
    }
  };

  const handleStatusChange = async (
    propertyId: number,
    field: 'isActive' | 'isSold' | 'isPinned',
    value: boolean
  ) => {
    // Optimistic UI update for snappier toggles
    setProperties((prev) =>
      prev.map((property) =>
        property.id === propertyId ? { ...property, [field]: value } : property
      )
    );

    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Get the property to check dealType for proper messaging
      const property = properties.find((p) => p.id === propertyId);
      const soldText = property?.dealType === 'rent' ? t.statusRented : t.statusSold;

      const msgs: Record<string, string> = {
        isSold: value ? t.markedAs(soldText) : t.unmarkedAs(soldText),
        isPinned: value ? t.pinnedToHome : t.unpinnedFromHome,
        isActive: value ? t.activated : t.deactivated,
      };
      toast.success(msgs[field]);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(t.statusUpdateError);
      // Revert optimistic update on error
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId ? { ...property, [field]: !value } : property
        )
      );
    }
  };

  // One featured active/hidden Switch per row (replaces the old double toggle).
  const activeSwitch = (p: Property) => (
    <span className="flex items-center gap-2">
      <Switch
        checked={p.isActive}
        onCheckedChange={(v) => handleStatusChange(p.id, 'isActive', v)}
        aria-label={t.statusActive}
      />
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>
        {p.isActive ? t.statusActive : t.switchOff}
      </span>
    </span>
  );

  // Sold/active lifecycle as a quiet dot+word (live = --pos, sold/rented = muted).
  // Stays interactive so the sold state can still be toggled inline — mutation
  // logic (handleStatusChange) is unchanged.
  const lifecycleStatus = (p: Property) => {
    const soldWord = p.dealType === 'rent' ? t.statusRented : t.statusSold;
    return (
      <button
        type="button"
        onClick={() => handleStatusChange(p.id, 'isSold', !p.isSold)}
        className={`status ${p.isSold ? 'status--sold' : 'status--live'}`}
        style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
        title={p.isSold ? t.unmarkedAs(soldWord) : t.markedAs(soldWord)}
      >
        {p.isSold ? soldWord : t.statusAvailable}
      </button>
    );
  };

  const openDelete = (id: number) => {
    setSelectedProperty(id);
    setDeleteModal(true);
  };

  // ── Bulk selection (desktop table only) ──
  const pageIds = pageItems.map((p) => p.id);
  const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));
  const allPageSelected = pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const somePageSelected = selectedOnPage.length > 0 && !allPageSelected;

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, ...pageIds])) : prev.filter((id) => !pageIds.includes(id))
    );
  };

  const toggleSelectRow = (id: number, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  // Bulk activate/deactivate via the existing per-item PATCH endpoint — optimistic,
  // one summary toast (partial failures re-sync from the server).
  const handleBulkStatus = async (value: boolean) => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    setBulkBusy(true);
    const prev = properties;
    setProperties((ps) => ps.map((p) => (ids.includes(p.id) ? { ...p, isActive: value } : p)));
    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          const r = await fetch(`/api/admin/properties/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: value }),
          });
          return r.ok;
        })
      );
      const failed = results.filter((ok) => !ok).length;
      if (failed > 0) {
        toast.error(t.bulkPartialError(failed));
        fetchProperties();
      } else {
        toast.success(t.bulkUpdateSuccess(ids.length));
      }
      setSelectedIds([]);
    } catch (error) {
      console.error('Error bulk-updating properties:', error);
      setProperties(prev);
      toast.error(t.statusUpdateError);
    } finally {
      setBulkBusy(false);
    }
  };

  // Bulk delete via the existing per-item DELETE endpoint — one summary toast.
  const handleBulkDelete = async () => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    setBulkBusy(true);
    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          const r = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
          return r.ok;
        })
      );
      const failed = results.filter((ok) => !ok).length;
      setBulkDeleteModal(false);
      setSelectedIds([]);
      fetchProperties();
      if (failed > 0) toast.error(t.bulkPartialError(failed));
      else toast.success(t.bulkDeleteSuccess(ids.length));
    } catch (error) {
      console.error('Error bulk-deleting properties:', error);
      toast.error(t.deleteError);
    } finally {
      setBulkBusy(false);
    }
  };

  // Duplicate: fetch the full record (the list payload is a subset), strip identity
  // fields, save as an inactive/unflagged copy via the existing create endpoint.
  const handleDuplicate = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const full = await res.json();
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = full;
      const response = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rest,
          title: `${full.title}${t.copySuffix}`,
          isActive: false,
          isPinned: false,
          isHotProposition: false,
          isNoCommission: false,
          isSold: false,
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const created = await response.json();
      fetchProperties();
      toast.success(t.duplicateSuccess, {
        action: { label: t.edit, onClick: () => router.push(`/admin/properties/${created.id}`) },
      });
    } catch (error) {
      console.error('Error duplicating property:', error);
      toast.error(t.duplicateError);
    }
  };

  const attentionChipLabels: Record<AttentionFilter, string> = {
    'price-drop': t.attentionPriceDrop,
    'no-photos': t.attentionNoPhotos,
    hidden: t.attentionHidden,
    sold: t.attentionSold,
  };

  return (
    <div>
      {/* Header */}
      <AdminPageHeader
        title={t.pageTitle}
        extra={
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/admin/properties/new">
              <Plus className="size-4" />
              {t.addNewProperty}
            </Link>
          </Button>
        }
      />

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: t.statTotal, value: stats.total, icon: <IcBuilding className="size-5" />, accent: '#354AC4' },
          { label: t.statForSale, value: stats.forSale, icon: <IcTag className="size-5" />, accent: '#354AC4' },
          { label: t.statForRent, value: stats.forRent, icon: <IcKey className="size-5" />, accent: '#5594F1' },
          { label: t.statActive, value: stats.active, icon: <IcCheckCircle className="size-5" />, accent: '#2A69C4' },
          { label: t.statSold, value: stats.sold, icon: <IcBan className="size-5" />, accent: '#64748B' },
        ].map((s) => (
          <MetricCard key={String(s.label)} icon={s.icon} label={s.label} value={s.value} accent={s.accent} />
        ))}
      </div>

      {/* Filters — one calm row: search grows, selects sit at inline-end (stack on mobile) */}
      <Card className="mb-6 p-4">
        <div className="admin-filter-full flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:min-w-0 sm:flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              className="h-11 ps-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Select
            value={filterDealType}
            onValueChange={(v) => {
              setFilterDealType(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-11 w-full sm:w-auto sm:min-w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAllDealTypes}</SelectItem>
              <SelectItem value="sale">{t.dealSale}</SelectItem>
              <SelectItem value="rent">{t.dealRent}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(v) => {
              setFilterStatus(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-11 w-full sm:w-auto sm:min-w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filterAllStatuses}</SelectItem>
              <SelectItem value="active">{t.statusActive}</SelectItem>
              <SelectItem value="inactive">{t.statusInactive}</SelectItem>
              <SelectItem value="sold">{t.statusSold}</SelectItem>
              <SelectItem value="available">{t.statusAvailable}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Active attention deep-link filter — chip with clear (×) */}
      {attentionFilter && (
        <div className="mb-4 flex items-center gap-2">
          <span
            className="admin-pill inline-flex items-center gap-1.5"
            style={{ background: 'var(--brand-tint)', color: 'var(--brand)' }}
          >
            {attentionChipLabels[attentionFilter]}
            <button
              type="button"
              onClick={clearAttentionFilter}
              aria-label={t.filterChipClear}
              className="inline-flex items-center justify-center rounded-full hover:bg-[#354AC4]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3.5" />
            </button>
          </span>
        </div>
      )}

      {/* Property Table — desktop (≥768px) */}
      <div className="admin-only-desktop">
        {/* Bulk action bar — appears when rows are selected */}
        {selectedIds.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-[10px] border border-border bg-[var(--surface)] px-4 py-2 shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">
              {t.selectedCount(selectedIds.length)}
            </span>
            <span className="ms-auto flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={bulkBusy} onClick={() => handleBulkStatus(true)}>
                <CheckCircle2 className="size-4" />
                {t.bulkActivate}
              </Button>
              <Button variant="outline" size="sm" disabled={bulkBusy} onClick={() => handleBulkStatus(false)}>
                <Ban className="size-4" />
                {t.bulkDeactivate}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={bulkBusy}
                onClick={() => setBulkDeleteModal(true)}
              >
                <Trash2 className="size-4" />
                {t.delete}
              </Button>
            </span>
          </div>
        )}
        <Card className="overflow-hidden p-0">
          {loading ? (
            <div className="p-4"><Skeleton className="h-64 w-full" /></div>
          ) : totalItems === 0 ? (
            <AdminEmptyState message={t.emptyMessage} addHref="/admin/properties/new" addLabel={t.emptyAddLabel} />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="h-11 bg-[var(--surface-sunken)] hover:bg-[var(--surface-sunken)]">
                    <TableHead className="h-11 w-11 normal-case tracking-normal">
                      <Checkbox
                        checked={allPageSelected ? true : somePageSelected ? 'indeterminate' : false}
                        onCheckedChange={(v) => toggleSelectAll(v === true)}
                        aria-label={t.selectAllAria}
                      />
                    </TableHead>
                    <TableHead className="h-11 w-[320px] normal-case tracking-normal">{t.colTitle}</TableHead>
                    <TableHead className="h-11 w-[110px] normal-case tracking-normal">{t.colDealType}</TableHead>
                    <TableHead className="h-11 w-[130px] text-end normal-case tracking-normal">{t.colPrice}</TableHead>
                    <TableHead className="h-11 w-[90px] text-end normal-case tracking-normal">{t.colFloor}</TableHead>
                    <TableHead className="h-11 w-[160px] normal-case tracking-normal">{t.colStatus}</TableHead>
                    <TableHead className="h-11 w-[170px] normal-case tracking-normal">{t.colActions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((record) => (
                    <TableRow
                      key={record.id}
                      className={`group h-16 border-b border-[var(--divider)] hover:bg-[var(--surface-hover)]${record.isSold ? ' sold-property-row' : ''}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(record.id)}
                          onCheckedChange={(v) => toggleSelectRow(record.id, v === true)}
                          aria-label={t.selectRowAria(record.title)}
                        />
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={record.images[0] || '/images/hero/sales.jpg'}
                            alt={record.title}
                            width={56}
                            height={42}
                            className="block shrink-0 object-cover"
                            style={{ width: 56, height: 42, borderRadius: 8 }}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/hero/sales.jpg';
                            }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <Link
                              href={`/admin/properties/${record.id}`}
                              style={{
                                display: 'block',
                                fontSize: 15,
                                fontWeight: 600,
                                color: 'var(--text-ink)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {record.title}
                            </Link>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 400,
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {`${getCityLabel(record.city) || record.location} · ${t.roomsShort(record.rooms)} · ${t.sqm(record.area)}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className="admin-pill"
                          style={
                            record.dealType === 'sale'
                              ? { background: 'var(--brand-tint)', color: 'var(--brand)' }
                              : { background: '#e8f1fe', color: '#2f6fd0' }
                          }
                        >
                          {record.dealType === 'sale' ? t.dealSale : t.dealRent}
                        </span>
                      </TableCell>
                      <TableCell className="text-end">
                        <bdi
                          dir="ltr"
                          style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-ink)', fontWeight: 600 }}
                        >
                          {formatPropertyPrice(record.price)}
                        </bdi>
                      </TableCell>
                      <TableCell className="text-end">
                        <bdi dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', color: 'var(--text-body)' }}>
                          {record.floor && record.totalFloors
                            ? `${record.floor}/${record.totalFloors}`
                            : record.floor || '-'}
                        </bdi>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-2">
                          {activeSwitch(record)}
                          {lifecycleStatus(record)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            asChild variant="ghost" size="icon" aria-label={t.edit}
                            className="text-slate-500 hover:bg-[#354AC4]/10 hover:text-[#354AC4]"
                          >
                            <Link href={`/admin/properties/${record.id}`}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-500 hover:bg-[#354AC4]/10 hover:text-[#354AC4]"
                            onClick={() => handleDuplicate(record.id)}
                            aria-label={t.duplicate}
                          >
                            <Copy className="size-4" />
                          </Button>
                          {record.isActive && (
                            <Button
                              asChild variant="ghost" size="icon" aria-label={t.openOnSite}
                              className="text-slate-500 hover:bg-[#354AC4]/10 hover:text-[#354AC4]"
                            >
                              <a href={`/apartments/${record.id}`} target="_blank" rel="noopener">
                                <ExternalLink className="size-4" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => openDelete(record.id)}
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

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--divider)] px-4 py-3">
                <span className="text-sm text-muted-foreground">{t.tableTotal(totalItems)}</span>
                <div className="flex items-center gap-2">
                  <Select
                    value={String(pageSize)}
                    onValueChange={(v) => {
                      setPageSize(Number(v));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 w-[90px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                    >
                      {dir === 'rtl' ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                    </Button>
                    <span dir="ltr" className="min-w-[64px] text-center text-sm tabular-nums text-muted-foreground">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      aria-label="Next page"
                    >
                      {dir === 'rtl' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Property list — mobile (<768px) card view */}
      <div className="admin-only-mobile">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : totalItems === 0 ? (
          <AdminEmptyState message={t.emptyMessage} addHref="/admin/properties/new" addLabel={t.emptyAddLabel} />
        ) : (
          <>
          <div className="admin-card-list">
            {pageItems.map((property) => {
              const cityLabel = getCityLabel(property.city) || property.city;
              const metaParts = [
                cityLabel || property.location,
                t.roomsShort(property.rooms),
                t.sqm(property.area),
              ];
              if (property.floor) {
                metaParts.push(
                  property.totalFloors
                    ? t.floorOf(property.floor, property.totalFloors)
                    : t.floorOnly(property.floor)
                );
              }
              return (
                <div key={property.id} className={`admin-card${property.isSold ? ' sold-property-row' : ''}`}>
                  <div className="admin-card__head">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="admin-card__thumb"
                      src={property.images[0] || '/images/hero/sales.jpg'}
                      alt={property.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/hero/sales.jpg';
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="admin-card__title">{property.title}</div>
                      <div className="admin-card__meta">{metaParts.join(' · ')}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                      <span className={`admin-pill admin-pill--${property.dealType === 'sale' ? 'sale' : 'rent'}`}>
                        {property.dealType === 'sale' ? t.dealSale : t.dealRent}
                      </span>
                      <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', fontWeight: 600, color: '#051150' }}>
                        {formatPropertyPrice(property.price)}
                      </span>
                    </div>
                  </div>
                  <div className="admin-card__fields">
                    <span><b>{t.colRooms}</b> {property.rooms}</span>
                    <span><b>{t.colArea}</b> {t.sqm(property.area)}</span>
                    <span>
                      <b>{t.colFloor}</b>{' '}
                      {property.floor && property.totalFloors
                        ? `${property.floor}/${property.totalFloors}`
                        : property.floor || '-'}
                    </span>
                  </div>
                  <div className="admin-card__actions">
                    {activeSwitch(property)}
                    {lifecycleStatus(property)}
                    <span className="admin-card__grow" style={{ display: 'flex', gap: 8 }}>
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/admin/properties/${property.id}`}>
                          <Pencil className="size-4" />
                          {t.edit}
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        style={{ marginInlineStart: 'auto' }}
                        onClick={() => openDelete(property.id)}
                      >
                        <Trash2 className="size-4" />
                        {t.delete}
                      </Button>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile pagination — same slice as desktop, compact prev/next pager */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-9"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                {dir === 'rtl' ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
              </Button>
              <span dir="ltr" className="min-w-[64px] text-center text-sm tabular-nums text-muted-foreground">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="size-9"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                {dir === 'rtl' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
              </Button>
            </div>
          )}
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteModal}
        onOpenChange={(o) => {
          if (!o) {
            setDeleteModal(false);
            setSelectedProperty(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteModalTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteModalContent}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkDeleteModal} onOpenChange={(o) => !o && setBulkDeleteModal(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.bulkDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.bulkDeleteContent(selectedIds.length)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleBulkDelete}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
