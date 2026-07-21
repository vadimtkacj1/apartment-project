'use client';

import { Card } from '@/components/shadcn/card';
import { Checkbox } from '@/components/shadcn/checkbox';
import {
  Snowflake,
  Accessibility,
  Sun,
  Box,
  Flame,
  Shield,
  ArrowUpDown,
  Waves,
  ShieldCheck,
  GripVertical,
  Dog,
  Building2,
  Home,
} from 'lucide-react';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyFormSectionProps, PropertyForm } from '../types';

// Locale-neutral definitions; display labels live in propertyFormMessages.features.items.
const FEATURES = [
  { key: 'hasAirConditioning', labelKey: 'airConditioning', icon: Snowflake },
  { key: 'hasDisabledAccess', labelKey: 'disabledAccess', icon: Accessibility },
  { key: 'hasSunBalcony', labelKey: 'sunBalcony', icon: Waves },
  { key: 'hasStorage', labelKey: 'storage', icon: Box },
  { key: 'hasSunroom', labelKey: 'gasHeating', icon: Sun },
  { key: 'hasBoiler', labelKey: 'solarBoiler', icon: Flame },
  { key: 'hasSafeRoom', labelKey: 'safeRoom', icon: Shield },
  { key: 'hasElevator', labelKey: 'elevator', icon: ArrowUpDown },
  { key: 'hasMamak', labelKey: 'mamak', icon: ShieldCheck },
  { key: 'hasBars', labelKey: 'bars', icon: GripVertical },
  { key: 'hasPets', labelKey: 'pets', icon: Dog },
  { key: 'hasHousingUnit', labelKey: 'housingUnit', icon: Building2 },
  { key: 'hasShelter', labelKey: 'shelter', icon: Home },
] as const;

export function FeaturesSection({ formData, handleChange }: PropertyFormSectionProps) {
  const t = useAdminMessages(propertyFormMessages);
  return (
    <Card className="mb-4 p-5">
      <h3 className="mb-4 text-base font-semibold text-foreground">{t.features.cardTitle}</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {FEATURES.map((feature) => {
          const IconComponent = feature.icon;
          const key = feature.key as keyof PropertyForm;
          return (
            <label
              key={feature.key}
              className="flex min-h-11 cursor-pointer items-center gap-2"
            >
              <Checkbox
                checked={Boolean(formData[key])}
                onCheckedChange={(c) => handleChange(key, c === true)}
              />
              <span className="flex items-center gap-2 text-sm">
                <IconComponent size={16} />
                {t.features.items[feature.labelKey]}
              </span>
            </label>
          );
        })}
      </div>
    </Card>
  );
}
