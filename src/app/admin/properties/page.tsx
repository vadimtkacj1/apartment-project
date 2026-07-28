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
  Tag,
  Image,
  Skeleton,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import type { DealType, PropertyType, ParkingType, Position, FurnitureLevel, Direction } from '@/types/property.types';
import type { ColumnsType } from 'antd/es/table';
import { getCityLabel } from '@/data/cities';
import {
  DEFAULT_LISTING_ORDER,
  LISTING_ORDERS,
  LISTING_ORDER_LABELS,
  ListingOrder,
} from '@/lib/listing-order';

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

// Explanatory copy under each choice in the site-order control
const LISTING_ORDER_HINTS: Record<ListingOrder, string> = {
  newest: 'הנכסים שנוספו לאחרונה יופיעו ראשונים',
  'price-asc': 'הנכסים הזולים יופיעו ראשונים',
  'price-desc': 'הנכסים היקרים יופיעו ראשונים',
  random: 'הסדר מתחלף מדי שעה — כל הנכסים מקבלים חשיפה שווה',
};

export default function PropertiesPage() {
  const { message } = App.useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDealType, setFilterDealType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Order visitors see the properties in on the public /apartments page
  const [listingOrder, setListingOrder] = useState<ListingOrder>(DEFAULT_LISTING_ORDER);
  const [listingOrderLoading, setListingOrderLoading] = useState(true);
  const [listingOrderSaving, setListingOrderSaving] = useState(false);

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
    fetchListingOrder();
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
      message.error('שגיאה בטעינת הנכסים');
    } finally {
      setLoading(false);
    }
  };

  const fetchListingOrder = async () => {
    try {
      const response = await fetch('/api/admin/listing-settings', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data?.propertyListingOrder) setListingOrder(data.propertyListingOrder);
    } catch (error) {
      // Non-blocking: the rest of the page still works, the control just shows the default
      console.error('Error fetching listing order:', error);
    } finally {
      setListingOrderLoading(false);
    }
  };

  const handleListingOrderChange = async (value: ListingOrder) => {
    const previous = listingOrder;
    setListingOrder(value); // optimistic — reverted below if the save fails
    setListingOrderSaving(true);
    try {
      const response = await fetch('/api/admin/listing-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyListingOrder: value }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      message.success('סדר ההצגה באתר עודכן');
    } catch (error) {
      console.error('Error updating listing order:', error);
      message.error('שגיאה בעדכון סדר ההצגה. נסה שוב.');
      setListingOrder(previous);
    } finally {
      setListingOrderSaving(false);
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
      message.success('הנכס נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting property:', error);
      message.error('שגיאה במחיקת הנכס. נסה שוב.');
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
      const soldText = property?.dealType === 'rent' ? 'מושכר' : 'נמכר';

      const msgs: Record<string, string> = {
        isSold: value ? `הנכס סומן כ${soldText}` : `הנכס בוטל מסומן כ${soldText}`,
        isPinned: value ? 'הנכס נצמד לעמוד הבית' : 'הנכס בוטל מהצמדה',
        isActive: value ? 'הנכס הופעל' : 'הנכס הושבת',
      };
      message.success(msgs[field]);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      message.error('שגיאה בעדכון הסטטוס. נסה שוב.');
      // Revert optimistic update on error
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId ? { ...property, [field]: !value } : property
        )
      );
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-0">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="text-4xl font-bold" style={{ margin: 0 }}>ניהול נכסים</h1>
        <Link href="/admin/properties/new" className="w-full sm:w-auto">
          <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full sm:w-auto">
            הוסף נכס חדש
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {[
          { title: 'סה״כ נכסים', value: stats.total, prefix: <HomeOutlined /> },
          { title: 'נכסים למכירה', value: stats.forSale, color: BRAND.success },
          { title: 'נכסים להשכרה', value: stats.forRent, color: BRAND.navy },
          { title: 'נכסים פעילים', value: stats.active, color: BRAND.goldText },
          { title: 'נכסים שנמכרו', value: stats.sold, color: BRAND.danger },
        ].map((s) => (
          <Col key={s.title} flex="1 1 180px">
            <Card>
              <Statistic
                title={s.title}
                value={s.value}
                prefix={s.prefix}
                styles={s.color ? { content: { color: s.color } } : undefined}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Public listing order — controls the order visitors see on /apartments */}
      <Card className="mb-6" title="סדר הצגת הנכסים באתר">
        <Space vertical size="small" style={{ width: '100%' }}>
          <span style={{ color: BRAND.textMuted }}>
            קובע באיזה סדר הנכסים מוצגים למבקרים בעמוד הנכסים. הבחירה נשמרת מיד.
          </span>
          <Space wrap className="admin-filter-full" style={{ width: '100%' }} align="center">
            <Select<ListingOrder>
              value={listingOrder}
              onChange={handleListingOrderChange}
              loading={listingOrderLoading || listingOrderSaving}
              disabled={listingOrderLoading || listingOrderSaving}
              style={{ minWidth: 220 }}
              size="large"
              options={LISTING_ORDERS.map((order) => ({
                value: order,
                label: LISTING_ORDER_LABELS[order],
              }))}
            />
            <span style={{ color: BRAND.textMuted }}>{LISTING_ORDER_HINTS[listingOrder]}</span>
          </Space>
        </Space>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <Space vertical style={{ width: '100%' }} size="middle">
          <Input
            placeholder="חפש לפי כותרת, מיקום או עיר..."
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
              <Select.Option value="all">כל סוגי העסקאות</Select.Option>
              <Select.Option value="sale">מכירה</Select.Option>
              <Select.Option value="rent">השכרה</Select.Option>
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
              <Select.Option value="all">כל הסטטוסים</Select.Option>
              <Select.Option value="active">פעיל</Select.Option>
              <Select.Option value="inactive">לא פעיל</Select.Option>
              <Select.Option value="sold">נמכר</Select.Option>
              <Select.Option value="available">זמין</Select.Option>
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
            showTotal: (total) => `סה״כ ${total} נכסים`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: <AdminEmptyState message="לא נמצאו נכסים" addHref="/admin/properties/new" addLabel="הוספת נכס" /> }}
          rowClassName={(record) => record.isSold ? 'sold-property-row' : ''}
          columns={[
            {
              title: 'תמונה',
              dataIndex: 'images',
              key: 'image',
              width: 72,
              render: (images: string[]) => (
                <Image
                  src={images[0] || '/images/hero/sales.jpg'}
                  alt="Property"
                  width={56}
                  height={56}
                  preview={false}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '8px',
                    display: 'block',
                    width: '56px',
                    height: '56px'
                  }}
                  fallback="/images/hero/sales.jpg"
                />
              ),
            },
            {
              title: 'כותרת',
              dataIndex: 'title',
              key: 'title',
              width: 250,
              ellipsis: {
                showTitle: true,
              },
            },
            {
              title: 'מיקום',
              dataIndex: 'location',
              key: 'location',
              width: 150,
              ellipsis: true,
            },
            {
              title: 'עיר',
              dataIndex: 'city',
              key: 'city',
              width: 100,
              render: (city: string) => getCityLabel(city) || city,
            },
            {
              title: 'סוג עסקה',
              dataIndex: 'dealType',
              key: 'dealType',
              width: 100,
              render: (dealType: string) => (
                <Tag color={dealType === 'sale' ? 'green' : '#1C3664'}>
                  {dealType === 'sale' ? 'מכירה' : 'השכרה'}
                </Tag>
              ),
            },
            {
              title: 'מחיר',
              dataIndex: 'price',
              key: 'price',
              width: 120,
              render: (price: string) => (
                <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', display: 'inline-block' }}>
                  {formatPropertyPrice(price)}
                </span>
              ),
            },
            {
              title: 'חדרים',
              dataIndex: 'rooms',
              key: 'rooms',
              width: 80,
              align: 'center',
            },
            {
              title: 'שטח',
              dataIndex: 'area',
              key: 'area',
              width: 80,
              align: 'center',
              render: (area: number) => `${area} מ"ר`,
            },
            {
              title: 'קומה',
              key: 'floor',
              width: 80,
              align: 'center',
              render: (_, record: Property) =>
                record.floor && record.totalFloors
                  ? `${record.floor}/${record.totalFloors}`
                  : record.floor || '-',
            },
            {
              title: 'סטטוס',
              key: 'status',
              width: 120,
              render: (_, record: Property) => (
                <Space vertical size={4}>
                  <Switch
                    size="small"
                    checked={record.isActive}
                    onChange={(v) => handleStatusChange(record.id, 'isActive', v)}
                    checkedChildren="פעיל"
                    unCheckedChildren="כבוי"
                  />
                  <Switch
                    size="small"
                    checked={record.isSold}
                    onChange={(v) => handleStatusChange(record.id, 'isSold', v)}
                    checkedChildren={record.dealType === 'rent' ? 'מושכר' : 'נמכר'}
                    unCheckedChildren="פנוי"
                  />
                </Space>
              ),
            },
            {
              title: 'פעולות',
              key: 'actions',
              width: 150,
              render: (_, record: Property) => (
                <Space size={4}>
                  <Link href={`/admin/properties/${record.id}`}>
                    <Button type="primary" icon={<EditOutlined />} size="small">
                      ערוך
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
                    מחק
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
          <AdminEmptyState message="לא נמצאו נכסים" addHref="/admin/properties/new" addLabel="הוספת נכס" />
        ) : (
          <div className="admin-card-list">
            {filteredProperties.map((property) => {
              const cityLabel = getCityLabel(property.city) || property.city;
              const metaParts = [
                cityLabel || property.location,
                `${property.rooms} חד׳`,
                `${property.area} מ"ר`,
              ];
              if (property.floor) {
                metaParts.push(
                  property.totalFloors
                    ? `קומה ${property.floor}/${property.totalFloors}`
                    : `קומה ${property.floor}`
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
                      <Tag color={property.dealType === 'sale' ? 'green' : '#1C3664'} style={{ marginInlineEnd: 0 }}>
                        {property.dealType === 'sale' ? 'מכירה' : 'השכרה'}
                      </Tag>
                      <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', fontWeight: 600, color: '#1C3664' }}>
                        {formatPropertyPrice(property.price)}
                      </span>
                    </div>
                  </div>
                  <div className="admin-card__fields">
                    <span><b>חדרים</b> {property.rooms}</span>
                    <span><b>שטח</b> {property.area} מ&quot;ר</span>
                    <span>
                      <b>קומה</b>{' '}
                      {property.floor && property.totalFloors
                        ? `${property.floor}/${property.totalFloors}`
                        : property.floor || '-'}
                    </span>
                  </div>
                  <div className="admin-card__actions">
                    <Switch
                      checked={property.isActive}
                      onChange={(v) => handleStatusChange(property.id, 'isActive', v)}
                      checkedChildren="פעיל"
                      unCheckedChildren="כבוי"
                    />
                    <Switch
                      checked={property.isSold}
                      onChange={(v) => handleStatusChange(property.id, 'isSold', v)}
                      checkedChildren={property.dealType === 'rent' ? 'מושכר' : 'נמכר'}
                      unCheckedChildren="פנוי"
                    />
                    <span className="admin-card__grow" style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/admin/properties/${property.id}`} style={{ flex: 1 }}>
                        <Button type="primary" icon={<EditOutlined />} block>
                          ערוך
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
                        מחק
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
        title="אישור מחיקה"
        open={deleteModal}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModal(false);
          setSelectedProperty(null);
        }}
        okText="מחק"
        cancelText="ביטול"
        okButtonProps={{ danger: true }}
      >
        <p>האם אתה בטוח שברצונך למחוק נכס זה?</p>
      </Modal>
    </div>
  );
}
