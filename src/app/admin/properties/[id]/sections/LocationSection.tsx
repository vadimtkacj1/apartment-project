'use client';

import { Card, Row, Col, Form, Input, Select } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { PropertyFormSectionProps } from '../types';
import { ISRAELI_CITIES } from '@/data/cities';

export function LocationSection({ formData, handleChange }: PropertyFormSectionProps) {

  return (
    <Card title={<><EnvironmentOutlined /> מיקום הנכס</>} className="mb-4">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            label="עיר"
            name="city"
            rules={[{ required: true, message: 'עיר היא שדה חובה' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={(value) => handleChange('city', value)}
              options={ISRAELI_CITIES}
              notFoundContent="לא נמצא"
              placeholder="בחר עיר"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="שכונה" name="neighborhood">
            <Input
              placeholder="רמת אפעל"
              onChange={(e) => handleChange('neighborhood', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={12}>
          <Form.Item label="רחוב" name="street">
            <Input
              placeholder="רחוב הרצל"
              onChange={(e) => handleChange('street', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={6}>
          <Form.Item label="מספר בית" name="streetNumber">
            <Input
              placeholder="123"
              onChange={(e) => handleChange('streetNumber', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={6}>
          <Form.Item label="מספר דירה" name="apartmentNumber">
            <Input
              placeholder="12"
              onChange={(e) => handleChange('apartmentNumber', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
