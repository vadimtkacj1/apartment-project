'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { DealType } from '@/types/property.types';
import { toast } from '@/components/shadcn/sonner';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Badge } from '@/components/shadcn/badge';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Skeleton } from '@/components/shadcn/skeleton';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/shadcn/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/shadcn/dialog';
import { useAdminMessages } from '@/lib/adminI18n';
import { homepageMessages } from '@/lib/adminI18n/messages/homepage';

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
  isHotProposition: boolean;
  isNoCommission: boolean;
}

const FALLBACK_IMG = '/images/hero/sales.jpg';

/** Property image with shared fallback handling — the single place the raw <img> lives. */
function PropertyThumb({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  return (
    <img
      className={className}
      src={src || FALLBACK_IMG}
      alt={alt}
      onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
    />
  );
}

export default function HomepagePage() {
  const t = useAdminMessages(homepageMessages);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [hotProperties, setHotProperties] = useState<Property[]>([]);
  const [noCommissionProperties, setNoCommissionProperties] = useState<Property[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'hot' | 'noCommission'>('hot');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Price filter settings for Hot Propositions
  const [hotPropositionsMode, setHotPropositionsMode] = useState<'manual' | 'price'>('manual');
  const [hotPropositionsMaxPrice, setHotPropositionsMaxPrice] = useState<number>(3000000);

  // Section titles — default CONTENT values for the public (Hebrew-only) site;
  // intentionally not localized, they are data rather than admin UI strings.
  const [sectionTitles, setSectionTitles] = useState({
    hotPropositionsTitle: 'הצעות חמות',
    featuredPropertiesTitle: 'נכסים באיזור המרכז',
    featuredPropertiesSubtitle: 'מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז',
    valuesSectionTitle: 'למה לבחור בנו?',
    aboutSectionTitle: 'אודות',
    processSectionTitle: 'מה חשוב לדעת כשקונים נכס?',
    testimonialsTitle: 'מה הלקוחות שלנו אומרים',
    noCommissionTitle: 'דירה ללא עמלת תיווך',
  });
  const [titlesLoading, setTitlesLoading] = useState(true);
  const [titlesSaving, setTitlesSaving] = useState(false);

  const setTitle = (key: keyof typeof sectionTitles, value: string) => {
    setSectionTitles((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('hotPropositionsMode');
    const savedPrice = localStorage.getItem('hotPropositionsMaxPrice');

    if (savedMode) setHotPropositionsMode(savedMode as 'manual' | 'price');
    if (savedPrice) setHotPropositionsMaxPrice(parseInt(savedPrice));
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('hotPropositionsMode', hotPropositionsMode);
    localStorage.setItem('hotPropositionsMaxPrice', hotPropositionsMaxPrice.toString());
  }, [hotPropositionsMode, hotPropositionsMaxPrice]);

  useEffect(() => {
    fetchProperties();
    fetchSectionTitles();
  }, []);

  const fetchSectionTitles = async () => {
    try {
      setTitlesLoading(true);
      const response = await fetch('/api/admin/homepage-titles', {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Not authenticated - using default titles');
          return;
        }
        throw new Error('Failed to fetch titles');
      }

      const data = await response.json();
      setSectionTitles(data);
    } catch (error) {
      console.error('Error fetching section titles:', error);
      console.warn('Using default section titles');
    } finally {
      setTitlesLoading(false);
    }
  };

  // Toast-free: success/error feedback belongs to handleSaveEverything (one toast total).
  const handleSaveTitles = async () => {
    setTitlesSaving(true);
    try {
      const response = await fetch('/api/admin/homepage-titles', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionTitles),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: Failed to save titles`);
      }

      const data = await response.json();
      if (data.settings) {
        setSectionTitles(data.settings);
      } else if (data) {
        setSectionTitles(data);
      }
    } finally {
      setTitlesSaving(false);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/properties');
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data: Property[] = await response.json();

      setAllProperties(data);
      setHotProperties(data.filter(p => p.isHotProposition));
      setNoCommissionProperties(data.filter(p => p.isNoCommission));
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error(t.propertiesLoadError);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: 'hot' | 'noCommission') => {
    setModalType(type);
    const currentIds = type === 'hot'
      ? hotProperties.map(p => p.id)
      : noCommissionProperties.map(p => p.id);
    setSelectedIds(currentIds);
    setIsModalVisible(true);
  };

  const handleRadioChange = (id: number) => {
    setSelectedIds([id]);
  };

  const togglePick = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === availableProperties.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(availableProperties.map(p => p.id));
    }
  };

  const handleModalOk = () => {
    const selectedProperties = allProperties.filter(p => selectedIds.includes(p.id));

    if (modalType === 'noCommission' && selectedProperties.length > 1) {
      toast.warning(t.onlyOneNoCommissionWarning);
      return;
    }

    if (modalType === 'hot') {
      setHotProperties(selectedProperties);
      toast.success(t.propertiesSelected);
    } else {
      setNoCommissionProperties(selectedProperties);
      toast.success(t.propertySelected);
    }

    setDirty(true);
    setIsModalVisible(false);
  };

  const handleRemove = (id: number, type: 'hot' | 'noCommission') => {
    if (type === 'hot') {
      setHotProperties(prev => prev.filter(p => p.id !== id));
    } else {
      setNoCommissionProperties(prev => prev.filter(p => p.id !== id));
    }
    setDirty(true);
  };

  // Toast-free: success/error feedback belongs to handleSaveEverything (one toast total).
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const resetPromises = allProperties.map(prop =>
        fetch(`/api/admin/properties/${prop.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...prop,
            isHotProposition: false,
            isNoCommission: false,
          }),
        })
      );

      await Promise.all(resetPromises);

      const hotPromises = hotProperties.map(prop =>
        fetch(`/api/admin/properties/${prop.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...prop,
            isHotProposition: true,
          }),
        })
      );
      await Promise.all(hotPromises);

      const noCommissionPromises = noCommissionProperties.map(prop =>
        fetch(`/api/admin/properties/${prop.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...prop,
            isNoCommission: true,
          }),
        })
      );

      await Promise.all(noCommissionPromises);

      fetchProperties();
    } finally {
      setSaving(false);
    }
  };

  // Single dirty-tracked save: runs BOTH existing save flows (titles + selection)
  // and reports exactly ONE success or error toast for the whole operation.
  const handleSaveEverything = async () => {
    try {
      await Promise.all([handleSaveTitles(), handleSaveAll()]);
      toast.success(t.allChangesSaved);
      setDirty(false);
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      toast.error(t.changesSaveError);
    }
  };

  const availableProperties = allProperties.filter(p => {
    // Filter out sold properties
    if (p.isSold) return false;

    const notInOtherSection = modalType === 'hot'
      ? !noCommissionProperties.some(nc => nc.id === p.id) || selectedIds.includes(p.id)
      : !hotProperties.some(h => h.id === p.id) || selectedIds.includes(p.id);

    if (!notInOtherSection) return false;

    if (modalType === 'hot' && hotPropositionsMode === 'price') {
      const priceNum = parseInt(p.price.replace(/[^0-9]/g, ''));
      return priceNum <= hotPropositionsMaxPrice;
    }

    return true;
  });

  const formatPrice = (price: string) => {
    const n = parseInt(String(price ?? '').replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(n) && n > 0 ? `₪${n.toLocaleString('en-US')}` : `₪${price}`;
  };

  const isSaving = saving || titlesSaving;

  /* ---- Section-titles field row (label inline-start / control inline-end) ---- */
  const renderTitleField = (
    fieldKey: keyof typeof sectionTitles,
    label: string,
    placeholder: string,
    multiline = false,
  ) => (
    <div className="field-row" key={fieldKey}>
      <div>
        <div className="fr-label">{label}</div>
      </div>
      <div className="fr-control">
        {multiline ? (
          <Textarea
            value={sectionTitles[fieldKey]}
            onChange={(e) => setTitle(fieldKey, e.target.value)}
            placeholder={placeholder}
            rows={2}
          />
        ) : (
          <Input
            value={sectionTitles[fieldKey]}
            onChange={(e) => setTitle(fieldKey, e.target.value)}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );

  /* ---- One chosen property as a .pick-row (thumb + title + quiet trash) ---- */
  const renderPickRow = (p: Property, type: 'hot' | 'noCommission') => (
    <div className="pick-row" key={p.id}>
      <PropertyThumb className="thumb" src={p.images[0]} alt={p.title} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            font: '500 14px/1.35 var(--font-assistant), system-ui',
            color: 'var(--text-ink)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</span>
          {p.isSold && (
            <Badge variant="muted" style={{ flexShrink: 0 }}>
              {p.dealType === 'rent' ? t.rented : t.sold}
            </Badge>
          )}
        </div>
        <div
          style={{
            marginBlockStart: 3,
            font: '400 12px/1.3 var(--font-assistant), system-ui',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 0,
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.location}
          </span>
          <span style={{ color: 'var(--text-faint)' }}>·</span>
          <bdi dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
            {formatPrice(p.price)}
          </bdi>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={() => handleRemove(p.id, type)}
        aria-label={t.remove}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );

  /* ---- One "Manage properties" section-card ---- */
  const renderManageCard = (opts: {
    title: string;
    count: React.ReactNode;
    items: Property[];
    type: 'hot' | 'noCommission';
    emptyText: string;
    addDisabled?: boolean;
    showMode?: boolean;
  }) => (
    <section className="section-card">
      <div className="section-card__head">
        <div className="section-card__title">{opts.title}</div>
        <Badge variant="muted" className="tabular-nums">
          <bdi dir="ltr">{opts.count}</bdi>
        </Badge>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {opts.showMode && (
          <div className="inset-well" style={{ marginBlockEnd: 14 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
              <label className="inline-flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text-body)' }}>
                <input
                  type="radio"
                  name="hotPropositionsMode"
                  className="size-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  checked={hotPropositionsMode === 'manual'}
                  onChange={() => setHotPropositionsMode('manual')}
                />
                <span>{t.manualSelection}</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text-body)' }}>
                <input
                  type="radio"
                  name="hotPropositionsMode"
                  className="size-4 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  checked={hotPropositionsMode === 'price'}
                  onChange={() => setHotPropositionsMode('price')}
                />
                <span>{t.priceFilter}</span>
              </label>
            </div>

            {hotPropositionsMode === 'price' && (
              <div style={{ marginBlockStart: 10, paddingBlockStart: 10, borderBlockStart: '1px solid var(--border)' }}>
                <Input
                  type="number"
                  value={hotPropositionsMaxPrice}
                  onChange={(e) => setHotPropositionsMaxPrice(Number(e.target.value) || 0)}
                  min={0}
                  step={100000}
                  placeholder={t.maxPricePlaceholder}
                  style={{ maxInlineSize: 260 }}
                />
              </div>
            )}
          </div>
        )}

        {opts.items.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            {opts.emptyText}
          </div>
        ) : (
          <div>{opts.items.map((p) => renderPickRow(p, opts.type))}</div>
        )}

        <div style={{ marginBlockStart: 12 }}>
          <Button
            variant="ghost"
            onClick={() => openModal(opts.type)}
            disabled={opts.addDisabled}
            style={{ color: 'var(--brand)' }}
          >
            <Plus className="size-4" />
            {t.addProperty}
          </Button>
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Sticky single-save settings bar */}
      <div className="settings-bar">
        <h1 style={{ margin: 0, font: '600 24px/1.25 var(--font-assistant), system-ui', color: 'var(--text-ink)' }}>
          {t.settingsTitle}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className={`settings-bar__status${dirty ? ' dirty' : ''}`}>
            {dirty ? t.unsaved : t.allSaved}
          </span>
          <Button
            onClick={handleSaveEverything}
            disabled={!dirty || isSaving}
            variant={dirty ? 'default' : 'ghost'}
            style={{ minWidth: 150 }}
          >
            {isSaving && <Loader2 className="size-4 animate-spin" />}
            {t.saveChanges}
          </Button>
        </div>
      </div>

      {/* A. Section titles & content */}
      <section className="section-card">
        <div className="section-card__head">
          <div>
            <div className="section-card__title">{t.contentCard}</div>
            <div className="section-card__helper">{t.contentHelper}</div>
          </div>
        </div>

        {titlesLoading ? (
          <div className="flex flex-col gap-3 px-5 py-4">
            {/* 8 rows — one per real title field, so the card doesn't jump on load */}
            {Array.from({ length: 8 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <div>
            {renderTitleField('hotPropositionsTitle', t.labelHotTitle, t.phHotTitle)}
            {renderTitleField('featuredPropertiesTitle', t.labelFeaturedTitle, t.phFeaturedTitle)}
            {renderTitleField('featuredPropertiesSubtitle', t.labelFeaturedSubtitle, t.phFeaturedSubtitle, true)}
            {renderTitleField('valuesSectionTitle', t.labelValuesTitle, t.phValuesTitle)}
            {renderTitleField('aboutSectionTitle', t.labelAboutTitle, t.phAboutTitle)}
            {renderTitleField('processSectionTitle', t.labelProcessTitle, t.phProcessTitle)}
            {renderTitleField('testimonialsTitle', t.labelTestimonialsTitle, t.phTestimonialsTitle)}
            {renderTitleField('noCommissionTitle', t.labelNoCommissionTitle, t.phNoCommissionTitle)}
          </div>
        )}
      </section>

      {/* B. Manage displayed properties */}
      {renderManageCard({
        title: t.hotDeals,
        count: hotProperties.length,
        items: hotProperties,
        type: 'hot',
        emptyText: t.noPropertiesShown,
        showMode: true,
      })}

      {renderManageCard({
        title: t.noCommissionSection,
        count: `${noCommissionProperties.length}/1`,
        items: noCommissionProperties,
        type: 'noCommission',
        emptyText: t.noPropertyChosen,
        addDisabled: noCommissionProperties.length >= 1,
      })}

      {/* C. Property-picker */}
      <Dialog open={isModalVisible} onOpenChange={(o) => { if (!o) setIsModalVisible(false); }}>
        <DialogContent className="w-[96vw] max-w-[900px]">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'hot' ? t.modalTitleHot : t.modalTitleNoCommission}
            </DialogTitle>
            {modalType === 'noCommission' && (
              <DialogDescription>{t.modalNoteOnlyOne}</DialogDescription>
            )}
          </DialogHeader>

          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-tile)', overflow: 'hidden' }}>
              <Table>
                <TableHeader>
                  <TableRow style={{ background: 'var(--surface-sunken)' }}>
                    <TableHead className="h-11 normal-case tracking-normal" style={{ inlineSize: 48 }}>
                      {modalType === 'hot' && (
                        <Checkbox
                          checked={
                            selectedIds.length === availableProperties.length && availableProperties.length > 0
                              ? true
                              : selectedIds.length > 0
                                ? 'indeterminate'
                                : false
                          }
                          onCheckedChange={handleSelectAll}
                          aria-label={t.selectAll(selectedIds.length, availableProperties.length)}
                        />
                      )}
                    </TableHead>
                    <TableHead className="h-11 normal-case tracking-normal">{t.colTitle}</TableHead>
                    <TableHead className="h-11 normal-case tracking-normal text-end">{t.colPrice}</TableHead>
                    <TableHead className="h-11 normal-case tracking-normal text-end">{t.colRooms}</TableHead>
                    <TableHead className="h-11 normal-case tracking-normal text-end">{t.colArea}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableProperties.map((p) => {
                    const checked = modalType === 'hot'
                      ? selectedIds.includes(p.id)
                      : selectedIds[0] === p.id;
                    const toggle = () => (modalType === 'hot' ? togglePick(p.id) : handleRadioChange(p.id));
                    return (
                      <TableRow
                        key={p.id}
                        onClick={toggle}
                        data-state={checked ? 'selected' : undefined}
                        style={{ height: 64, cursor: 'pointer', background: checked ? 'var(--brand-wash)' : undefined }}
                      >
                        <TableCell>
                          {modalType === 'hot' ? (
                            <Checkbox checked={checked} tabIndex={-1} style={{ pointerEvents: 'none' }} />
                          ) : (
                            <input
                              type="radio"
                              checked={checked}
                              readOnly
                              tabIndex={-1}
                              className="pointer-events-none size-4 accent-primary"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                            <PropertyThumb
                              className="h-10.5 w-14 shrink-0 rounded-lg bg-muted object-cover"
                              src={p.images[0]}
                              alt={p.title}
                            />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ font: '600 15px/1.3 var(--font-assistant), system-ui', color: 'var(--text-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.title}
                              </div>
                              <div style={{ marginBlockStart: 2, font: '400 13px/1.3 var(--font-assistant), system-ui', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {p.location}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-end">
                          <bdi dir="ltr" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPrice(p.price)}</bdi>
                        </TableCell>
                        <TableCell className="text-end">
                          <bdi dir="ltr" style={{ fontVariantNumeric: 'tabular-nums' }}>{p.rooms}</bdi>
                        </TableCell>
                        <TableCell className="text-end">
                          <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{t.areaSqm(p.area)}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter className="mt-2 gap-2">
            <Button variant="outline" onClick={() => setIsModalVisible(false)}>{t.cancel}</Button>
            <Button onClick={handleModalOk}>{t.addSelected(selectedIds.length)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
