import { Card, Row, Col, Form, Checkbox } from 'antd';
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
    <Card title={t.features.cardTitle} className="mb-4">
      <Row gutter={[16, 16]}>
        {FEATURES.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Col xs={12} sm={8} md={6} key={feature.key}>
              <Form.Item name={feature.key} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox
                  onChange={(e) =>
                    handleChange(feature.key as keyof PropertyForm, e.target.checked)
                  }
                  style={{ display: 'flex', alignItems: 'center', minHeight: 44 }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <IconComponent size={16} />
                    {t.features.items[feature.labelKey]}
                  </span>
                </Checkbox>
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
}
