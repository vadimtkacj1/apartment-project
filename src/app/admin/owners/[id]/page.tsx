'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from '@/components/shadcn/sonner';
import { Card } from '@/components/shadcn/card';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Switch } from '@/components/shadcn/switch';
import { Label } from '@/components/shadcn/label';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import ProfileImageUploader from '@/components/admin/ProfileImageUploader';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminFormActions from '@/components/admin/AdminFormActions';
import { useAdminMessages } from '@/lib/adminI18n';
import { ownersMessages } from '@/lib/adminI18n/messages/owners';

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
  name: '', title: '', image: null, phone: '', email: '', whatsapp: '',
  licenceNumber: '', description: '', order: 0, isActive: true,
};

function FormCard({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card className="mb-6 p-6">
      <div className="mb-4 text-base font-bold tracking-tight text-[#051150]">{title}</div>
      <div className="flex flex-col gap-4">{children}</div>
    </Card>
  );
}

export default function OwnerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const t = useAdminMessages(ownersMessages);
  const [formData, setFormData] = useState<OwnerForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    if (!isNew) fetchOwner();
  }, [id, isNew]);

  const fetchOwner = async () => {
    try {
      const response = await fetch(`/api/admin/owners/${id}`);
      if (!response.ok) throw new Error('Failed to fetch owner');
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching owner:', error);
      toast.error(t.loadOneError);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    const limited = digits.slice(0, 10);
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)}-${limited.slice(3)}`;
    return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
  };

  const handleChange = (field: keyof OwnerForm, value: any) => {
    setDirty(true);
    if (field === 'phone' || field === 'whatsapp') value = formatPhoneNumber(value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) { toast.error(t.nameRequired); return false; }
    if (!formData.title.trim()) { toast.error(t.roleRequired); return false; }
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { toast.error(t.emailInvalid); return false; }
    const phoneRegex = /^0\d{1,2}-\d{3}-\d{4}$/;
    if (formData.phone && formData.phone.trim() && !phoneRegex.test(formData.phone)) { toast.error(t.phoneInvalid); return false; }
    if (formData.whatsapp && formData.whatsapp.trim() && !phoneRegex.test(formData.whatsapp)) { toast.error(t.whatsappInvalid); return false; }
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
      if (!response.ok) throw new Error('Failed to save owner');
      setDirty(false);
      toast.success(isNew ? t.createSuccess : t.updateSuccess);
      router.push('/admin/owners');
    } catch (error) {
      console.error('Error saving owner:', error);
      toast.error(t.saveError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader2 className="size-8 animate-spin text-[#354AC4]" />
      </div>
    );
  }

  return (
    <div>
      <Button variant="outline" onClick={() => router.push('/admin/owners')} className="mb-4">
        <ArrowRight className="size-4" />{t.backToList}
      </Button>
      <AdminPageHeader title={isNew ? t.addNew : t.editTitle} />

      <FormCard title={t.basicInfoCard}>
        <div>
          <Label className="mb-2 block">{t.fieldName} <span className="text-destructive">*</span></Label>
          <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder={t.namePlaceholder} />
        </div>
        <div>
          <Label className="mb-2 block">{t.fieldRole} <span className="text-destructive">*</span></Label>
          <Input value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder={t.rolePlaceholder} />
        </div>
        <div>
          <Label className="mb-2 block">{t.licenceNumberLabel}</Label>
          <Input value={formData.licenceNumber} onChange={(e) => handleChange('licenceNumber', e.target.value)} placeholder={t.licencePlaceholder} />
        </div>
        <div>
          <Label className="mb-2 block">{t.descriptionLabel}</Label>
          <Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder={t.descriptionPlaceholder} rows={4} />
        </div>
      </FormCard>

      <FormCard title={t.profilePhotoCard}>
        <ProfileImageUploader
          image={formData.image}
          onImageChange={(image) => handleChange('image', image)}
          uploadPath="owners"
        />
      </FormCard>

      <FormCard title={t.contactInfoCard}>
        <div>
          <Label className="mb-2 block">{t.fieldPhone}</Label>
          <Input value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="050-123-4567" />
        </div>
        <div>
          <Label className="mb-2 block">{t.fieldEmail}</Label>
          <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="example@example.com" />
        </div>
        <div>
          <Label className="mb-2 block">WhatsApp</Label>
          <Input value={formData.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} placeholder="050-123-4567" />
        </div>
      </FormCard>

      <FormCard title={t.displaySettingsCard}>
        <div>
          <Label className="mb-2 block">{t.displayOrderLabel}</Label>
          <Input
            type="number"
            min={0}
            value={formData.order}
            onChange={(e) => handleChange('order', parseInt(e.target.value, 10) || 0)}
            className="w-full"
          />
          <div className="mt-1 text-xs text-slate-500">{t.orderHint}</div>
        </div>
        <div>
          <Label className="mb-2 block">{t.fieldStatus}</Label>
          <Switch checked={formData.isActive} onCheckedChange={(value) => handleChange('isActive', value)} />
        </div>
      </FormCard>

      <AdminFormActions
        saveLabel={t.save}
        cancelLabel={t.cancel}
        saving={saving}
        onSave={handleSave}
        onCancel={() => router.push('/admin/owners')}
      />
    </div>
  );
}
