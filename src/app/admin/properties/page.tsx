'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
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

export default function PropertiesPage() {
  const t = useAdminMessages(propertiesMessages);
  const { dir } = useAdminI18n();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDealType, setFilterDealType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    fetchProperties();
  }, []);

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
      return matchesSearch && matchesDealType && matchesStatus;
    });

    // Push sold / rented-out properties (isSold) to the bottom of the list.
    // Array.sort is stable, so within each group the createdAt-desc order is kept.
    return filtered.sort((a, b) => Number(a.isSold) - Number(b.isSold));
  }, [properties, searchTerm, filterDealType, filterStatus]);

  // Keep the current page within range when filtering shrinks the result set
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [filteredProperties.length, pageSize, currentPage]);

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

  // Labelled toggle — replaces antd Switch's checkedChildren/unCheckedChildren text
  const statusToggle = (
    p: Property,
    field: 'isActive' | 'isSold',
    onLabel: string,
    offLabel: string
  ) => {
    const checked = p[field];
    return (
      <span className="flex items-center gap-2">
        <Switch checked={checked} onCheckedChange={(v) => handleStatusChange(p.id, field, v)} />
        <span className="text-xs font-medium text-muted-foreground">{checked ? onLabel : offLabel}</span>
      </span>
    );
  };

  const openDelete = (id: number) => {
    setSelectedProperty(id);
    setDeleteModal(true);
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

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex w-full flex-col gap-3">
          <div className="relative">
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
          <div className="admin-filter-full flex w-full flex-wrap gap-3">
            <Select
              value={filterDealType}
              onValueChange={(v) => {
                setFilterDealType(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-11 min-w-[150px]"><SelectValue /></SelectTrigger>
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
              <SelectTrigger className="h-11 min-w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.filterAllStatuses}</SelectItem>
                <SelectItem value="active">{t.statusActive}</SelectItem>
                <SelectItem value="inactive">{t.statusInactive}</SelectItem>
                <SelectItem value="sold">{t.statusSold}</SelectItem>
                <SelectItem value="available">{t.statusAvailable}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Property Table — desktop (≥768px) */}
      <div className="admin-only-desktop">
        <Card className="p-2">
          {loading ? (
            <div className="p-4"><Skeleton className="h-64 w-full" /></div>
          ) : totalItems === 0 ? (
            <AdminEmptyState message={t.emptyMessage} addHref="/admin/properties/new" addLabel={t.emptyAddLabel} />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">{t.colTitle}</TableHead>
                    <TableHead className="w-[100px]">{t.colDealType}</TableHead>
                    <TableHead className="w-[120px]">{t.colPrice}</TableHead>
                    <TableHead className="w-[80px] text-center">{t.colFloor}</TableHead>
                    <TableHead className="w-[130px]">{t.colStatus}</TableHead>
                    <TableHead className="w-[160px]">{t.colActions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((record) => (
                    <TableRow key={record.id} className={record.isSold ? 'sold-property-row' : ''}>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={record.images[0] || '/images/hero/sales.jpg'}
                            alt={record.title}
                            width={40}
                            height={40}
                            className="block size-10 shrink-0 rounded-lg object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/hero/sales.jpg';
                            }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <Link
                              href={`/admin/properties/${record.id}`}
                              style={{
                                display: 'block',
                                fontSize: 14,
                                fontWeight: 600,
                                color: '#354AC4',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {record.title}
                            </Link>
                            <div
                              style={{
                                fontSize: 12.5,
                                color: '#64748B',
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
                        <span className={`admin-pill admin-pill--${record.dealType === 'sale' ? 'sale' : 'rent'}`}>
                          {record.dealType === 'sale' ? t.dealSale : t.dealRent}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', display: 'inline-block', color: '#051150', fontWeight: 600 }}>
                          {formatPropertyPrice(record.price)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {record.floor && record.totalFloors
                          ? `${record.floor}/${record.totalFloors}`
                          : record.floor || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          {statusToggle(record, 'isActive', t.statusActive, t.switchOff)}
                          {statusToggle(record, 'isSold', record.dealType === 'rent' ? t.statusRented : t.statusSold, t.switchVacant)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button asChild variant="ghost" size="icon" aria-label={t.edit}>
                            <Link href={`/admin/properties/${record.id}`}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
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
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 py-1">
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
        ) : filteredProperties.length === 0 ? (
          <AdminEmptyState message={t.emptyMessage} addHref="/admin/properties/new" addLabel={t.emptyAddLabel} />
        ) : (
          <div className="admin-card-list">
            {filteredProperties.map((property) => {
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
                    {statusToggle(property, 'isActive', t.statusActive, t.switchOff)}
                    {statusToggle(property, 'isSold', property.dealType === 'rent' ? t.statusRented : t.statusSold, t.switchVacant)}
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
    </div>
  );
}
