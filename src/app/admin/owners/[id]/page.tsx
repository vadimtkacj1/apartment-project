'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Switch, InputNumber, message, Spin } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import ProfileImageUploader from '@/components/admin/ProfileImageUploader';

const { TextArea } = Input;

interface OwnerForm {
  name: string;
  title: string;
  image: string | null;
  phone: string;
  email: string;
  whatsapp: string;
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
  description: '',
  order: 0,
  isActive: true,
};

export default function OwnerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [formData, setFormData] = useState<OwnerForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

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
      message.error('שגיאה בטעינת הבעלים');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OwnerForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      message.error('שם הוא שדה חובה');
      return false;
    }
    if (!formData.title.trim()) {
      message.error('תפקיד הוא שדה חובה');
      return false;
    }
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      message.error('כתובת אימייל לא תקינה');
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

      message.success(isNew ? 'הבעלים נוצר בהצלחה' : 'הבעלים עודכן בהצלחה');
      router.push('/admin/owners');
    } catch (error) {
      console.error('Error saving owner:', error);
      message.error('שגיאה בשמירת הבעלים');
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
          חזרה לרשימה
        </Button>
        <h1 className="text-4xl font-bold" style={{ margin: 0 }}>
          {isNew ? 'הוסף בעלים חדש' : 'ערוך בעלים'}
        </h1>
      </div>

      {/* Basic Information */}
      <Card title="מידע בסיסי" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              שם <span style={{ color: 'red' }}>*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="הכנס שם"
              size="large"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              תפקיד <span style={{ color: 'red' }}>*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder='לדוגמה: מייסד ומתווך נדל"ן'
              size="large"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              תיאור
            </label>
            <TextArea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="הכנס תיאור"
              rows={4}
              size="large"
            />
          </div>
        </div>
      </Card>

      {/* Profile Photo */}
      <Card title="תמונת פרופיל" style={{ marginBottom: '24px' }}>
        <ProfileImageUploader
          image={formData.image}
          onImageChange={(image) => handleChange('image', image)}
          uploadPath="owners"
        />
      </Card>

      {/* Contact Information */}
      <Card title="פרטי התקשרות" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              טלפון
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
              אימייל
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
      <Card title="הגדרות תצוגה" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              סדר תצוגה
            </label>
            <InputNumber
              value={formData.order}
              onChange={(value) => handleChange('order', value || 0)}
              min={0}
              size="large"
              style={{ width: '100%' }}
            />
            <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '4px' }}>
              מספר נמוך יותר = מופיע ראשון
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              סטטוס
            </label>
            <Switch
              checked={formData.isActive}
              onChange={(value) => handleChange('isActive', value)}
              checkedChildren="פעיל"
              unCheckedChildren="לא פעיל"
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
          ביטול
        </Button>
        <Button type="primary" size="large" loading={saving} onClick={handleSave}>
          שמור
        </Button>
      </div>
    </div>
  );
}
