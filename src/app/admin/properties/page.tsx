'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  message,
  Statistic,
  Space,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import type { ColumnsType } from 'antd/es/table';

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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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

  const getStatusLabel = (status?: string | null) => {
    const labels: Record<string, string> = {
      'Exclusive': 'בלעדי',
      'Opportunity': 'הזדמנות',
      'New': 'חדש'
    };
    return status ? labels[status] || status : '';
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDealType =
        filterDealType === 'all' || property.dealType === filterDealType;
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
      const response = await fetch(`/api/admin/properties/${selectedProperty}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setDeleteModal(false);
      setSelectedProperty(null);
      fetchProperties();
      message.success('הנכס נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting property:', error);
      message.error('שגיאה במחיקת הנכס. נסה שוב.');
    }
  };

  const handleStatusChange = async (propertyId: number, field: 'isActive' | 'isSold' | 'isPinned', value: boolean) => {
    try {
      const property = properties.find(p => p.id === propertyId);
      if (!property) return;

      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...property,
          [field]: value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      fetchProperties();
      if (field === 'isSold') {
        message.success(value ? 'הנכס סומן כנמכר' : 'הנכס בוטל מסומן כנמכר');
      } else if (field === 'isPinned') {
        message.success(value ? 'הנכס נצמד לעמוד הבית' : 'הנכס בוטל מהצמדה');
      } else {
        message.success(value ? 'הנכס הופעל' : 'הנכס הושבת');
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      message.error(`שגיאה בעדכון הסטטוס. נסה שוב.`);
    }
  };

  const getDealTypeBadge = (dealType: string) => {
    return dealType === 'sale' ? (
      <Badge status="success" text="מכירה" />
    ) : (
      <Badge status="processing" text="השכרה" />
    );
  };

  const getCityName = (city: string) => {
    const cityMap: Record<string, string> = {
      holon: 'חולון',
      batyam: 'בת ים',
      rishon: 'ראשון לציון',
      telaviv: 'תל אביב',
    };
    return cityMap[city] || city;
  };

  const getPropertyTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      apartment: 'דירה',
      'garden-apartment': 'דירת גן',
      cottage: "קוטג'",
      penthouse: 'נטהאוז',
      villa: 'וילה',
    };
    return typeMap[type] || type;
  };

  const columns: ColumnsType<Property> = [
    {
      title: 'תמונה',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images: string[]) => {
        const hasImage = images && images.length > 0 && images[0];
        return hasImage ? (
          <img
            src={images[0]}
            alt="property"
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '6px',
              display: 'block',
              border: '1px solid #f0f0f0',
            }}
          />
        ) : (
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '6px',
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#bfbfbf',
              fontSize: '12px',
              border: '1px solid #f0f0f0',
            }}
          >
            <HomeOutlined style={{ fontSize: '20px' }} />
          </div>
        );
      },
    },
    {
      title: 'כותרת',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Property) => (
        <div>
          <strong>{text}</strong>
          {record.status && (
            <div>
              <Badge status="warning" text={getStatusLabel(record.status)} />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'מיקום',
      dataIndex: 'location',
      key: 'location',
      render: (text: string, record: Property) => (
        <div>
          <div>{text}</div>
          <small style={{ color: '#999' }}>{getCityName(record.city)}</small>
        </div>
      ),
    },
    {
      title: 'סוג נכס',
      dataIndex: 'propertyType',
      key: 'propertyType',
      render: (type: string) => getPropertyTypeName(type),
    },
    {
      title: 'סוג עסקה',
      dataIndex: 'dealType',
      key: 'dealType',
      render: (dealType: string) => getDealTypeBadge(dealType),
    },
    {
      title: 'מחיר',
      dataIndex: 'price',
      key: 'price',
      render: (price: string, record: Property) => (
        <div>
          <strong>{price}</strong>
          {record.originalPrice && record.originalPrice !== price && (
            <div>
              <small style={{ textDecoration: 'line-through', color: '#999' }}>
                {record.originalPrice}
              </small>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'חדרים',
      dataIndex: 'rooms',
      key: 'rooms',
      render: (rooms: number) => `${rooms} חדרים`,
    },
    {
      title: 'שטח',
      dataIndex: 'area',
      key: 'area',
      render: (area: number) => `${area} מ״ר`,
    },
    {
      title: 'פעיל',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean, record: Property) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleStatusChange(record.id, 'isActive', checked)}
          checkedChildren="פעיל"
          unCheckedChildren="לא פעיל"
        />
      ),
    },
    {
      title: 'נמכר',
      dataIndex: 'isSold',
      key: 'isSold',
      width: 100,
      render: (isSold: boolean, record: Property) => (
        <Switch
          checked={isSold}
          onChange={(checked) => handleStatusChange(record.id, 'isSold', checked)}
          checkedChildren="נמכר"
          unCheckedChildren="לא נמכר"
        />
      ),
    },
    {
      title: 'נצמד',
      dataIndex: 'isPinned',
      key: 'isPinned',
      width: 100,
      render: (isPinned: boolean, record: Property) => (
        <Switch
          checked={isPinned}
          onChange={(checked) => handleStatusChange(record.id, 'isPinned', checked)}
          checkedChildren="נצמד"
          unCheckedChildren="לא נצמד"
        />
      ),
    },
    {
      title: 'פעולות',
      key: 'actions',
      width: 120,
      render: (_: any, record: Property) => (
        <Space>
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
  ];

  return (
    <div className="tabled px-2 sm:px-4 md:px-0">
      <Row gutter={[24, 0]}>
        <Col xs={24} xl={24}>
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
              <Card>
                <Statistic
                  title="סה״כ נכסים"
                  value={stats.total}
                  prefix={<HomeOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="נכסים למכירה"
                  value={stats.forSale}
                  styles={{ content: { color: '#3f8600' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="נכסים להשכרה"
                  value={stats.forRent}
                  styles={{ content: { color: '#1890ff' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="נכסים פעילים"
                  value={stats.active}
                  styles={{ content: { color: '#faad14' } }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card className="mb-4">
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

          {/* Table */}
          <Card
            variant="borderless"
            className="criclebox tablespace mb-24"
            title="רשימת נכסים"
          >
            <Table
              columns={columns}
              dataSource={filteredProperties}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `סה״כ ${total} נכסים`,
              }}
              className="ant-border-space"
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>
      </Row>

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
