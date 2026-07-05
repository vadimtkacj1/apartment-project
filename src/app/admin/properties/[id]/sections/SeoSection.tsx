import { Card, Row, Col, Form, Input } from 'antd';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyFormSectionProps } from '../types';

const { TextArea } = Input;

export function SeoSection({ handleChange }: PropertyFormSectionProps) {
  const t = useAdminMessages(propertyFormMessages);
  return (
    <Card title={t.seo.cardTitle} className="mb-4">
      <p style={{ color: '#8c8c8c', marginTop: 0, marginBottom: 16 }}>
        {t.seo.helpText}
      </p>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={t.seo.metaTitleLabel}
            name="metaTitle"
            tooltip={t.seo.metaTitleTooltip}
          >
            <Input
              maxLength={70}
              showCount
              placeholder={t.seo.metaTitlePlaceholder}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={t.seo.metaDescriptionLabel}
            name="metaDescription"
            tooltip={t.seo.metaDescriptionTooltip}
          >
            <TextArea
              rows={3}
              maxLength={170}
              showCount
              placeholder={t.seo.metaDescriptionPlaceholder}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label={t.seo.ogImageLabel}
            name="ogImage"
            tooltip={t.seo.ogImageTooltip}
          >
            <Input
              placeholder={t.seo.ogImagePlaceholder}
              onChange={(e) => handleChange('ogImage', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
