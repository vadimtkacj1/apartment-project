'use client';

import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  App,
  InputNumber,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import LocationPicker from '@/components/admin/LocationPicker';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { useAdminMessages } from '@/lib/adminI18n';
import { contactMessages } from '@/lib/adminI18n/messages/contact';

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

const INITIAL_FORM: Omit<ContactInfoForm, 'weekdayHours' | 'fridayHours'> = {
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
  const { message } = App.useApp();
  const t = useAdminMessages(contactMessages);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mapPosition, setMapPosition] = useState<{ lat: number; lng: number } | null>(null);
  // Track unsaved edits so we can warn before the user navigates away / closes the tab.
  const [dirty, setDirty] = useState(false);
  useUnsavedChangesWarning(dirty);

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
      message.error(t.loadError);
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

      const response = await fetch('/api/admin/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        setDirty(false);
        message.success(t.saveSuccess);
        fetchContactInfo();
      } else {
        message.error(t.saveError);
      }
    } catch (err) {
      message.error(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h1 className="text-4xl font-bold" style={{ margin: 0 }}>{t.title}</h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={() => setDirty(true)}
        initialValues={{
          ...INITIAL_FORM,
          weekdayHours: t.weekdayHoursExample,
          fridayHours: t.fridayHoursExample,
        }}
        disabled={loading}
      >
        {/* Contact Details */}
        <Card className="mb-4" title={t.contactCard1}>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label={t.phone1Label}
                name="phone"
                rules={[{ required: true, message: t.phoneRequired }]}
              >
                <Input placeholder="03-1234567" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t.phoneName1Label}
                name="phoneName"
                tooltip={t.phoneName1Tooltip}
              >
                <Input placeholder={t.personPlaceholder1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label={t.email1Label}
                name="email"
                rules={[
                  { required: true, message: t.emailRequired },
                  { type: 'email', message: t.emailInvalid },
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
                tooltip={t.whatsapp1Tooltip}
              >
                <Input placeholder="972501234567" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t.whatsappName1Label}
                name="whatsappName"
                tooltip={t.whatsappNameTooltip}
              >
                <Input placeholder={t.personPlaceholder1} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Second Contact Details */}
        <Card className="mb-4" title={t.contactCard2}>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label={t.phone2Label}
                name="phone2"
              >
                <Input placeholder="03-7654321" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t.phoneName2Label}
                name="phoneName2"
                tooltip={t.phoneName2Tooltip}
              >
                <Input placeholder={t.personPlaceholder2} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label={t.email2Label}
                name="email2"
                rules={[
                  { type: 'email', message: t.emailInvalid },
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
                tooltip={t.whatsapp2Tooltip}
              >
                <Input placeholder="972507654321" />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t.whatsappName2Label}
                name="whatsappName2"
                tooltip={t.whatsappNameTooltip}
              >
                <Input placeholder={t.personPlaceholder2} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Address */}
        <Card className="mb-4" title={t.addressCard}>
          <Row gutter={16}>
            <Col md={16}>
              <Form.Item
                label={t.addressLabel}
                name="address"
                rules={[{ required: true, message: t.addressRequired }]}
              >
                <Input placeholder={t.addressPlaceholder} />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item
                label={t.cityLabel}
                name="city"
                rules={[{ required: true, message: t.cityRequired }]}
              >
                <Input placeholder={t.cityPlaceholder} />
              </Form.Item>
            </Col>
          </Row>

          {/* Map Location Picker */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t.mapLabel}>
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
              <Form.Item label={t.latitudeLabel} name="latitude">
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
              <Form.Item label={t.longitudeLabel} name="longitude">
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
        <Card className="mb-4" title={t.hoursCard}>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label={t.weekdayHoursLabel}
                name="weekdayHours"
                rules={[{ required: true, message: t.hoursRequired }]}
              >
                <Input placeholder={t.weekdayHoursExample} />
              </Form.Item>
            </Col>
            <Col md={12}>
              <Form.Item
                label={t.fridayHoursLabel}
                name="fridayHours"
                rules={[{ required: true, message: t.hoursRequired }]}
              >
                <Input placeholder={t.fridayHoursExample} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Social Media */}
        <Card className="mb-4" title={t.socialCard1}>
          <Row gutter={16}>
            <Col md={8}>
              <Form.Item label="Facebook 1 URL" name="facebook">
                <Input placeholder="https://facebook.com/..." />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label={t.facebookName1Label} name="facebookName">
                <Input placeholder={t.personPlaceholder1} />
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
              <Form.Item label={t.instagramName1Label} name="instagramName">
                <Input placeholder={t.personPlaceholder1} />
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
        <Card className="mb-4" title={t.socialCard2}>
          <Row gutter={16}>
            <Col md={8}>
              <Form.Item label="Facebook 2 URL" name="facebook2">
                <Input placeholder="https://facebook.com/..." />
              </Form.Item>
            </Col>
            <Col md={8}>
              <Form.Item label={t.facebookName2Label} name="facebookName2">
                <Input placeholder={t.personPlaceholder2} />
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
              <Form.Item label={t.instagramName2Label} name="instagramName2">
                <Input placeholder={t.personPlaceholder2} />
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
            {t.saveButton}
          </Button>
        </div>
      </Form>
    </div>
  );
}
