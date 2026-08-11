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
import { PropertyFormSectionProps, PropertyForm } from '../types';

const FEATURES = [
  { key: 'hasAirConditioning', label: 'מיזוג אוויר', icon: Snowflake },
  { key: 'hasDisabledAccess', label: 'גישה לנכים', icon: Accessibility },
  { key: 'hasSunBalcony', label: 'מרפסת שמש', icon: Waves },
  { key: 'hasStorage', label: 'מחסן', icon: Box },
  { key: 'hasSunroom', label: 'חימום גז', icon: Sun },
  { key: 'hasBoiler', label: 'דוד שמש', icon: Flame },
  { key: 'hasSafeRoom', label: 'ממ״ד', icon: Shield },
  { key: 'hasElevator', label: 'מעלית', icon: ArrowUpDown },
  { key: 'hasMamak', label: 'ממ״ק', icon: ShieldCheck },
  { key: 'hasBars', label: 'סורגים', icon: GripVertical },
  { key: 'hasPets', label: 'חיות מחמד', icon: Dog },
  { key: 'hasHousingUnit', label: 'יחידת דיור', icon: Building2 },
  { key: 'hasShelter', label: 'מקלט בבניין', icon: Home },
];

export function FeaturesSection({ formData, handleChange }: PropertyFormSectionProps) {
  return (
    <Card title="מאפיינים נוספים" className="mb-4">
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
                    {feature.label}
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
