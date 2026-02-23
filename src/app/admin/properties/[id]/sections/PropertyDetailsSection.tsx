import { Card, Row, Col, Form, Select, InputNumber, Checkbox } from 'antd';
import { PropertyFormSectionProps } from '../types';
import {
  PROPERTY_TYPE_OPTIONS,
  POSITION_OPTIONS,
  FURNITURE_OPTIONS,
  KITCHEN_OPTIONS,
  PARKING_OPTIONS,
  DIRECTION_OPTIONS,
  ROOMS_OPTIONS,
} from '../constants';

export function PropertyDetailsSection({ formData, handleChange }: PropertyFormSectionProps) {
  return (
    <Card title="פרטי הנכס" className="mb-4">
      <Row gutter={16}>
        <Col xs={12} sm={12} md={6}>
          <Form.Item label="סוג נכס" name="propertyType">
            <Select
              onChange={(value) => handleChange('propertyType', value)}
              options={PROPERTY_TYPE_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Form.Item label="מיקום בבניין" name="position">
            <Select
              onChange={(value) => handleChange('position', value)}
              options={POSITION_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Form.Item label="ריהוט" name="furniture">
            <Select
              onChange={(value) => handleChange('furniture', value)}
              options={FURNITURE_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={6}>
          <Form.Item label="מטבח" name="kitchen">
            <Select
              onChange={(value) => handleChange('kitchen', value)}
              options={KITCHEN_OPTIONS}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={12} sm={8} md={4}>
          <Form.Item label="קומה" name="floor">
            <InputNumber
              style={{ width: '100%' }}
              onChange={(value) => handleChange('floor', value || 0)}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Form.Item label="סה״כ קומות" name="totalFloors">
            <InputNumber
              style={{ width: '100%' }}
              onChange={(value) => handleChange('totalFloors', value || 0)}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Form.Item label="חניה" name="parking">
            <Select
              onChange={(value) => handleChange('parking', value)}
              options={PARKING_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Form.Item
            label="חדרים"
            name="rooms"
            rules={[{ required: true, message: 'חדרים הוא שדה חובה' }]}
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
        <Col xs={12} sm={8} md={4}>
          <Form.Item label="חדרי רחצה" name="bathrooms">
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              onChange={(value) => handleChange('bathrooms', value || 1)}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Form.Item
            label="שטח (מ״ר)"
            name="area"
            rules={[{ required: true, message: 'שטח הוא שדה חובה' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              onChange={(value) => handleChange('area', value || 0)}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Form.Item label="שטח בנוי" name="builtArea">
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              onChange={(value) => handleChange('builtArea', value || 0)}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Form.Item label="גודל מרפסת שמש (מ״ר)" name="balconySize">
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
          <Form.Item label="כיווני אוויר" name="directions">
            <Checkbox.Group
              options={DIRECTION_OPTIONS}
              onChange={(values) => handleChange('directions', values)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
