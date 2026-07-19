'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BRAND } from '@/lib/adminTheme';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Select,
  Modal,
  App,
  Statistic,
  Space,
  Switch,
  Spin,
  Table,
  Image,
  Skeleton,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  SearchOutlined,
  TagOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import MetricCard from '@/components/admin/MetricCard';
import Link from 'next/link';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertiesMessages } from '@/lib/adminI18n/messages/properties';
import type { DealType, PropertyType, ParkingType, Position, FurnitureLevel, Direction } from '@/types/property.types';
import type { ColumnsType } from 'antd/es/table';
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

// Shared ₪ formatting used by both the desktop table and the mobile card list
function formatPropertyPrice(price: string): string {
  const n = parseInt(String(price ?? '').replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? `₪${n.toLocaleString('en-US')}` : `₪${price}`;
}

export default function PropertiesPage() {
  const { message } = App.useApp();
  const t = useAdminMessages(propertiesMessages);
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
      message.error(t.loadError);
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

  const handleDelete = async () => {
    if (!selectedProperty) return;
    try {
      const response = await fetch(`/api/admin/properties/${selectedProperty}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setDeleteModal(false);
      setSelectedProperty(null);
      fetchProperties();
      message.success(t.deleteSuccess);
    } catch (error) {
      console.error('Error deleting property:', error);
      message.error(t.deleteError);
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
      message.success(msgs[field]);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      message.error(t.statusUpdateError);
      // Revert optimistic update on error
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId ? { ...property, [field]: !value } : property
        )
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <AdminPageHeader
        title={t.pageTitle}
        extra={
          <Link href="/admin/properties/new" className="w-full sm:w-auto">
            <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full sm:w-auto">
              {t.addNewProperty}
            </Button>
          </Link>
        }
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {[
          { label: t.statTotal, value: stats.total, icon: <HomeOutlined />, accent: '#354AC4' },
          { label: t.statForSale, value: stats.forSale, icon: <TagOutlined />, accent: '#354AC4' },
          { label: t.statForRent, value: stats.forRent, icon: <KeyOutlined />, accent: '#5594F1' },
          { label: t.statActive, value: stats.active, icon: <CheckCircleOutlined />, accent: '#2A69C4' },
          { label: t.statSold, value: stats.sold, icon: <StopOutlined />, accent: '#64748B' },
        ].map((s) => (
          <Col key={String(s.label)} flex="1 1 180px">
            <MetricCard icon={s.icon} label={s.label} value={s.value} accent={s.accent} />
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <Space vertical style={{ width: '100%' }} size="middle">
          <Input
            placeholder={t.searchPlaceholder}
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            size="large"
          />
          <Space wrap className="admin-filter-full" style={{ width: '100%' }}>
            <Select
              value={filterDealType}
              onChange={(v) => {
                setFilterDealType(v);
                setCurrentPage(1);
              }}
              style={{ minWidth: 150 }}
              size="large"
            >
              <Select.Option value="all">{t.filterAllDealTypes}</Select.Option>
              <Select.Option value="sale">{t.dealSale}</Select.Option>
              <Select.Option value="rent">{t.dealRent}</Select.Option>
            </Select>
            <Select
              value={filterStatus}
              onChange={(v) => {
                setFilterStatus(v);
                setCurrentPage(1);
              }}
              style={{ minWidth: 120 }}
              size="large"
            >
              <Select.Option value="all">{t.filterAllStatuses}</Select.Option>
              <Select.Option value="active">{t.statusActive}</Select.Option>
              <Select.Option value="inactive">{t.statusInactive}</Select.Option>
              <Select.Option value="sold">{t.statusSold}</Select.Option>
              <Select.Option value="available">{t.statusAvailable}</Select.Option>
            </Select>
          </Space>
        </Space>
      </Card>

      {/* Property Table — desktop (≥768px) */}
      <div className="admin-only-desktop">
      <Card>
        <Table
          dataSource={filteredProperties}
          loading={loading}
          rowKey="id"
          size="middle"
          pagination={{
            current: currentPage,
            pageSize,
            showSizeChanger: true,
            showTotal: (total) => t.tableTotal(total),
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: <AdminEmptyState message={t.emptyMessage} addHref="/admin/properties/new" addLabel={t.emptyAddLabel} /> }}
          rowClassName={(record) => record.isSold ? 'sold-property-row' : ''}
          columns={[
            {
              title: t.colTitle,
              key: 'property',
              width: 300,
              render: (_, record: Property) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <Image
                    src={record.images[0] || '/images/hero/sales.jpg'}
                    alt={record.title}
                    width={40}
                    height={40}
                    preview={false}
                    style={{
                      objectFit: 'cover',
                      borderRadius: 8,
                      display: 'block',
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                    }}
                    fallback="/images/hero/sales.jpg"
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
              ),
            },
            {
              title: t.colDealType,
              dataIndex: 'dealType',
              key: 'dealType',
              width: 100,
              render: (dealType: string) => (
                <span className={`admin-pill admin-pill--${dealType === 'sale' ? 'sale' : 'rent'}`}>
                  {dealType === 'sale' ? t.dealSale : t.dealRent}
                </span>
              ),
            },
            {
              title: t.colPrice,
              dataIndex: 'price',
              key: 'price',
              width: 120,
              render: (price: string) => (
                <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', display: 'inline-block', color: '#051150', fontWeight: 600 }}>
                  {formatPropertyPrice(price)}
                </span>
              ),
            },
            {
              title: t.colFloor,
              key: 'floor',
              width: 80,
              align: 'center',
              render: (_, record: Property) =>
                record.floor && record.totalFloors
                  ? `${record.floor}/${record.totalFloors}`
                  : record.floor || '-',
            },
            {
              title: t.colStatus,
              key: 'status',
              width: 120,
              render: (_, record: Property) => (
                <Space vertical size={4}>
                  <Switch
                    size="small"
                    checked={record.isActive}
                    onChange={(v) => handleStatusChange(record.id, 'isActive', v)}
                    checkedChildren={t.statusActive}
                    unCheckedChildren={t.switchOff}
                  />
                  <Switch
                    size="small"
                    checked={record.isSold}
                    onChange={(v) => handleStatusChange(record.id, 'isSold', v)}
                    checkedChildren={record.dealType === 'rent' ? t.statusRented : t.statusSold}
                    unCheckedChildren={t.switchVacant}
                  />
                </Space>
              ),
            },
            {
              title: t.colActions,
              key: 'actions',
              width: 150,
              render: (_, record: Property) => (
                <Space size={4}>
                  <Link href={`/admin/properties/${record.id}`}>
                    <Button type="primary" icon={<EditOutlined />} size="small">
                      {t.edit}
                    </Button>
                  </Link>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => {
                      setSelectedProperty(record.id);
                      setDeleteModal(true);
                    }}
                  >
                    {t.delete}
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>
      </div>

      {/* Property list — mobile (<768px) card view */}
      <div className="admin-only-mobile">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
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
                    <Switch
                      checked={property.isActive}
                      onChange={(v) => handleStatusChange(property.id, 'isActive', v)}
                      checkedChildren={t.statusActive}
                      unCheckedChildren={t.switchOff}
                    />
                    <Switch
                      checked={property.isSold}
                      onChange={(v) => handleStatusChange(property.id, 'isSold', v)}
                      checkedChildren={property.dealType === 'rent' ? t.statusRented : t.statusSold}
                      unCheckedChildren={t.switchVacant}
                    />
                    <span className="admin-card__grow" style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/admin/properties/${property.id}`} style={{ flex: 1 }}>
                        <Button type="primary" icon={<EditOutlined />} block>
                          {t.edit}
                        </Button>
                      </Link>
                      <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        style={{ marginInlineStart: 'auto' }}
                        onClick={() => {
                          setSelectedProperty(property.id);
                          setDeleteModal(true);
                        }}
                      >
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

      {/* Delete Confirmation Modal */}
      <Modal
        title={t.deleteModalTitle}
        open={deleteModal}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModal(false);
          setSelectedProperty(null);
        }}
        okText={t.delete}
        cancelText={t.cancel}
        okButtonProps={{ danger: true }}
      >
        <p>{t.deleteModalContent}</p>
      </Modal>
    </div>
  );
}
