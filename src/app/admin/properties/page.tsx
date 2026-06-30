'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
      message.error('שגיאה בטעינת הנכסים');
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
          { title: 'נכסים למכירה', value: stats.forSale, color: '#3f8600' },
          { title: 'נכסים להשכרה', value: stats.forRent, color: '#1C3664' },
          { title: 'נכסים פעילים', value: stats.active, color: '#8A6D2F' },
          { title: 'נכסים שנמכרו', value: stats.sold, color: '#cf1322' },
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
          <Space wrap style={{ width: '100%' }}>
            <Select
              value={filterDealType}
              onChange={(v) => {
                setFilterDealType(v);
                setCurrentPage(1);
              }}
              style={{ minWidth: 150, width: '100%', maxWidth: '200px' }}
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
              style={{ minWidth: 120, width: '100%', maxWidth: '150px' }}
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

      {/* Property Table */}
      <Card>
        <Table
          dataSource={filteredProperties}
          loading={loading}
          rowKey="id"
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
              width: 100,
              render: (images: string[]) => (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '4px',
                  width: '80px',
                  height: '80px'
                }}>
                  <Image
                    src={images[0] || '/images/hero/sales.jpg'}
                    alt="Property"
                    width={80}
                    height={80}
                    preview={false}
                    style={{
                      objectFit: 'cover',
                      borderRadius: '8px',
                      display: 'block',
                      width: '80px',
                      height: '80px'
                    }}
                    fallback="/images/hero/sales.jpg"
                  />
                </div>
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
              render: (text: string) => (
                <div style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '230px'
                }}>
                  {text}
                </div>
              ),
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
              render: (price: string) => {
                const n = parseInt(String(price ?? '').replace(/[^0-9]/g, ''), 10);
                return (
                  <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', display: 'inline-block' }}>
                    {Number.isFinite(n) && n > 0 ? `₪${n.toLocaleString('en-US')}` : `₪${price}`}
                  </span>
                );
              },
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
