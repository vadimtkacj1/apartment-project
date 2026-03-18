'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Select,
  Modal,
  message,
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

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDealType, setFilterDealType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchProperties();
  }, []);

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
    return properties.filter((property) => {
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
  }, [properties, searchTerm, filterDealType, filterStatus]);

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
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card><Statistic title="סה״כ נכסים" value={stats.total} prefix={<HomeOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card><Statistic title="נכסים למכירה" value={stats.forSale} styles={{ content: { color: '#3f8600' } }} /></Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card><Statistic title="נכסים להשכרה" value={stats.forRent} styles={{ content: { color: '#1890ff' } }} /></Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card><Statistic title="נכסים פעילים" value={stats.active} styles={{ content: { color: '#faad14' } }} /></Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card><Statistic title="נכסים שנמכרו" value={stats.sold} styles={{ content: { color: '#cf1322' } }} /></Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-6">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input
            placeholder="חפש לפי כותרת, מיקום או עיר..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
          />
          <Space wrap style={{ width: '100%' }}>
            <Select
              value={filterDealType}
              onChange={setFilterDealType}
              style={{ minWidth: 150, width: '100%', maxWidth: '200px' }}
              size="large"
            >
              <Select.Option value="all">כל סוגי העסקאות</Select.Option>
              <Select.Option value="sale">מכירה</Select.Option>
              <Select.Option value="rent">השכרה</Select.Option>
            </Select>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
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
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `סה״כ ${total} נכסים`,
          }}
          scroll={{ x: 1500 }}
          locale={{ emptyText: 'לא נמצאו נכסים' }}
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
                <Tag color={dealType === 'sale' ? 'green' : 'blue'}>
                  {dealType === 'sale' ? 'מכירה' : 'השכרה'}
                </Tag>
              ),
            },
            {
              title: 'מחיר',
              dataIndex: 'price',
              key: 'price',
              width: 120,
              render: (price: string) => `₪${price}`,
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
                <Space direction="vertical" size={4}>
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
