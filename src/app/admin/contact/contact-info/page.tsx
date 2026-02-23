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
  phoneName?: string;
  phone2?: string;
  phoneName2?: string;
  email: string;
  email2?: string;
  whatsapp?: string;
  whatsappName?: string;
  whatsapp2?: string;
  whatsappName2?: string;
  address: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  weekdayHours: string;
  fridayHours: string;
  facebook: string;
  facebookName?: string;
  facebook2?: string;
  facebookName2?: string;
  instagram: string;
  instagramName?: string;
  instagram2?: string;
  instagramName2?: string;
  linkedin: string;
}

const INITIAL_FORM: ContactInfoForm = {
  phone: '',
  phoneName: '',
  phone2: '',
  phoneName2: '',
  email: '',
  email2: '',
  whatsapp: '',
  whatsappName: '',
  whatsapp2: '',
  whatsappName2: '',
  address: '',
  city: '',
  latitude: null,
  longitude: null,
  weekdayHours: 'ראשון - חמישי: 9:00 - 18:00',
  fridayHours: 'שישי: 9:00 - 13:00',
  facebook: '',
  facebookName: '',
  facebook2: '',
  facebookName2: '',
  instagram: '',
  instagramName: '',
  instagram2: '',
  instagramName2: '',
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
      const phone2Number = values.phone2 ? values.phone2.replace(/\D/g, '') : '';
      const phoneLink2 = phone2Number ? `tel:${phone2Number}` : '';
      const emailLink = `mailto:${values.email}`;
      const emailLink2 = values.email2 ? `mailto:${values.email2}` : '';
      const mapUrl = values.latitude && values.longitude
        ? `https://www.google.com/maps?q=${values.latitude},${values.longitude}`
        : '';

      // Combine form data with auto-generated fields
      const dataToSave = {
        ...values,
        phoneLink,
        phoneLink2,
        emailLink,
        emailLink2,
        mapUrl,
      };

      // Log coordinates before saving to debug
      console.log('Saving contact info with coordinates:', {
        latitude: values.latitude,
        longitude: values.longitude,
        mapPosition: mapPosition
      });

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
        <Card className="mb-4" title="פרטי יצירת קשר - מספר 1">
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label="טלפון 1"
                name="phone"
                rules={[{ required: true, message: 'אנא הכנס מספר טלפון' }]}
              >
                <Input placeholder="03-1234567" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="שם לטלפון 1"
                name="phoneName"
                tooltip="שם שיופיע בחלון הבחירה (לדוגמה: 'יוסי כהן')"
              >
                <Input placeholder="יוסי כהן" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label="אימייל 1"
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
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label="WhatsApp 1"
                name="whatsapp"
                tooltip="מספר WhatsApp בפורמט בינלאומי (לדוגמה: 972501234567)"
              >
                <Input placeholder="972501234567" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="שם ל-WhatsApp 1"
                name="whatsappName"
                tooltip="שם שיופיע בחלון הבחירה"
              >
                <Input placeholder="יוסי כהן" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Second Contact Details */}
        <Card className="mb-4" title="פרטי יצירת קשר - מספר 2 (אופציונלי)">
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label="טלפון 2"
                name="phone2"
              >
                <Input placeholder="03-7654321" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="שם לטלפון 2"
                name="phoneName2"
                tooltip="שם שיופיע בחלון הבחירה (לדוגמה: 'דוד לוי')"
              >
                <Input placeholder="דוד לוי" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label="אימייל 2"
                name="email2"
                rules={[
                  { type: 'email', message: 'אנא הכנס אימייל תקין' },
                ]}
              >
                <Input type="email" placeholder="info2@example.com" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label="WhatsApp 2"
                name="whatsapp2"
                tooltip="מספר WhatsApp בפורמט בינלאומי (לדוגמה: 972507654321)"
              >
                <Input placeholder="972507654321" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label="שם ל-WhatsApp 2"
                name="whatsappName2"
                tooltip="שם שיופיע בחלון הבחירה"
              >
                <Input placeholder="דוד לוי" />
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
        <Card className="mb-4" title="רשתות חברתיות - מספר 1">
          <Row gutter={16}>
            <Col md={8}>
              <Form.Item label="Facebook 1 URL" name="facebook">
                <Input placeholder="https://facebook.com/..." />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="שם Facebook 1" name="facebookName">
                <Input placeholder="יוסי כהן" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={8}>
              <Form.Item label="Instagram 1 URL" name="instagram">
                <Input placeholder="https://instagram.com/..." />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="שם Instagram 1" name="instagramName">
                <Input placeholder="יוסי כהן" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={8}>
              <Form.Item label="LinkedIn" name="linkedin">
                <Input placeholder="https://linkedin.com/..." />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Second Social Media */}
        <Card className="mb-4" title="רשתות חברתיות - מספר 2 (אופציונלי)">
          <Row gutter={16}>
            <Col md={8}>
              <Form.Item label="Facebook 2 URL" name="facebook2">
                <Input placeholder="https://facebook.com/..." />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="שם Facebook 2" name="facebookName2">
                <Input placeholder="דוד לוי" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={8}>
              <Form.Item label="Instagram 2 URL" name="instagram2">
                <Input placeholder="https://instagram.com/..." />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label="שם Instagram 2" name="instagramName2">
                <Input placeholder="דוד לוי" />
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
