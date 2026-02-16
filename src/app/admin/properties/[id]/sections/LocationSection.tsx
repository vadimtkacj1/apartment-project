'use client';

import { useState } from 'react';
import { Card, Row, Col, Form, Input, Select, message } from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { PropertyFormSectionProps } from '../types';
import { CITY_OPTIONS } from '../constants';

export function LocationSection({ formData, handleChange }: PropertyFormSectionProps) {
  const [validatingZip, setValidatingZip] = useState(false);
  const form = Form.useFormInstance();

  const validateZipCode = async (zipCode: string) => {
    if (!zipCode || zipCode.trim().length === 0) {
      return;
    }

    // Normalize zip code
    const normalizedZip = zipCode.replace(/[\s-]/g, '').trim();

    // Check if it's a valid format (5 or 7 digits)
    if (!/^\d{5,7}$/.test(normalizedZip)) {
      return; // Don't validate if format is invalid, let user finish typing
    }

    setValidatingZip(true);
    try {
      const response = await fetch(`/api/validate-zip?zip=${encodeURIComponent(normalizedZip)}`);
      const data = await response.json();

      if (data.success && data.data) {
        const { city, street, houseNumber, region } = data.data;

        // Map city name to our format
        const mapCityName = (cityName: string): string => {
          const cityMap: { [key: string]: string } = {
            'חולון': 'holon',
            'Holon': 'holon',
            'בת ים': 'batyam',
            'Bat Yam': 'batyam',
            'ראשון לציון': 'rishon',
            'Rishon LeZion': 'rishon',
            'תל אביב': 'telaviv',
            'Tel Aviv': 'telaviv',
            'Tel Aviv-Yafo': 'telaviv',
          };
          return cityMap[cityName] || cityName.toLowerCase();
        };

        // Auto-fill city if available
        if (city) {
          const mappedCity = mapCityName(city);
          handleChange('city', mappedCity);
          form.setFieldValue('city', mappedCity);
        }

        // Auto-fill street if available
        if (street) {
          handleChange('street', street);
          form.setFieldValue('street', street);
        }

        // Auto-fill street number if available
        if (houseNumber) {
          handleChange('streetNumber', houseNumber);
          form.setFieldValue('streetNumber', houseNumber);
        }

        // Auto-fill neighborhood/region if available
        if (region) {
          handleChange('neighborhood', region);
          form.setFieldValue('neighborhood', region);
        }

        // Auto-generate location display
        const locationParts = [city, region].filter(Boolean);
        if (locationParts.length > 0) {
          const locationStr = locationParts.join(', ');
          handleChange('location', locationStr);
          form.setFieldValue('location', locationStr);
        }

        message.success(`מיקוד ${normalizedZip} נמצא: ${city || ''}`);
      } else {
        message.warning(data.error || `מיקוד ${normalizedZip} לא נמצא`);
      }
    } catch (error: any) {
      console.error('Zip validation error:', error);
      message.error('שגיאה באימות המיקוד');
    } finally {
      setValidatingZip(false);
    }
  };

  return (
    <Card title={<><EnvironmentOutlined /> מיקום הנכס</>} className="mb-4">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="מיקוד" name="zipCode">
            <Input
              placeholder="58102"
              maxLength={7}
              suffix={validatingZip ? <SearchOutlined spin /> : null}
              onBlur={(e) => {
                const zip = e.target.value;
                if (zip) {
                  validateZipCode(zip);
                }
              }}
              onChange={(e) => {
                // Allow only digits, spaces, and dashes
                const value = e.target.value.replace(/[^\d\s-]/g, '');
                e.target.value = value;
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            label="עיר"
            name="city"
            rules={[{ required: true, message: 'עיר היא שדה חובה' }]}
          >
            <Select
              onChange={(value) => handleChange('city', value)}
              options={CITY_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label="שכונה" name="neighborhood">
            <Input
              placeholder="רמת אפעל"
              onChange={(e) => handleChange('neighborhood', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <Form.Item
            label="מיקום תצוגה"
            name="location"
            rules={[{ required: true, message: 'מיקום תצוגה הוא שדה חובה' }]}
          >
            <Input
              placeholder="חולון, רמת אפעל"
              onChange={(e) => handleChange('location', e.target.value)}
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
