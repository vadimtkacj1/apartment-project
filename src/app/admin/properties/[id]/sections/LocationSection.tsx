'use client';

import { Card, Row, Col, Form, Input, Select } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyFormSectionProps } from '../types';
import { ISRAELI_CITIES } from '@/data/cities';

export function LocationSection({ formData, handleChange }: PropertyFormSectionProps) {
  const t = useAdminMessages(propertyFormMessages);

  return (
    <Card title={<><EnvironmentOutlined /> {t.location.cardTitle}</>} className="mb-4">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            label={t.location.cityLabel}
            name="city"
            rules={[{ required: true, message: t.location.cityRequired }]}
          >
            <Select
              showSearch={{
                optionFilterProp: 'label',
                filterOption: (input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
              }}
              onChange={(value) => handleChange('city', value)}
              options={ISRAELI_CITIES}
              notFoundContent={t.location.notFound}
              placeholder={t.location.cityPlaceholder}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label={t.location.neighborhoodLabel} name="neighborhood">
            <Input
              placeholder={t.location.neighborhoodPlaceholder}
              onChange={(e) => handleChange('neighborhood', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={12}>
          <Form.Item label={t.location.streetLabel} name="street">
            <Input
              placeholder={t.location.streetPlaceholder}
              onChange={(e) => handleChange('street', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={6}>
          <Form.Item label={t.location.houseNumberLabel} name="streetNumber">
            <Input
              placeholder="123"
              onChange={(e) => handleChange('streetNumber', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={6} md={6}>
          <Form.Item label={t.location.apartmentNumberLabel} name="apartmentNumber">
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
