'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { toast } from '@/components/shadcn/sonner';
import { Card, CardTitle } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Switch } from '@/components/shadcn/switch';
import ProfileImageUploader from '@/components/admin/ProfileImageUploader';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminFormActions from '@/components/admin/AdminFormActions';
import { useAdminMessages } from '@/lib/adminI18n';
import { teamMessages } from '@/lib/adminI18n/messages/team';

interface TeamMemberForm {
  name: string;
  role: string;
  image: string | null;
  phone: string;
  mobile: string;
  whatsapp: string;
  fax: string;
  email: string;
  licenceNumber: string;
  description: string;
  order: number;
  isActive: boolean;
}

const INITIAL_FORM: TeamMemberForm = {
  name: '',
  role: '',
  image: null,
  phone: '',
  mobile: '',
  whatsapp: '',
  fax: '',
  email: '',
  licenceNumber: '',
  description: '',
  order: 0,
  isActive: true,
};

export default function TeamMemberEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const t = useAdminMessages(teamMessages);
  const [formData, setFormData] = useState<TeamMemberForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  // Warn before leaving with unsaved edits.
  const [dirty, setDirty] = useState(false);
  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    if (!isNew) {
      fetchTeamMember();
    }
  }, [id, isNew]);

  const fetchTeamMember = async () => {
    try {
      const response = await fetch(`/api/admin/team/${id}`);
      if (!response.ok) throw new Error('Failed to fetch team member');
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching team member:', error);
      toast.error(t.loadOneError);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string): string => {
    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, '');

    // Ограничиваем максимум 10 цифр для мобильных (05X-XXX-XXXX)
    const limited = digits.slice(0, 10);

    // Форматируем номер
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    } else {
      return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
    }
  };

  const handleChange = (field: keyof TeamMemberForm, value: any) => {
    setDirty(true);
    // Форматируем телефонные номера автоматически
    if (field === 'phone' || field === 'mobile' || field === 'whatsapp' || field === 'fax') {
      value = formatPhoneNumber(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error(t.nameRequired);
      return false;
    }
    if (!formData.role.trim()) {
      toast.error(t.roleRequired);
      return false;
    }
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error(t.emailInvalid);
      return false;
    }
    // Проверка формата телефона (опционально)
    const phoneRegex = /^0\d{1,2}-\d{3}-\d{4}$/;
    if (formData.phone && formData.phone.trim() && !phoneRegex.test(formData.phone)) {
      toast.error(t.phoneInvalid);
      return false;
    }
    if (formData.mobile && formData.mobile.trim() && !phoneRegex.test(formData.mobile)) {
      toast.error(t.mobileInvalid);
      return false;
    }
    if (formData.whatsapp && formData.whatsapp.trim() && !phoneRegex.test(formData.whatsapp)) {
      toast.error(t.whatsappInvalid);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const url = isNew ? '/api/admin/team' : `/api/admin/team/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save team member');
      }

      setDirty(false);
      toast.success(isNew ? t.createSuccess : t.updateSuccess);
      router.push('/admin/team');
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Button
          variant="outline"
          onClick={() => router.push('/admin/team')}
          style={{ marginBottom: '16px' }}
        >
          <ArrowRight className="size-4" />
          {t.backToList}
        </Button>
        <AdminPageHeader title={isNew ? t.addNew : t.editTitle} style={{ marginBottom: 0 }} />
      </div>

      {/* Basic Information */}
      <Card className="p-6" style={{ marginBottom: '24px' }}>
        <CardTitle className="mb-4">{t.basicInfoCard}</CardTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldName} <span style={{ color: '#C0392B' }}>*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t.namePlaceholder}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldRole} <span style={{ color: '#C0392B' }}>*</span>
            </label>
            <Input
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              placeholder={t.rolePlaceholder}
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
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.descriptionLabel}
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t.descriptionPlaceholder}
              rows={4}
            />
          </div>
        </div>
      </Card>

      {/* Profile Photo */}
      <Card className="p-6" style={{ marginBottom: '24px' }}>
        <CardTitle className="mb-4">{t.profilePhotoCard}</CardTitle>
        <ProfileImageUploader
          image={formData.image}
          onImageChange={(image) => handleChange('image', image)}
          uploadPath="team"
        />
      </Card>

      {/* Contact Information */}
      <Card className="p-6" style={{ marginBottom: '24px' }}>
        <CardTitle className="mb-4">{t.contactInfoCard}</CardTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldPhone}
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="050-123-4567"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldMobile}
            </label>
            <Input
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              placeholder="052-123-4567"
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
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.faxLabel}
            </label>
            <Input
              value={formData.fax}
              onChange={(e) => handleChange('fax', e.target.value)}
              placeholder="03-123-4567"
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
            />
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="p-6" style={{ marginBottom: '24px' }}>
        <CardTitle className="mb-4">{t.displaySettingsCard}</CardTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.displayOrderLabel}
            </label>
            <Input
              type="number"
              min={0}
              value={formData.order}
              onChange={(e) => handleChange('order', e.target.value === '' ? 0 : Number(e.target.value))}
            />
            <div style={{ color: '#64748B', fontSize: '12px', marginTop: '4px' }}>
              {t.orderHint}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {t.fieldStatus}
            </label>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(value) => handleChange('isActive', value)}
              />
              <span className="text-sm text-muted-foreground">
                {formData.isActive ? t.statusActive : t.statusInactive}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <AdminFormActions
        saveLabel={t.save}
        cancelLabel={t.cancel}
        saving={saving}
        onSave={handleSave}
        onCancel={() => router.push('/admin/team')}
      />
    </div>
  );
}
