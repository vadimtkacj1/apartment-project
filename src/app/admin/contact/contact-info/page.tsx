'use client';

import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
  Typography,
  InputNumber,
} from 'antd';
import { SaveOutlined, PhoneOutlined } from '@ant-design/icons';
import LocationPicker from '@/components/admin/LocationPicker';

const { Title } = Typography;

interface ContactInfoForm {
  phone: string;
  email: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  weekdayHours: string;
  fridayHours: string;
  facebook: string;
  instagram: string;
  linkedin: string;
}

const INITIAL_FORM: ContactInfoForm = {
  phone: '',
  email: '',
  address: '',
  city: '',
  latitude: null,
  longitude: null,
  weekdayHours: 'ראשון - חמישי: 9:00 - 18:00',
  fridayHours: 'שישי: 9:00 - 13:00',
  facebook: '',
  instagram: '',
  linkedin: '',
};

export default function ContactInfoPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact-info');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          form.setFieldsValue(data);
          // Update map position if coordinates exist
          if (data.latitude && data.longitude) {
            setMapPosition({ lat: data.latitude, lng: data.longitude });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
      message.error('שגיאה בטעינת פרטי ההתקשרות');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ContactInfoForm) => {
    setSaving(true);

    try {
      // Auto-generate links
      const phoneNumber = values.phone.replace(/\D/g, '');
      const phoneLink = `tel:${phoneNumber}`;
      const emailLink = `mailto:${values.email}`;
      const mapUrl = values.latitude && values.longitude
        ? `https://www.google.com/maps?q=${values.latitude},${values.longitude}`
        : '';

      // Combine form data with auto-generated fields
      const dataToSave = {
        ...values,
        phoneLink,
        emailLink,
        mapUrl,
      };

      const response = await fetch('/api/admin/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        message.success('פרטי ההתקשרות נשמרו בהצלחה');
        fetchContactInfo();
      } else {
        message.error('שגיאה בשמירת פרטי ההתקשרות');
      }
    } catch (err) {
      message.error('שגיאה בשמירת פרטי ההתקשרות');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <PhoneOutlined style={{ fontSize: '24px', marginLeft: '12px' }} />
        <Title level={2} style={{ margin: 0 }}>
          ניהול פרטי התקשרות
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={INITIAL_FORM}
        disabled={loading}
      >
        {/* Contact Details */}
        <Card className="mb-4" title="פרטי יצירת קשר">
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label="טלפון"
                name="phone"
                rules={[{ required: true, message: 'אנא הכנס מספר טלפון' }]}
              >
                <Input placeholder="03-1234567" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="אימייל"
                name="email"
                rules={[
                  { required: true, message: 'אנא הכנס אימייל' },
                  { type: 'email', message: 'אנא הכנס אימייל תקין' },
                ]}
              >
                <Input type="email" placeholder="info@example.com" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Address */}
        <Card className="mb-4" title="כתובת ומיקום">
          <Row gutter={16}>
            <Col md={16}>
              <Form.Item
                label="כתובת"
                name="address"
                rules={[{ required: true, message: 'אנא הכנס כתובת' }]}
              >
                <Input placeholder="רחוב 123" />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label="עיר"
                name="city"
                rules={[{ required: true, message: 'אנא הכנס עיר' }]}
              >
                <Input placeholder="תל אביב" />
              </Form.Item>
            </Col>
          </Row>

          {/* Map Location Picker */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="מיקום על המפה (לחץ על המפה לבחירה)">
                <LocationPicker
                  position={mapPosition}
                  onPositionChange={(coords: { lat: number; lng: number }) => {
                    setMapPosition(coords);
                    form.setFieldsValue({
                      latitude: coords.lat,
                      longitude: coords.lng,
                    });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Coordinates Display */}
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item label="קו רוחב (Latitude)" name="latitude">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="32.0853"
                  step={0.000001}
                  precision={6}
                  onChange={(value) => {
                    if (typeof value === 'number' && form.getFieldValue('longitude')) {
                      setMapPosition({ lat: value, lng: form.getFieldValue('longitude') });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item label="קו אורך (Longitude)" name="longitude">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="34.7818"
                  step={0.000001}
                  precision={6}
                  onChange={(value) => {
                    const lat = form.getFieldValue('latitude');
                    if (typeof value === 'number' && typeof lat === 'number') {
                      setMapPosition({ lat: lat, lng: value });
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Working Hours */}
        <Card className="mb-4" title="שעות פעילות">
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label="ימים א׳-ה׳"
                name="weekdayHours"
                rules={[{ required: true, message: 'אנא הכנס שעות פעילות' }]}
              >
                <Input placeholder="ראשון - חמישי: 9:00 - 18:00" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="יום שישי"
                name="fridayHours"
                rules={[{ required: true, message: 'אנא הכנס שעות פעילות' }]}
              >
                <Input placeholder="שישי: 9:00 - 13:00" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Social Media */}
        <Card className="mb-4" title="רשתות חברתיות">
          <Row gutter={16}>
            <Col md={8}>
              <Form.Item label="Facebook" name="facebook">
                <Input placeholder="https://facebook.com/..." />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="Instagram" name="instagram">
                <Input placeholder="https://instagram.com/..." />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="LinkedIn" name="linkedin">
                <Input placeholder="https://linkedin.com/..." />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={saving}
            icon={<SaveOutlined />}
          >
            שמור שינויים
          </Button>
        </div>
      </Form>
    </div>
  );
}
