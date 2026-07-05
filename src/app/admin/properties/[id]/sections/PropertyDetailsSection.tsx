import { Card, Row, Col, Form, Select, InputNumber, Checkbox } from 'antd';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyFormSectionProps } from '../types';
import {
  buildPropertyTypeOptions,
  buildPositionOptions,
  buildFurnitureOptions,
  buildKitchenOptions,
  buildParkingOptions,
  buildDirectionOptions,
  ROOMS_OPTIONS,
} from '../constants';

export function PropertyDetailsSection({ formData, handleChange }: PropertyFormSectionProps) {
  const t = useAdminMessages(propertyFormMessages);
  return (
    <Card title={t.details.cardTitle} className="mb-4">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label={t.details.propertyTypeLabel} name="propertyType">
            <Select
              onChange={(value) => handleChange('propertyType', value)}
              options={buildPropertyTypeOptions(t)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label={t.details.positionLabel} name="position">
            <Select
              onChange={(value) => handleChange('position', value)}
              options={buildPositionOptions(t)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label={t.details.furnitureLabel} name="furniture">
            <Select
              onChange={(value) => handleChange('furniture', value)}
              options={buildFurnitureOptions(t)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label={t.details.kitchenLabel} name="kitchen">
            <Select
              onChange={(value) => handleChange('kitchen', value)}
              options={buildKitchenOptions(t)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={8} md={4}>
          <Form.Item label={t.details.floorLabel} name="floor">
            <InputNumber
              style={{ width: '100%' }}
              onChange={(value) => handleChange('floor', value || 0)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Form.Item label={t.details.totalFloorsLabel} name="totalFloors">
            <InputNumber
              style={{ width: '100%' }}
              onChange={(value) => handleChange('totalFloors', value || 0)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Form.Item label={t.details.parkingLabel} name="parking">
            <Select
              onChange={(value) => handleChange('parking', value)}
              options={buildParkingOptions(t)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Form.Item
            label={t.details.roomsLabel}
            name="rooms"
            rules={[{ required: true, message: t.details.roomsRequired }]}
          >
            <Select
              onChange={(value) => {
                handleChange('rooms', value);
                handleChange('bedrooms', value);
              }}
              options={ROOMS_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Form.Item label={t.details.bathroomsLabel} name="bathrooms">
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              onChange={(value) => handleChange('bathrooms', value || 1)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Form.Item
            label={t.details.areaLabel}
            name="area"
            rules={[{ required: true, message: t.details.areaRequired }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              onChange={(value) => handleChange('area', value || 0)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Form.Item label={t.details.builtAreaLabel} name="builtArea">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              onChange={(value) => handleChange('builtArea', value || 0)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8} md={4}>
          <Form.Item label={t.details.balconySizeLabel} name="balconySize">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              onChange={(value) => handleChange('balconySize', value || null)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item label={t.details.directionsLabel} name="directions">
            <Checkbox.Group
              options={buildDirectionOptions(t)}
              onChange={(values) => handleChange('directions', values)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
