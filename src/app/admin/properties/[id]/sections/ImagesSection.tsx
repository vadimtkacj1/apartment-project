import { Card } from 'antd';
import ImageUploader from '@/components/admin/ImageUploader';
import { PropertyForm } from '../types';

interface ImagesSectionProps {
  formData: PropertyForm;
  handleChange: (field: keyof PropertyForm, value: any) => void;
}

export function ImagesSection({ formData, handleChange }: ImagesSectionProps) {
  return (
    <Card title="ניהול תמונות" className="mb-4">
      <ImageUploader
        images={formData.images}
        onImagesChange={(images) => handleChange('images', images)}
        maxImages={10}
      />
    </Card>
  );
}
