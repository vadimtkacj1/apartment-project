'use client';

import { Card } from '@/components/shadcn/card';
import ImageUploader from '@/components/admin/ImageUploader';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyForm } from '../types';

interface ImagesSectionProps {
  formData: PropertyForm;
  handleChange: (field: keyof PropertyForm, value: any) => void;
}

export function ImagesSection({ formData, handleChange }: ImagesSectionProps) {
  const t = useAdminMessages(propertyFormMessages);
  return (
    <Card className="mb-4 p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">{t.images.cardTitle}</h3>
      <ImageUploader
        images={formData.images}
        onImagesChange={(images) => handleChange('images', images)}
        maxImages={25}
      />
    </Card>
  );
}
