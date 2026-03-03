import { Card, Row, Col, Form, Input, Select, Switch, DatePicker, Radio } from 'antd';
import { PropertyFormSectionProps } from '../types';
import { DEAL_TYPE_OPTIONS, STATUS_OPTIONS } from '../constants';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

const { TextArea } = Input;

export function BasicInfoSection({ formData, handleChange }: PropertyFormSectionProps) {
  const [vacancyType, setVacancyType] = useState<'date' | 'immediately'>('date');

  // Sync vacancyType with formData
  useEffect(() => {
    if (formData.vacancyDate === 'מיד' || formData.vacancyDate === 'immediately') {
      setVacancyType('immediately');
    } else if (formData.vacancyDate && typeof formData.vacancyDate === 'string' && formData.vacancyDate.trim() !== '') {
      setVacancyType('date');
    } else if (formData.vacancyDate && typeof formData.vacancyDate === 'object') {
      // It's a dayjs object from DatePicker
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
        <Col xs={12} sm={12} md={4}>
          <Form.Item label="סוג עסקה" name="dealType">
            <Select
              onChange={(value) => handleChange('dealType', value)}
              options={DEAL_TYPE_OPTIONS}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={12} md={4}>
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
                value={vacancyType}
                onChange={(e) => {
                  const newType = e.target.value;
                  setVacancyType(newType);
                  if (newType === 'immediately') {
                    handleChange('vacancyDate', 'מיד');
                  } else {
                    handleChange('vacancyDate', '');
                  }
                }}
                style={{ marginBottom: '8px', width: '100%' }}
              >
                <Radio value="date">בחר תאריך</Radio>
                <Radio value="immediately">מיד</Radio>
              </Radio.Group>
              {vacancyType === 'date' && (
                <DatePicker
                  placeholder="בחר תאריך פינוי"
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  value={formData.vacancyDate && formData.vacancyDate !== 'מיד' && formData.vacancyDate !== 'immediately' 
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
                <div style={{ padding: '8px 12px', background: '#f0f0f0', borderRadius: '6px', color: '#666' }}>
                  מיד
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
              checkedChildren="נמכר"
              unCheckedChildren="לא נמכר"
              onChange={(checked) => {
                handleChange('isSold', checked);
                // Auto-clear hot proposition and no commission when marking as sold
                if (checked) {
                  handleChange('isHotProposition', false);
                  handleChange('isNoCommission', false);
                }
              }}
            />
            <span style={{ marginRight: '8px' }}>נכס נמכר</span>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="isPinned" valuePropName="checked">
            <Switch
              checkedChildren="נצמד"
              unCheckedChildren="לא נצמד"
              onChange={(checked) => handleChange('isPinned', checked)}
            />
            <span style={{ marginRight: '8px' }}>הצמד לעמוד הבית</span>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name="isHotProposition" valuePropName="checked">
            <Switch
              checkedChildren="כן"
              unCheckedChildren="לא"
              onChange={(checked) => handleChange('isHotProposition', checked)}
              disabled={formData.isSold}
            />
            <span style={{ marginRight: '8px' }}>הצעה חמה</span>
            {formData.isSold && <span style={{ marginRight: '8px', color: '#999', fontSize: '12px' }}>(לא זמין לנכסים שנמכרו)</span>}
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="isNoCommission" valuePropName="checked">
            <Switch
              checkedChildren="כן"
              unCheckedChildren="לא"
              onChange={(checked) => handleChange('isNoCommission', checked)}
              disabled={formData.isSold}
            />
            <span style={{ marginRight: '8px' }}>ללא עמלה</span>
            {formData.isSold && <span style={{ marginRight: '8px', color: '#999', fontSize: '12px' }}>(לא זמין לנכסים שנמכרו)</span>}
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
