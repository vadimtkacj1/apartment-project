'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Loader2 } from 'lucide-react';
import type { DealType } from '@/types/property.types';
import { toast } from '@/components/shadcn/sonner';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import { Badge } from '@/components/shadcn/badge';
import { Checkbox } from '@/components/shadcn/checkbox';
import { Skeleton } from '@/components/shadcn/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/shadcn/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/shadcn/dialog';
import { useAdminMessages } from '@/lib/adminI18n';
import { homepageMessages } from '@/lib/adminI18n/messages/homepage';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import MetricCard from '@/components/admin/MetricCard';

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

export default function HomepagePage() {
  const t = useAdminMessages(homepageMessages);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const setTitle = (key: keyof typeof sectionTitles, value: string) =>
    setSectionTitles((prev) => ({ ...prev, [key]: value }));

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

  const handleSaveTitles = async () => {
    try {
      setTitlesSaving(true);
      const values = sectionTitles;
      const response = await fetch('/api/admin/homepage-titles', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
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
      toast.success(t.titlesSaved);
    } catch (error) {
      console.error('Error saving titles:', error);
      const errorMessage = error instanceof Error ? error.message : t.unknownError;
      toast.error(t.titlesSaveError(errorMessage));
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

    setIsModalVisible(false);
  };

  const handleRemove = (id: number, type: 'hot' | 'noCommission') => {
    if (type === 'hot') {
      setHotProperties(prev => prev.filter(p => p.id !== id));
    } else {
      setNoCommissionProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);

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

      toast.success(t.allChangesSaved);
      fetchProperties();
    } catch (error) {
      console.error('Error saving:', error);
      toast.error(t.changesSaveError);
    } finally {
      setSaving(false);
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

  // Desktop table mirroring the previous antd columns (same filtered data, same handlers)
  const renderTable = (rows: Property[], type: 'hot' | 'noCommission') => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t.colImage}</TableHead>
            <TableHead className="w-[250px]">{t.colTitle}</TableHead>
            <TableHead className="w-[150px]">{t.colLocation}</TableHead>
            <TableHead className="w-[120px]">{t.colPrice}</TableHead>
            <TableHead className="w-[80px] text-center">{t.colRooms}</TableHead>
            <TableHead className="w-[80px] text-center">{t.colArea}</TableHead>
            <TableHead className="w-[150px]">{t.colActions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '4px',
                  width: '80px',
                  height: '80px',
                }}>
                  <img
                    src={record.images[0] || '/images/hero/sales.jpg'}
                    alt={t.propertyAlt}
                    width={80}
                    height={80}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/hero/sales.jpg'; }}
                    style={{
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                      width: '80px',
                      height: '80px',
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '230px',
                }}>
                  {record.title}
                  {record.isSold && (
                    <Badge variant="destructive" className="ms-2">
                      {record.dealType === 'rent' ? t.rented : t.sold}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', maxWidth: '150px' }}>
                  {record.location}
                </span>
              </TableCell>
              <TableCell>
                <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', display: 'inline-block' }}>
                  {formatPrice(record.price)}
                </span>
              </TableCell>
              <TableCell className="text-center">{record.rooms}</TableCell>
              <TableCell className="text-center">{t.areaSqm(record.area)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemove(record.id, type)}
                >
                  <Trash2 className="size-4" />
                  {t.remove}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Mobile card list mirroring the desktop table (same filtered data, same handlers)
  const renderMobileCards = (rows: Property[], type: 'hot' | 'noCommission') => (
    <div className="admin-card-list">
      {rows.map((property) => (
        <div key={property.id} className="admin-card">
          <div className="admin-card__head">
            <img
              className="admin-card__thumb"
              src={property.images[0] || '/images/hero/sales.jpg'}
              alt={property.title}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/hero/sales.jpg'; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="admin-card__title">
                {property.title}
                {property.isSold && (
                  <Badge variant="destructive" className="ms-2">
                    {property.dealType === 'rent' ? t.rented : t.sold}
                  </Badge>
                )}
              </div>
              <div className="admin-card__meta">{property.location}</div>
            </div>
            <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {formatPrice(property.price)}
            </span>
          </div>
          <div className="admin-card__fields">
            <span><b>{t.colRooms}</b> {property.rooms}</span>
            <span><b>{t.colArea}</b> {t.areaSqm(property.area)}</span>
          </div>
          <div className="admin-card__actions">
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleRemove(property.id, type)}
            >
              <Trash2 className="size-4" />
              {t.remove}
            </Button>
          </div>
        </div>
      ))}
    </div>
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
        {/* Header */}
        <AdminPageHeader title={t.pageTitle} subtitle={t.pageSubtitle} />

        {/* Section Titles Editor */}
        <Card className="p-5" style={{ marginBottom: '24px' }}>
          <div className="mb-4" style={{ fontSize: '18px', fontWeight: 600, color: '#051150' }}>
            {t.sectionTitlesCard}
          </div>

          {titlesLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <Tabs defaultValue="main">
                <TabsList>
                  <TabsTrigger value="main">{t.tabMain}</TabsTrigger>
                  <TabsTrigger value="secondary">{t.tabSecondary}</TabsTrigger>
                </TabsList>

                <TabsContent value="main">
                  <div className="flex w-full flex-col gap-5 pt-2">
                    <div>
                      <Label className="mb-1.5 block">{t.labelHotTitle}</Label>
                      <Input
                        value={sectionTitles.hotPropositionsTitle}
                        onChange={(e) => setTitle('hotPropositionsTitle', e.target.value)}
                        placeholder={t.phHotTitle}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">{t.labelFeaturedTitle}</Label>
                      <Input
                        value={sectionTitles.featuredPropertiesTitle}
                        onChange={(e) => setTitle('featuredPropertiesTitle', e.target.value)}
                        placeholder={t.phFeaturedTitle}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">{t.labelFeaturedSubtitle}</Label>
                      <Input
                        value={sectionTitles.featuredPropertiesSubtitle}
                        onChange={(e) => setTitle('featuredPropertiesSubtitle', e.target.value)}
                        placeholder={t.phFeaturedSubtitle}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">{t.labelValuesTitle}</Label>
                      <Input
                        value={sectionTitles.valuesSectionTitle}
                        onChange={(e) => setTitle('valuesSectionTitle', e.target.value)}
                        placeholder={t.phValuesTitle}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="secondary">
                  <div className="flex w-full flex-col gap-5 pt-2">
                    <div>
                      <Label className="mb-1.5 block">{t.labelAboutTitle}</Label>
                      <Input
                        value={sectionTitles.aboutSectionTitle}
                        onChange={(e) => setTitle('aboutSectionTitle', e.target.value)}
                        placeholder={t.phAboutTitle}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">{t.labelProcessTitle}</Label>
                      <Input
                        value={sectionTitles.processSectionTitle}
                        onChange={(e) => setTitle('processSectionTitle', e.target.value)}
                        placeholder={t.phProcessTitle}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">{t.labelTestimonialsTitle}</Label>
                      <Input
                        value={sectionTitles.testimonialsTitle}
                        onChange={(e) => setTitle('testimonialsTitle', e.target.value)}
                        placeholder={t.phTestimonialsTitle}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">{t.labelNoCommissionTitle}</Label>
                      <Input
                        value={sectionTitles.noCommissionTitle}
                        onChange={(e) => setTitle('noCommissionTitle', e.target.value)}
                        placeholder={t.phNoCommissionTitle}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div style={{ marginTop: '24px', textAlign: 'start' }}>
                <Button
                  size="lg"
                  disabled={titlesSaving}
                  onClick={handleSaveTitles}
                  style={{ minWidth: '150px' }}
                >
                  {titlesSaving ? <Loader2 className="size-4 animate-spin" /> : <Pencil className="size-4" />}
                  {t.saveTitles}
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Properties Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3" style={{ marginTop: '24px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '4px', fontSize: '20px', fontWeight: 700, color: '#051150' }}>{t.managePropertiesTitle}</h3>
            <p className="text-muted-foreground" style={{ margin: 0 }}>{t.managePropertiesSubtitle}</p>
          </div>
          <Button
            disabled={saving}
            onClick={handleSaveAll}
            style={{ width: '100%', maxWidth: '180px' }}
          >
            {saving && <Loader2 className="size-4 animate-spin" />}
            {t.savePropertySelection}
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ marginBottom: '24px' }}>
          <MetricCard label={t.hotDeals} value={hotProperties.length} suffix={` ${t.statPropertiesSuffix}`} />
          <MetricCard label={t.statNoCommissionTitle} value={`${noCommissionProperties.length}/1`} suffix={` ${t.statPropertySuffix}`} />
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 gap-6">
          {/* Hot Propositions Section */}
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '18px', fontWeight: 600 }}>{t.hotDeals}</span>
              </div>
              <Button onClick={() => openModal('hot')}>
                <Plus className="size-4" />
                {t.addProperties}
              </Button>
            </div>

            {/* Price Filter Settings */}
            <div className="mb-4 p-3 rounded-lg" style={{ border: '1px solid #E4E8F2' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hotPropositionsMode"
                    checked={hotPropositionsMode === 'manual'}
                    onChange={() => setHotPropositionsMode('manual')}
                  />
                  <span>{t.manualSelection}</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hotPropositionsMode"
                    checked={hotPropositionsMode === 'price'}
                    onChange={() => setHotPropositionsMode('price')}
                  />
                  <span>{t.priceFilter}</span>
                </label>
              </div>

              {hotPropositionsMode === 'price' && (
                <div className="mt-2 pt-2 admin-filter-full" style={{ borderTop: '1px solid #E4E8F2' }}>
                  <Input
                    type="number"
                    value={hotPropositionsMaxPrice}
                    onChange={(e) => setHotPropositionsMaxPrice(Number(e.target.value) || 0)}
                    min={0}
                    step={100000}
                    placeholder={t.maxPricePlaceholder}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {hotProperties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" style={{ marginBottom: '12px' }}>{t.noPropertiesShown}</p>
                <Button size="sm" onClick={() => openModal('hot')}>
                  <Plus className="size-4" />
                  {t.addProperties}
                </Button>
              </div>
            ) : (
              <>
                {/* desktop — table */}
                <div className="admin-only-desktop">
                  {renderTable(hotProperties, 'hot')}
                </div>
                {/* mobile — card list */}
                <div className="admin-only-mobile">
                  {renderMobileCards(hotProperties, 'hot')}
                </div>
              </>
            )}
          </Card>

          {/* No Commission Section */}
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>{t.noCommissionSection}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#64748B' }}>
                  {t.onlyOneNote}
                </div>
              </div>
              <Button
                onClick={() => openModal('noCommission')}
                disabled={noCommissionProperties.length >= 1}
              >
                {noCommissionProperties.length >= 1 ? <Pencil className="size-4" /> : <Plus className="size-4" />}
                {noCommissionProperties.length >= 1 ? t.propertyChosen : t.chooseProperty}
              </Button>
            </div>

            {noCommissionProperties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground" style={{ marginBottom: '12px' }}>{t.noPropertyChosen}</p>
                <Button size="sm" onClick={() => openModal('noCommission')}>
                  <Plus className="size-4" />
                  {t.chooseProperty}
                </Button>
              </div>
            ) : (
              <>
                {/* desktop — table */}
                <div className="admin-only-desktop">
                  {renderTable(noCommissionProperties, 'noCommission')}
                </div>
                {/* mobile — card list */}
                <div className="admin-only-mobile">
                  {renderMobileCards(noCommissionProperties, 'noCommission')}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Property Selector Modal */}
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
              {modalType === 'hot' && (
                <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E4E8F2' }}>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={
                        selectedIds.length === availableProperties.length && availableProperties.length > 0
                          ? true
                          : selectedIds.length > 0
                            ? 'indeterminate'
                            : false
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <strong>{t.selectAll(selectedIds.length, availableProperties.length)}</strong>
                  </label>
                </div>
              )}

              <div className="flex w-full flex-col gap-2">
                {modalType === 'noCommission'
                  ? availableProperties.map((property) => (
                      <label
                        key={property.id}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border p-2"
                      >
                        <input
                          type="radio"
                          name="noCommissionPick"
                          checked={selectedIds[0] === property.id}
                          onChange={() => handleRadioChange(property.id)}
                        />
                        <img
                          src={property.images[0] || '/images/placeholder.jpg'}
                          alt={property.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{property.title}</div>
                          <div className="text-xs text-gray-500">{property.location}</div>
                          <div className="text-xs font-bold text-primary">{property.price}</div>
                        </div>
                      </label>
                    ))
                  : availableProperties.map((property) => (
                      <label
                        key={property.id}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border p-2"
                      >
                        <Checkbox
                          checked={selectedIds.includes(property.id)}
                          onCheckedChange={(v) =>
                            setSelectedIds((prev) =>
                              v
                                ? [...prev.filter((id) => id !== property.id), property.id]
                                : prev.filter((id) => id !== property.id),
                            )
                          }
                        />
                        <img
                          src={property.images[0] || '/images/placeholder.jpg'}
                          alt={property.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{property.title}</div>
                          <div className="text-xs text-gray-500">{property.location}</div>
                          <div className="text-xs font-bold text-primary">{property.price}</div>
                        </div>
                      </label>
                    ))}
              </div>
            </div>

            <DialogFooter className="mt-2 gap-2">
              <Button variant="outline" onClick={() => setIsModalVisible(false)}>{t.cancel}</Button>
              <Button onClick={handleModalOk}>{t.ok}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
