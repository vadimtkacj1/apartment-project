'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Switch, InputNumber, App, Spin } from 'antd';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import ProfileImageUploader from '@/components/admin/ProfileImageUploader';
import { useAdminMessages } from '@/lib/adminI18n';
import { ownersMessages } from '@/lib/adminI18n/messages/owners';

const { TextArea } = Input;

interface OwnerForm {
  name: string;
  title: string;
  image: string | null;
  phone: string;
  email: string;
  whatsapp: string;
  licenceNumber: string;
  description: string;
  order: number;
  isActive: boolean;
}

const INITIAL_FORM: OwnerForm = {
  name: '',
  title: '',
  image: null,
  phone: '',
  email: '',
  whatsapp: '',
  licenceNumber: '',
  description: '',
  order: 0,
  isActive: true,
};

export default function OwnerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const { message } = App.useApp();
  const t = useAdminMessages(ownersMessages);
  const [formData, setFormData] = useState<OwnerForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  // Warn before leaving with unsaved edits.
  const [dirty, setDirty] = useState(false);
  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    if (!isNew) {
      fetchOwner();
    }
  }, [id, isNew]);

  const fetchOwner = async () => {
    try {
      const response = await fetch(`/api/admin/owners/${id}`);
      if (!response.ok) throw new Error('Failed to fetch owner');
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching owner:', error);
      message.error(t.loadOneError);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');

    const limited = digits.slice(0, 10);

    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  };

  const handleChange = (field: keyof OwnerForm, value: any) => {
    setDirty(true);
    if (field === 'phone' || field === 'whatsapp') {
      value = formatPhoneNumber(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      message.error(t.nameRequired);
      return false;
    }
    if (!formData.title.trim()) {
      message.error(t.roleRequired);
      return false;
    }
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      message.error(t.emailInvalid);
      return false;
    }
    // Проверка формата телефона (опционально)
    const phoneRegex = /^0\d{1,2}-\d{3}-\d{4}$/;
    if (formData.phone && formData.phone.trim() && !phoneRegex.test(formData.phone)) {
      message.error(t.phoneInvalid);
      return false;
    }
    if (formData.whatsapp && formData.whatsapp.trim() && !phoneRegex.test(formData.whatsapp)) {
      message.error(t.whatsappInvalid);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const url = isNew ? '/api/admin/owners' : `/api/admin/owners/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save owner');
      }

      setDirty(false);
      message.success(isNew ? t.createSuccess : t.updateSuccess);
      router.push('/admin/owners');
    } catch (error) {
      console.error('Error saving owner:', error);
      message.error(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 md:px-0">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowRightOutlined />}
          onClick={() => router.push('/admin/owners')}
          style={{ marginBottom: '16px' }}
        >
          {t.backToList}
        </Button>
        <h1 className="text-4xl font-bold" style={{ margin: 0 }}>
          {isNew ? t.addNew : t.editTitle}
        </h1>
      </div>

      {/* Basic Information */}
      <Card title={t.basicInfoCard} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldName} <span style={{ color: 'red' }}>*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t.namePlaceholder}
              size="large"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldRole} <span style={{ color: 'red' }}>*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={t.rolePlaceholder}
              size="large"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.licenceNumberLabel}
            </label>
            <Input
              value={formData.licenceNumber}
              onChange={(e) => handleChange('licenceNumber', e.target.value)}
              placeholder={t.licencePlaceholder}
              size="large"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.descriptionLabel}
            </label>
            <TextArea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t.descriptionPlaceholder}
              rows={4}
              size="large"
            />
          </div>
        </div>
      </Card>

      {/* Profile Photo */}
      <Card title={t.profilePhotoCard} style={{ marginBottom: '24px' }}>
        <ProfileImageUploader
          image={formData.image}
          onImageChange={(image) => handleChange('image', image)}
          uploadPath="owners"
        />
      </Card>

      {/* Contact Information */}
      <Card title={t.contactInfoCard} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldPhone}
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="050-123-4567"
              size="large"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldEmail}
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="example@example.com"
              size="large"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              WhatsApp
            </label>
            <Input
              value={formData.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="050-123-4567"
              size="large"
            />
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card title={t.displaySettingsCard} style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.displayOrderLabel}
            </label>
            <InputNumber
              value={formData.order}
              onChange={(value) => handleChange('order', value || 0)}
              min={0}
              size="large"
              style={{ width: '100%' }}
            />
            <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '4px' }}>
              {t.orderHint}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldStatus}
            </label>
            <Switch
              checked={formData.isActive}
              onChange={(value) => handleChange('isActive', value)}
              checkedChildren={t.statusActive}
              unCheckedChildren={t.statusInactive}
            />
          </div>
        </div>
      </Card>

      {/* Sticky Footer */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: '#fff',
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          zIndex: 10,
        }}
      >
        <Button size="large" onClick={() => router.push('/admin/owners')}>
          {t.cancel}
        </Button>
        <Button type="primary" size="large" loading={saving} onClick={handleSave}>
          {t.save}
        </Button>
      </div>
    </div>
  );
}
