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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import PropertyCard from '@/components/properties/PropertyCard';
import type { DealType, PropertyType, ParkingType, Position, FurnitureLevel, Direction } from '@/types/property.types';

interface Property {
  id: number;
  dealType: string;
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
    return { total, forSale, forRent, active };
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
        (filterStatus === 'inactive' && !property.isActive);
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
    try {
      const property = properties.find((p) => p.id === propertyId);
      if (!property) return;
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...property, [field]: value }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchProperties();
      const msgs: Record<string, string> = {
        isSold: value ? 'הנכס סומן כנמכר' : 'הנכס בוטל מסומן כנמכר',
        isPinned: value ? 'הנכס נצמד לעמוד הבית' : 'הנכס בוטל מהצמדה',
        isActive: value ? 'הנכס הופעל' : 'הנכס הושבת',
      };
      message.success(msgs[field]);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      message.error('שגיאה בעדכון הסטטוס. נסה שוב.');
    }
  };

  return (
    <div className="px-2 sm:px-4 md:px-0">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', fontWeight: 'bold', margin: 0 }}>ניהול נכסים</h1>
        <Link href="/admin/properties/new" className="w-full sm:w-auto">
          <Button type="primary" icon={<PlusOutlined />} size="large" className="w-full sm:w-auto">
            הוסף נכס חדש
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="סה״כ נכסים" value={stats.total} prefix={<HomeOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="נכסים למכירה" value={stats.forSale} styles={{ content: { color: '#3f8600' } }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="נכסים להשכרה" value={stats.forRent} styles={{ content: { color: '#1890ff' } }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="נכסים פעילים" value={stats.active} styles={{ content: { color: '#faad14' } }} /></Card>
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
            </Select>
          </Space>
        </Space>
      </Card>

      {/* Property Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Spin size="large" />
        </div>
      ) : filteredProperties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>לא נמצאו נכסים</div>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredProperties.map((property) => (
            <Col key={property.id} xs={24} sm={12} lg={8}>
              <div style={{ position: 'relative' }}>
                {/* Admin controls overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 8px',
                    background: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(4px)',
                    borderRadius: '16px 16px 0 0',
                    flexWrap: 'wrap',
                    gap: '6px',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                >
                  <Space size={4} wrap>
                    <Switch
                      size="small"
                      checked={property.isActive}
                      onChange={(v) => handleStatusChange(property.id, 'isActive', v)}
                      checkedChildren="פעיל"
                      unCheckedChildren="כבוי"
                    />
                    <Switch
                      size="small"
                      checked={property.isSold}
                      onChange={(v) => handleStatusChange(property.id, 'isSold', v)}
                      checkedChildren="נמכר"
                      unCheckedChildren="פנוי"
                    />
                    <Switch
                      size="small"
                      checked={property.isPinned}
                      onChange={(v) => handleStatusChange(property.id, 'isPinned', v)}
                      checkedChildren="נצמד"
                      unCheckedChildren="סטנדרט"
                    />
                  </Space>
                  <Space size={4}>
                    <Link href={`/admin/properties/${property.id}`}>
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
                        setSelectedProperty(property.id);
                        setDeleteModal(true);
                      }}
                    >
                      מחק
                    </Button>
                  </Space>
                </div>

                {/* PropertyCard */}
                <div style={{ opacity: property.isActive ? 1 : 0.5 }}>
                  <PropertyCard
                    id={property.id}
                    title={property.title}
                    location={property.location}
                    price={property.price}
                    originalPrice={property.originalPrice ?? undefined}
                    area={property.area}
                    rooms={String(property.rooms)}
                    floor={property.floor ?? undefined}
                    totalFloors={property.totalFloors ?? undefined}
                    images={property.images}
                    status={property.status ?? undefined}
                    isSold={property.isSold}
                    dealType={property.dealType as DealType}
                    propertyType={property.propertyType as PropertyType}
                    parking={property.parking as ParkingType}
                    position={property.position as Position | undefined}
                    furniture={property.furniture as FurnitureLevel}
                    directions={property.directions as Direction[]}
                    vacancyDate={property.vacancyDate ?? undefined}
                    neighborhood={property.neighborhood ?? undefined}
                    street={property.street ?? undefined}
                    streetNumber={property.streetNumber ?? undefined}
                    features={{
                      hasAirConditioning: property.hasAirConditioning,
                      hasElevator: property.hasElevator,
                      hasStorage: property.hasStorage,
                      hasSafeRoom: property.hasSafeRoom,
                      hasSunBalcony: property.hasSunBalcony,
                      hasBoiler: property.hasBoiler,
                      hasDisabledAccess: property.hasDisabledAccess,
                      hasSunroom: property.hasSunroom,
                    }}
                  />
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

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
