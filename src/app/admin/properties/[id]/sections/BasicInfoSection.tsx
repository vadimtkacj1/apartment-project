import { Card, Row, Col, Form, Input, Select, Switch, DatePicker, Radio } from 'antd';
import { PropertyFormSectionProps } from '../types';
import { DEAL_TYPE_OPTIONS, STATUS_OPTIONS } from '../constants';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

const { TextArea } = Input;

export function BasicInfoSection({ formData, handleChange }: PropertyFormSectionProps) {
  const [vacancyType, setVacancyType] = useState<'date' | 'immediately' | 'flexible'>('date');

  // Sync vacancyType with formData
  useEffect(() => {
    if (formData.vacancyDate === 'מיד' || formData.vacancyDate === 'immediately') {
      setVacancyType('immediately');
    } else if (formData.vacancyDate === 'גמיש' || formData.vacancyDate === 'flexible') {
      setVacancyType('flexible');
    } else if (formData.vacancyDate && typeof formData.vacancyDate === 'string' && formData.vacancyDate.trim() !== '') {
      setVacancyType('date');
    } else if (formData.vacancyDate && typeof formData.vacancyDate === 'object') {
      setVacancyType('date');
    }
  }, [formData.vacancyDate]);

  return (
    <Card title="מידע בסיסי" className="mb-4">
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <Form.Item
            label="כותרת"
            name="title"
            rules={[{ required: true, message: 'כותרת היא שדה חובה' }]}
          >
            <Input
              placeholder="לדוגמה: דירת 3 חדרים מרווחת ברמת אפעל"
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Form.Item label="סוג עסקה" name="dealType">
            <Select
              onChange={(value) => handleChange('dealType', value)}
              options={DEAL_TYPE_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Form.Item label="סטטוס" name="status">
            <Select
              onChange={(value) => handleChange('status', value)}
              options={STATUS_OPTIONS}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="תיאור"
            name="description"
            rules={[{ required: true, message: 'תיאור הוא שדה חובה' }]}
          >
            <TextArea
              rows={6}
              placeholder="תאר את הנכס בפירוט..."
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            label="מחיר"
            name="price"
            rules={[{ required: true, message: 'מחיר הוא שדה חובה' }]}
          >
            <Input
              placeholder="1,200,000"
              suffix="₪"
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label="מחיר מקורי (אופציונלי)" name="originalPrice">
            <Input
              placeholder="1,500,000"
              suffix="₪"
              onChange={(e) => handleChange('originalPrice', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Form.Item label="תאריך פינוי" name="vacancyDate">
            <div>
              <Radio.Group
                className="vacancy-type-segmented"
                optionType="button"
                buttonStyle="solid"
                value={vacancyType}
                onChange={(e) => {
                  const newType = e.target.value;
                  setVacancyType(newType);
                  if (newType === 'immediately') {
                    handleChange('vacancyDate', 'מיד');
                  } else if (newType === 'flexible') {
                    handleChange('vacancyDate', 'גמיש');
                  } else {
                    handleChange('vacancyDate', '');
                  }
                }}
                style={{ marginBottom: '8px', display: 'flex', width: '100%' }}
                options={[
                  { label: 'בחר תאריך', value: 'date' },
                  { label: 'מיד', value: 'immediately' },
                  { label: 'גמיש', value: 'flexible' },
                ]}
              />
              <style jsx>{`
                :global(.vacancy-type-segmented) {
                  display: flex;
                  width: 100%;
                }
                :global(.vacancy-type-segmented .ant-radio-button-wrapper) {
                  flex: 1;
                  min-height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                }
              `}</style>
              {vacancyType === 'date' && (
                <DatePicker
                  placeholder="בחר תאריך פינוי"
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  value={formData.vacancyDate && formData.vacancyDate !== 'מיד' && formData.vacancyDate !== 'immediately' && formData.vacancyDate !== 'גמיש' && formData.vacancyDate !== 'flexible'
                    ? (typeof formData.vacancyDate === 'string'
                        ? (dayjs(formData.vacancyDate, 'DD/MM/YYYY', true).isValid()
                            ? dayjs(formData.vacancyDate, 'DD/MM/YYYY')
                            : null)
                        : (formData.vacancyDate && dayjs.isDayjs(formData.vacancyDate) ? formData.vacancyDate : null))
                    : null}
                  onChange={(date) => {
                    if (date) {
                      handleChange('vacancyDate', date.format('DD/MM/YYYY'));
                    } else {
                      handleChange('vacancyDate', '');
                    }
                  }}
                />
              )}
              {vacancyType === 'immediately' && (
                <div style={{ padding: '8px 12px', background: '#F1F3F5', borderRadius: '6px', color: '#595959' }}>
                  מיד
                </div>
              )}
              {vacancyType === 'flexible' && (
                <div style={{ padding: '8px 12px', background: '#F1F3F5', borderRadius: '6px', color: '#595959' }}>
                  גמיש
                </div>
              )}
            </div>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Form.Item name="isActive" valuePropName="checked">
            <Switch
              checked={formData.isActive}
              checkedChildren="פעיל"
              unCheckedChildren="לא פעיל"
              onChange={(checked) => handleChange('isActive', checked)}
            />
            <span style={{ marginRight: '8px' }}>נכס פעיל (יוצג באתר)</span>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="isSold" valuePropName="checked">
            <Switch
              checked={formData.isSold}
              checkedChildren={formData.dealType === 'rent' ? 'מושכר' : 'נמכר'}
              unCheckedChildren={formData.dealType === 'rent' ? 'לא מושכר' : 'לא נמכר'}
              onChange={(checked) => handleChange('isSold', checked)}
            />
            <span style={{ marginRight: '8px' }}>אקטואלי</span>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="isPinned" valuePropName="checked">
            <Switch
              checked={formData.isPinned}
              checkedChildren="נצמד"
              unCheckedChildren="לא נצמד"
              onChange={(checked) => handleChange('isPinned', checked)}
            />
            <span style={{ marginRight: '8px' }}>הצמד לעמוד הבית</span>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
