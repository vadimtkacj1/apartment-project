import { Card, Row, Col, Form, Input } from 'antd';
import { PropertyFormSectionProps } from '../types';

const { TextArea } = Input;

export function SeoSection({ handleChange }: PropertyFormSectionProps) {
  return (
    <Card title="SEO — קידום במנועי חיפוש (אופציונלי)" className="mb-4">
      <p style={{ color: '#8c8c8c', marginTop: 0, marginBottom: 16 }}>
        השאר ריק כדי להשתמש בכותרת, בתיאור ובתמונה הראשית של הנכס כברירת מחדל.
      </p>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="כותרת SEO (Meta Title)"
            name="metaTitle"
            tooltip="עד ~60 תווים — מוצג בלשונית הדפדפן ובתוצאות גוגל"
          >
            <Input
              maxLength={70}
              showCount
              placeholder="לדוגמה: דירת 4 חדרים למכירה בחולון — רם נכסים"
              onChange={(e) => handleChange('metaTitle', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="תיאור SEO (Meta Description)"
            name="metaDescription"
            tooltip="עד ~160 תווים — הסניפט שמופיע מתחת לכותרת בגוגל"
          >
            <TextArea
              rows={3}
              maxLength={170}
              showCount
              placeholder="תיאור קצר ומושך שיופיע בתוצאות החיפוש..."
              onChange={(e) => handleChange('metaDescription', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="תמונת שיתוף (OG Image)"
            name="ogImage"
            tooltip="כתובת תמונה לשיתוף ברשתות חברתיות; ריק = התמונה הראשית של הנכס"
          >
            <Input
              placeholder="/uploads/... או https://..."
              onChange={(e) => handleChange('ogImage', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
