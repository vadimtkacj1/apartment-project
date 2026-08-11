'use client';

import { MapPin } from 'lucide-react';
import { Card } from '@/components/shadcn/card';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/shadcn/select';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyFormSectionProps } from '../types';
import { ISRAELI_CITIES } from '@/data/cities';

export function LocationSection({ formData, handleChange, errors }: PropertyFormSectionProps) {
  const t = useAdminMessages(propertyFormMessages);

  return (
    <Card className="mb-4 p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
        <MapPin className="size-4" />
        {t.location.cardTitle}
      </h3>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div id="field-city">
          <Label className="mb-1.5 block">
            {t.location.cityLabel} <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.city} onValueChange={(v) => handleChange('city', v)}>
            <SelectTrigger>
              <SelectValue placeholder={t.location.cityPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {ISRAELI_CITIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.city && <p className="mt-1 text-sm text-destructive">{errors.city}</p>}
        </div>
        <div className="md:col-span-2">
          <Label className="mb-1.5 block">{t.location.neighborhoodLabel}</Label>
          <Input
            placeholder={t.location.neighborhoodPlaceholder}
            value={formData.neighborhood ?? ''}
            onChange={(e) => handleChange('neighborhood', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1.5 block">{t.location.streetLabel}</Label>
          <Input
            placeholder={t.location.streetPlaceholder}
            value={formData.street ?? ''}
            onChange={(e) => handleChange('street', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-1.5 block">{t.location.houseNumberLabel}</Label>
            <Input
              placeholder="123"
              value={formData.streetNumber ?? ''}
              onChange={(e) => handleChange('streetNumber', e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1.5 block">{t.location.apartmentNumberLabel}</Label>
            <Input
              placeholder="12"
              value={formData.apartmentNumber ?? ''}
              onChange={(e) => handleChange('apartmentNumber', e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
