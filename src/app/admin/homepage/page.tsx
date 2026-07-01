'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, App, Spin, Modal, Checkbox, Space, Typography, Radio, InputNumber, Form, Input, Tabs, Table, Image, Tag, Statistic, RadioChangeEvent } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { DealType, PropertyType, ParkingType, Position, FurnitureLevel, Direction } from '@/types/property.types';

const { Title, Text } = Typography;

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
  const { message } = App.useApp();
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

  // Section titles
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
  const [titlesForm] = Form.useForm();

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
          titlesForm.setFieldsValue(sectionTitles);
          return;
        }
        throw new Error('Failed to fetch titles');
      }

      const data = await response.json();
      setSectionTitles(data);
      titlesForm.setFieldsValue(data);
    } catch (error) {
      console.error('Error fetching section titles:', error);
      console.warn('Using default section titles');
      titlesForm.setFieldsValue(sectionTitles);
    } finally {
      setTitlesLoading(false);
    }
  };

  const handleSaveTitles = async () => {
    try {
      setTitlesSaving(true);
      const values = titlesForm.getFieldsValue();
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
        titlesForm.setFieldsValue(data.settings);
      } else if (data) {
        setSectionTitles(data);
        titlesForm.setFieldsValue(data);
      }
      message.success('הכותרות נשמרו בהצלחה!');
    } catch (error) {
      console.error('Error saving titles:', error);
      const errorMessage = error instanceof Error ? error.message : 'שגיאה לא ידועה';
      message.error(`שגיאה בשמירת הכותרות: ${errorMessage}`);
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
      message.error('שגיאה בטעינת הנכסים');
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

  const handleRadioChange = (e: RadioChangeEvent) => {
    setSelectedIds([e.target.value]);
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
      message.warning('ניתן לבחור רק נכס אחד לדירות ללא עמלה');
      return;
    }

    if (modalType === 'hot') {
      setHotProperties(selectedProperties);
      message.success('הנכסים נבחרו בהצלחה');
    } else {
      setNoCommissionProperties(selectedProperties);
      message.success('הנכס נבחר בהצלחה');
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

      message.success('כל השינויים נשמרו בהצלחה!');
      fetchProperties();
    } catch (error) {
      console.error('Error saving:', error);
      message.error('שגיאה בשמירת השינויים');
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

  const tableColumns = (type: 'hot' | 'noCommission') => [
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
            alt="נכס"
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
      ellipsis: { showTitle: true },
      render: (text: string, record: Property) => (
        <div style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '230px'
        }}>
          {text}
          {record.isSold && <Tag color="error" style={{ marginRight: '8px' }}>{record.dealType === 'rent' ? 'מושכר' : 'נמכר'}</Tag>}
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
      align: 'center' as const,
    },
    {
      title: 'שטח',
      dataIndex: 'area',
      key: 'area',
      width: 80,
      align: 'center' as const,
      render: (area: number) => `${area} מ"ר`,
    },
    {
      title: 'פעולות',
      key: 'actions',
      width: 150,
      render: (_: any, record: Property) => (
        <Button
          type="primary"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemove(record.id, type)}
        >
          הסר
        </Button>
      ),
    },
  ];

  const formatPrice = (price: string) => {
    const n = parseInt(String(price ?? '').replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(n) && n > 0 ? `₪${n.toLocaleString('en-US')}` : `₪${price}`;
  };

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
                  <Tag color="error" style={{ marginInlineStart: '8px' }}>
                    {property.dealType === 'rent' ? 'מושכר' : 'נמכר'}
                  </Tag>
                )}
              </div>
              <div className="admin-card__meta">{property.location}</div>
            </div>
            <span dir="ltr" style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {formatPrice(property.price)}
            </span>
          </div>
          <div className="admin-card__fields">
            <span><b>חדרים</b> {property.rooms}</span>
            <span><b>שטח</b> {property.area} מ&quot;ר</span>
          </div>
          <div className="admin-card__actions">
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(property.id, type)}
            >
              הסר
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 md:px-0">
        {/* Header */}
        <div style={{ marginBottom: '16px' }}>
          <h1 className="text-4xl font-bold" style={{ margin: 0 }}>ניהול עמוד הבית</h1>
          <Text type="secondary">ערוך כותרות וניהול נכסים מוצגים בדף הבית</Text>
        </div>

        {/* Section Titles Editor */}
        <Card
          title="עריכת כותרות סעיפים"
          className="rounded-lg"
          style={{ marginBottom: '24px' }}
          loading={titlesLoading}
        >
          <Form
            form={titlesForm}
            layout="vertical"
            onFinish={() => handleSaveTitles()}
          >
            <Tabs
              items={[
                {
                  key: 'main',
                  label: 'סעיפים ראשיים',
                  children: (
                    <Space vertical className="w-full" size="large">
                      <Form.Item label="כותרת: הצעות חמות" name="hotPropositionsTitle">
                        <Input placeholder="הצעות חמות" disabled={titlesLoading} />
                      </Form.Item>
                      <Form.Item label="כותרת: נכסים נבחרים" name="featuredPropertiesTitle">
                        <Input placeholder="נכסים באיזור המרכז" disabled={titlesLoading} />
                      </Form.Item>
                      <Form.Item label="תת-כותרת: נכסים נבחרים" name="featuredPropertiesSubtitle">
                        <Input placeholder="מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז" disabled={titlesLoading} />
                      </Form.Item>
                      <Form.Item label="כותרת: למה לבחור בנו?" name="valuesSectionTitle">
                        <Input placeholder="למה לבחור בנו?" disabled={titlesLoading} />
                      </Form.Item>
                    </Space>
                  ),
                },
                {
                  key: 'secondary',
                  label: 'סעיפים נוספים',
                  children: (
                    <Space vertical className="w-full" size="large">
                      <Form.Item label="כותרת: אודות" name="aboutSectionTitle">
                        <Input placeholder="אודות" disabled={titlesLoading} />
                      </Form.Item>
                      <Form.Item label="כותרת: מה חשוב לדעת" name="processSectionTitle">
                        <Input placeholder="מה חשוב לדעת כשקונים נכס?" disabled={titlesLoading} />
                      </Form.Item>
                      <Form.Item label="כותרת: מה הלקוחות אומרים" name="testimonialsTitle">
                        <Input placeholder="מה הלקוחות שלנו אומרים" disabled={titlesLoading} />
                      </Form.Item>
                      <Form.Item label="כותרת: דירה ללא עמלה" name="noCommissionTitle">
                        <Input placeholder="דירה ללא עמלת תיווך" disabled={titlesLoading} />
                      </Form.Item>
                    </Space>
                  ),
                },
              ]}
            />

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Button
                type="primary"
                size="large"
                loading={titlesSaving}
                onClick={handleSaveTitles}
                icon={<EditOutlined />}
                style={{ minWidth: '150px' }}
              >
                שמור כותרות
              </Button>
            </div>
          </Form>
        </Card>

        {/* Properties Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3" style={{ marginTop: '24px', marginBottom: '16px' }}>
          <div>
            <Title level={3} style={{ margin: 0, marginBottom: '4px' }}>ניהול נכסים מוצגים</Title>
            <Text type="secondary">בחר נכסים להצגה בסעיפים שונים בדף הבית</Text>
          </div>
          <Button
            type="primary"
            size="middle"
            loading={saving}
            onClick={handleSaveAll}
            style={{ width: '100%', maxWidth: '180px' }}
          >
            שמור בחירת נכסים
          </Button>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12}>
            <Card>
              <Statistic title="הצעות חמות" value={hotProperties.length} suffix="נכסים" />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card>
              <Statistic title="דירות ללא עמלה (מקסימום 1)" value={`${noCommissionProperties.length}/1`} suffix="נכס" />
            </Card>
          </Col>
        </Row>

        {/* Sections */}
        <div className="grid grid-cols-1 gap-6">
          {/* Hot Propositions Section */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '18px', fontWeight: 600 }}>הצעות חמות</span>
              </div>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal('hot')}
                size="middle"
                style={{ borderRadius: '8px', fontWeight: 500 }}
              >
                הוסף נכסים
              </Button>
            }
          >
            {/* Price Filter Settings */}
            <div className="mb-4 p-3 rounded-lg" style={{ border: '1px solid #f0f0f0' }}>
              <Radio.Group
                value={hotPropositionsMode}
                onChange={(e) => setHotPropositionsMode(e.target.value)}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}
              >
                <Radio value="manual">בחירה ידנית</Radio>
                <Radio value="price">סינון לפי מחיר</Radio>
              </Radio.Group>

              {hotPropositionsMode === 'price' && (
                <div className="mt-2 pt-2 admin-filter-full" style={{ borderTop: '1px solid #f0f0f0' }}>
                  <InputNumber
                    value={hotPropositionsMaxPrice}
                    onChange={(value) => setHotPropositionsMaxPrice(value || 0)}
                    formatter={value => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value!.replace(/₪\s?|(,*)/g, '') as any}
                    style={{ width: '100%' }}
                    min={0}
                    step={100000}
                    placeholder="מחיר מקסימלי"
                  />
                </div>
              )}
            </div>

            {hotProperties.length === 0 ? (
              <div className="text-center py-8">
                <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>אין נכסים מוצגים</Text>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => openModal('hot')}
                >
                  הוסף נכסים
                </Button>
              </div>
            ) : (
              <>
                {/* desktop — existing table, unchanged */}
                <div className="admin-only-desktop">
                  <Table
                    dataSource={hotProperties}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    columns={tableColumns('hot')}
                  />
                </div>
                {/* mobile — card list */}
                <div className="admin-only-mobile">
                  {renderMobileCards(hotProperties, 'hot')}
                </div>
              </>
            )}
          </Card>

          {/* No Commission Section */}
          <Card
            title={
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>דירות ללא עמלה</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#999' }}>
                  ניתן לבחור נכס אחד בלבד
                </div>
              </div>
            }
            extra={
              <Button
                type="primary"
                icon={noCommissionProperties.length >= 1 ? <EditOutlined /> : <PlusOutlined />}
                onClick={() => openModal('noCommission')}
                disabled={noCommissionProperties.length >= 1}
                size="middle"
                style={{ borderRadius: '8px', fontWeight: 500 }}
              >
                {noCommissionProperties.length >= 1 ? 'נבחר נכס' : 'בחר נכס'}
              </Button>
            }
          >
            {noCommissionProperties.length === 0 ? (
              <div className="text-center py-8">
                <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>לא נבחר נכס</Text>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => openModal('noCommission')}
                >
                  בחר נכס
                </Button>
              </div>
            ) : (
              <>
                {/* desktop — existing table, unchanged */}
                <div className="admin-only-desktop">
                  <Table
                    dataSource={noCommissionProperties}
                    rowKey="id"
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    columns={tableColumns('noCommission')}
                  />
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
        <Modal
          title={
            <div style={{ padding: '8px 0' }}>
              <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>
                {modalType === 'hot' ? 'בחר נכסים להצעות חמות' : 'בחר נכס אחד ללא עמלה'}
              </div>
              {modalType === 'noCommission' && (
                <div style={{ fontSize: '13px', fontWeight: 'normal', color: '#999', marginTop: '4px' }}>
                  שים לב: ניתן לבחור רק נכס אחד
                </div>
              )}
            </div>
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width="min(900px, 96vw)"
          styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
          okText="אישור"
          cancelText="ביטול"
          okButtonProps={{
            size: 'large',
            style: { borderRadius: '8px', fontWeight: 500 }
          }}
          cancelButtonProps={{
            size: 'large',
            style: { borderRadius: '8px' }
          }}
        >
          <div>
            {modalType === 'hot' && (
              <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                <Checkbox
                  checked={selectedIds.length === availableProperties.length && availableProperties.length > 0}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < availableProperties.length}
                  onChange={handleSelectAll}
                >
                  <strong>בחר הכל ({selectedIds.length}/{availableProperties.length})</strong>
                </Checkbox>
              </div>
            )}

            <div>
              {modalType === 'noCommission' ? (
                <Radio.Group
                  value={selectedIds[0]}
                  onChange={handleRadioChange}
                  className="w-full"
                >
                  <Space vertical className="w-full">
                    {availableProperties.map((property) => (
                      <Card key={property.id} size="small" className="w-full">
                        <Radio value={property.id} className="w-full">
                          <div className="flex items-center gap-3 ml-2">
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
                          </div>
                        </Radio>
                      </Card>
                    ))}
                  </Space>
                </Radio.Group>
              ) : (
                <Checkbox.Group
                  value={selectedIds}
                  onChange={(values) => setSelectedIds(values as number[])}
                  className="w-full"
                >
                  <Space vertical className="w-full">
                    {availableProperties.map((property) => (
                      <Card key={property.id} size="small" className="w-full">
                        <Checkbox value={property.id} className="w-full">
                          <div className="flex items-center gap-3 ml-2">
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
                          </div>
                        </Checkbox>
                      </Card>
                    ))}
                  </Space>
                </Checkbox.Group>
              )}
            </div>
          </div>
        </Modal>
    </div>
  );
}