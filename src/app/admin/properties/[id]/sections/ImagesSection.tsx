import { Card } from 'antd';
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
    <Card title={t.images.cardTitle} className="mb-4">
      <ImageUploader
        images={formData.images}
        onImagesChange={(images) => handleChange('images', images)}
        maxImages={25}
      />
    </Card>
  );
}
