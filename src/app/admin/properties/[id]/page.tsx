'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminFormActions from '@/components/admin/AdminFormActions';
import { usePropertyForm } from './usePropertyForm';
import {
  BasicInfoSection,
  AgentSection,
  LocationSection,
  PropertyDetailsSection,
  FeaturesSection,
  MapSection,
  ImagesSection,
  SeoSection,
} from './sections';

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const t = useAdminMessages(propertyFormMessages);
  const isNew = params.id === 'new';
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    formData,
    loading,
    saving,
    handleChange,
    handleSubmit,
    handleAddressFromMap,
  } = usePropertyForm(params.id, isNew);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!String(formData.title ?? '').trim()) e.title = t.basicInfo.titleRequired;
    if (!String(formData.description ?? '').trim())
      e.description = t.basicInfo.descriptionRequired;
    if (!String(formData.price ?? '').trim()) e.price = t.basicInfo.priceRequired;
    if (!formData.agentIds || formData.agentIds.length === 0)
      e.agentIds = t.agent.required;
    if (!formData.city) e.city = t.location.cityRequired;
    if (!formData.rooms) e.rooms = t.details.roomsRequired;
    if (formData.area === undefined || formData.area === null)
      e.area = t.details.areaRequired;
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const order = ['title', 'description', 'price', 'agentIds', 'city', 'rooms', 'area'];
      const first = order.find((k) => e[k]);
      if (first) {
        document
          .getElementById(`field-${first}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    handleSubmit(() => router.push('/admin/properties'));
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title={
          <span className="inline-flex items-center gap-2">
            <Home className="size-6" />
            {isNew ? t.page.addTitle : t.page.editTitle}
          </span>
        }
        extra={
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => router.push('/admin/properties')}
          >
            {t.page.backToList}
            <ArrowLeft className="size-4" />
          </Button>
        }
      />

      <form onSubmit={onSubmit} noValidate>
        <BasicInfoSection formData={formData} handleChange={handleChange} errors={errors} />
        <AgentSection formData={formData} handleChange={handleChange} errors={errors} />
        <LocationSection formData={formData} handleChange={handleChange} errors={errors} />
        <PropertyDetailsSection formData={formData} handleChange={handleChange} errors={errors} />
        <FeaturesSection formData={formData} handleChange={handleChange} />
        <MapSection
          formData={formData}
          handleChange={handleChange}
          onAddressChange={handleAddressFromMap}
        />
        <ImagesSection formData={formData} handleChange={handleChange} />
        <SeoSection formData={formData} handleChange={handleChange} />

        <AdminFormActions
          saveLabel={t.page.save}
          cancelLabel={t.page.cancel}
          saving={saving}
          submit
          onCancel={() => router.push('/admin/properties')}
        />
      </form>
    </div>
  );
}
