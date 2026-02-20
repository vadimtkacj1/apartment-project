'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, message, Spin, Modal, Checkbox, Space, Typography, Radio, InputNumber, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

interface HomepageSettings {
  hotPropositionsMode: 'manual' | 'price';
  hotPropositionsMaxPrice?: number;
}

interface SortableItemProps {
  id: number;
  property: Property;
  onRemove: (id: number) => void;
}

function SortableItem({ id, property, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-4 relative"
    >
      {/* Drag and Delete Overlay */}
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
          gap: '6px',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
      >
        <div {...attributes} {...listeners} className="cursor-move p-2 hover:bg-white/20 rounded">
          <HolderOutlined style={{ fontSize: '18px', color: '#fff' }} />
        </div>
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => onRemove(id)}
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
  );
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
  const [hotPropositionsMode, setHotPropositionsMode] = useState<'manual' | 'price'>('manual');
  const [hotPropositionsMaxPrice, setHotPropositionsMaxPrice] = useState<number | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProperties();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/homepage-settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data: HomepageSettings = await response.json();
      setHotPropositionsMode(data.hotPropositionsMode);
      setHotPropositionsMaxPrice(data.hotPropositionsMaxPrice);
    } catch (error) {
      console.error('Error fetching settings:', error);
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

  const handleDragEnd = (event: DragEndEvent, type: 'hot' | 'noCommission') => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const items = type === 'hot' ? hotProperties : noCommissionProperties;
    const setItems = type === 'hot' ? setHotProperties : setNoCommissionProperties;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    setItems(arrayMove(items, oldIndex, newIndex));
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

    if (modalType === 'hot') {
      setHotProperties(selectedProperties);
    } else {
      // For NoCommission, only take the first selected property
      if (selectedProperties.length > 1) {
        message.warning('ניתן לבחור רק נכס אחד לדירות ללא עמלה');
        return;
      }
      setNoCommissionProperties(selectedProperties);
    }

    setIsModalVisible(false);
    message.success('הנכסים נבחרו בהצלחה');
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

      // Save homepage settings
      await fetch('/api/admin/homepage-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotPropositionsMode,
          hotPropositionsMaxPrice,
        }),
      });

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

      // Set hot properties (only in manual mode)
      if (hotPropositionsMode === 'manual') {
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
      }

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

  const availableProperties = allProperties.filter(p =>
    modalType === 'hot'
      ? !noCommissionProperties.some(nc => nc.id === p.id) || selectedIds.includes(p.id)
      : !hotProperties.some(h => h.id === p.id) || selectedIds.includes(p.id)
  );

  // Helper to extract numeric price from string like "₪3,200,000" or "₪5,500"
  const extractNumericPrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const numericStr = priceStr.replace(/[^\d]/g, '');
    return parseInt(numericStr) || 0;
  };

  // Calculate properties that would be shown in price mode
  const priceFilteredProperties = useMemo(() => {
    if (hotPropositionsMode !== 'price' || !hotPropositionsMaxPrice) return [];
    return allProperties.filter(p => {
      const priceNum = extractNumericPrice(p.price);
      return p.dealType === 'sale' && p.isActive && priceNum > 0 && priceNum <= hotPropositionsMaxPrice;
    });
  }, [allProperties, hotPropositionsMode, hotPropositionsMaxPrice]);

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
            {hotPropositionsMode === 'manual' ? (
              <Title level={3} style={{ margin: 0 }}>{hotProperties.length} נכסים</Title>
            ) : (
              <div>
                <Title level={3} style={{ margin: 0 }}>מצב אוטומטי</Title>
                {hotPropositionsMaxPrice && (
                  <Text type="secondary">מחיר עד {hotPropositionsMaxPrice.toLocaleString()} ₪</Text>
                )}
              </div>
            )}
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
            hotPropositionsMode === 'manual' && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal('hot')}
              >
                הוסף נכסים
              </Button>
            )
          }
        >
          {/* Mode Selection */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>אופן בחירת נכסים:</Text>
                <Radio.Group
                  value={hotPropositionsMode}
                  onChange={(e) => setHotPropositionsMode(e.target.value)}
                  className="mt-2 block"
                >
                  <Space direction="vertical">
                    <Radio value="manual">בחירה ידנית - בחר נכסים ספציפיים</Radio>
                    <Radio value="price">אוטומטי לפי מחיר - הצג נכסים מתחת למחיר מסוים</Radio>
                  </Space>
                </Radio.Group>
              </div>

              {hotPropositionsMode === 'price' && (
                <div>
                  <Text strong>מחיר מקסימלי:</Text>
                  <div className="mt-2">
                    <InputNumber
                      value={hotPropositionsMaxPrice}
                      onChange={(value) => setHotPropositionsMaxPrice(value ?? undefined)}
                      placeholder="הזן מחיר מקסימלי"
                      style={{ width: '200px' }}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/,/g, '')}
                      addonAfter="₪"
                      min={0}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      יוצגו כל הנכסים למכירה במחיר נמוך מהמחיר שהוזן
                    </div>
                  </div>
                </div>
              )}
            </Space>
          </div>

          {/* Property List - only show in manual mode */}
          {hotPropositionsMode === 'manual' && (
            <>
              {hotProperties.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  לא נבחרו נכסים. לחץ על "הוסף נכסים" כדי להתחיל
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(e, 'hot')}
                >
                  <SortableContext
                    items={hotProperties.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {hotProperties.map((property) => (
                      <SortableItem
                        key={property.id}
                        id={property.id}
                        property={property}
                        onRemove={(id) => handleRemove(id, 'hot')}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </>
          )}

          {/* Price mode info */}
          {hotPropositionsMode === 'price' && (
            <div className="py-4">
              <div className="text-center mb-4">
                <div className="text-gray-600 mb-2">
                  במצב אוטומטי לפי מחיר
                </div>
                {hotPropositionsMaxPrice ? (
                  <div className="text-lg font-semibold text-primary">
                    יוצגו {priceFilteredProperties.length} נכסים עד {hotPropositionsMaxPrice.toLocaleString()} ₪
                  </div>
                ) : (
                  <div className="text-yellow-600">
                    הזן מחיר מקסימלי למעלה
                  </div>
                )}
              </div>

              {/* Preview of matching properties */}
              {priceFilteredProperties.length > 0 && (
                <div className="mt-4">
                  <Text type="secondary" className="block mb-4">תצוגה מקדימה של נכסים שיוצגו:</Text>
                  <div className="max-h-[600px] overflow-y-auto">
                    <Row gutter={[16, 16]}>
                      {priceFilteredProperties.slice(0, 12).map((property) => (
                        <Col key={property.id} xs={24} sm={12} lg={24} xl={12}>
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
                        </Col>
                      ))}
                    </Row>
                    {priceFilteredProperties.length > 12 && (
                      <div className="text-center text-sm text-gray-500 pt-4 pb-2">
                        ועוד {priceFilteredProperties.length - 12} נכסים נוספים...
                      </div>
                    )}
                  </div>
                </div>
              )}
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
