'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, message, Spin, Modal, Checkbox, Space, Typography, Radio, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import PropertyCard from '@/components/properties/PropertyCard';
import type { DealType, PropertyType, ParkingType, Position, FurnitureLevel, Direction } from '@/types/property.types';

const { Title, Text } = Typography;

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
  isHotProposition: boolean;
  isNoCommission: boolean;
}

export default function HomepagePage() {
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
  }, []);

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

  const handleModalOk = () => {
    const selectedProperties = allProperties.filter(p => selectedIds.includes(p.id));

    // NoCommission only supports 1 property
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

      // Reset all properties first
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

      // Set hot properties
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

      // Set no commission properties
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
      fetchProperties(); // Refresh data
    } catch (error) {
      console.error('Error saving:', error);
      message.error('שגיאה בשמירת השינויים');
    } finally {
      setSaving(false);
    }
  };

  const availableProperties = allProperties.filter(p => {
    // Base filter - exclude properties already in the other section
    const notInOtherSection = modalType === 'hot'
      ? !noCommissionProperties.some(nc => nc.id === p.id) || selectedIds.includes(p.id)
      : !hotProperties.some(h => h.id === p.id) || selectedIds.includes(p.id);

    if (!notInOtherSection) return false;

    // Apply price filter for Hot Propositions in price mode
    if (modalType === 'hot' && hotPropositionsMode === 'price') {
      const priceNum = parseInt(p.price.replace(/[^0-9]/g, ''));
      return priceNum <= hotPropositionsMaxPrice;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title level={2} style={{ margin: 0 }}>ניהול עמוד הבית</Title>
        <Button
          type="primary"
          size="large"
          loading={saving}
          onClick={handleSaveAll}
        >
          שמור את כל השינויים
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <Space direction="vertical" size="small">
            <Text type="secondary">הצעות חמות</Text>
            <Title level={3} style={{ margin: 0 }}>{hotProperties.length} נכסים</Title>
          </Space>
        </Card>
        <Card>
          <Space direction="vertical" size="small">
            <Text type="secondary">דירות ללא עמלה (מקסימום 1)</Text>
            <Title level={3} style={{ margin: 0 }}>{noCommissionProperties.length}/1 נכס</Title>
          </Space>
        </Card>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hot Propositions Section */}
        <Card
          title="הצעות חמות"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal('hot')}
            >
              הוסף נכסים
            </Button>
          }
        >
          {/* Price Filter Settings */}
          <div className="mb-4 p-4 bg-gray-50 rounded border">
            <div className="mb-3">
              <Text strong>הגדרות תצוגה</Text>
              <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>(נשמר אוטומטית)</Text>
            </div>

            <Radio.Group
              value={hotPropositionsMode}
              onChange={(e) => setHotPropositionsMode(e.target.value)}
            >
              <Space direction="vertical">
                <Radio value="manual">בחירה ידנית של נכסים</Radio>
                <Radio value="price">סינון לפי מחיר מקסימלי</Radio>
              </Space>
            </Radio.Group>

            {hotPropositionsMode === 'price' && (
              <div className="mt-4 pt-4 border-t">
                <Text strong style={{ fontSize: '13px' }}>מחיר מקסימלי:</Text>
                <InputNumber
                  value={hotPropositionsMaxPrice}
                  onChange={(value) => setHotPropositionsMaxPrice(value || 0)}
                  formatter={value => `₪ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/₪\s?|(,*)/g, '') as any}
                  style={{ width: '100%', marginTop: '8px' }}
                  size="large"
                  min={0}
                  step={100000}
                />
                <div className="mt-2 text-xs text-gray-500">
                  יוצגו נכסים עד ₪{hotPropositionsMaxPrice.toLocaleString('he-IL')}
                </div>
              </div>
            )}
          </div>

          {hotProperties.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              לא נבחרו נכסים. לחץ על "הוסף נכסים" כדי להתחיל
            </div>
          ) : (
            <div>
              {hotProperties.map((property) => (
                <div key={property.id} className="mb-4 relative">
                  {/* Delete button overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      zIndex: 20,
                      padding: '6px 8px',
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleRemove(property.id, 'hot')}
                    >
                      הסר
                    </Button>
                  </div>

                  {/* Property Card */}
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
              ))}
            </div>
          )}
        </Card>

        {/* No Commission Section */}
        <Card
          title={
            <div>
              <div>דירות ללא עמלה</div>
              <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#999', marginTop: '4px' }}>
                ניתן לבחור נכס אחד בלבד
              </div>
            </div>
          }
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal('noCommission')}
              disabled={noCommissionProperties.length >= 1}
            >
              {noCommissionProperties.length >= 1 ? 'נבחר נכס' : 'בחר נכס'}
            </Button>
          }
        >
          {noCommissionProperties.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              לא נבחר נכס. לחץ על "בחר נכס" כדי להתחיל
            </div>
          ) : (
            <div>
              {noCommissionProperties.map((property) => (
                <div key={property.id} className="mb-4 relative">
                  {/* Delete button overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      zIndex: 20,
                      padding: '6px 8px',
                    }}
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => handleRemove(property.id, 'noCommission')}
                    >
                      הסר
                    </Button>
                  </div>

                  {/* Property Card */}
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
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Property Selector Modal */}
      <Modal
        title={
          <div>
            <div>{modalType === 'hot' ? 'בחר נכסים להצעות חמות' : 'בחר נכס אחד ללא עמלה'}</div>
            {modalType === 'noCommission' && (
              <div style={{ fontSize: '12px', fontWeight: 'normal', color: '#999', marginTop: '4px' }}>
                שים לב: ניתן לבחור רק נכס אחד
              </div>
            )}
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        okText="אישור"
        cancelText="ביטול"
      >
        <div className="max-h-96 overflow-y-auto">
          <Checkbox.Group
            value={selectedIds}
            onChange={(values) => setSelectedIds(values as number[])}
            className="w-full"
          >
            <Space direction="vertical" className="w-full">
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
        </div>
      </Modal>
    </div>
  );
}
