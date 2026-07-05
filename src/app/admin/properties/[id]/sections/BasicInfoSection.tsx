import { Card, Row, Col, Form, Input, Select, Switch, DatePicker, Radio } from 'antd';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyFormSectionProps } from '../types';
import { buildDealTypeOptions, buildStatusOptions } from '../constants';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

const { TextArea } = Input;

// Persisted vacancy-date sentinel values (stored in the DB and matched by the
// public site) — data values, not UI labels; they stay Hebrew in both locales.
const VACANCY_IMMEDIATE = 'מיד';
const VACANCY_FLEXIBLE = 'גמיש';

export function BasicInfoSection({ formData, handleChange }: PropertyFormSectionProps) {
  const t = useAdminMessages(propertyFormMessages);
  const [vacancyType, setVacancyType] = useState<'date' | 'immediately' | 'flexible'>('date');

  // Sync vacancyType with formData
  useEffect(() => {
    if (formData.vacancyDate === VACANCY_IMMEDIATE || formData.vacancyDate === 'immediately') {
      setVacancyType('immediately');
    } else if (formData.vacancyDate === VACANCY_FLEXIBLE || formData.vacancyDate === 'flexible') {
      setVacancyType('flexible');
    } else if (formData.vacancyDate && typeof formData.vacancyDate === 'string' && formData.vacancyDate.trim() !== '') {
      setVacancyType('date');
    } else if (formData.vacancyDate && typeof formData.vacancyDate === 'object') {
      setVacancyType('date');
    }
  }, [formData.vacancyDate]);

  return (
    <Card title={t.basicInfo.cardTitle} className="mb-4">
      <Row gutter={16}>
        <Col xs={24} sm={24} md={16}>
          <Form.Item
            label={t.basicInfo.titleLabel}
            name="title"
            rules={[{ required: true, message: t.basicInfo.titleRequired }]}
          >
            <Input
              placeholder={t.basicInfo.titlePlaceholder}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Form.Item label={t.basicInfo.dealTypeLabel} name="dealType">
            <Select
              onChange={(value) => handleChange('dealType', value)}
              options={buildDealTypeOptions(t)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Form.Item label={t.basicInfo.statusLabel} name="status">
            <Select
              onChange={(value) => handleChange('status', value)}
              options={buildStatusOptions(t)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={t.basicInfo.descriptionLabel}
            name="description"
            rules={[{ required: true, message: t.basicInfo.descriptionRequired }]}
          >
            <TextArea
              rows={6}
              placeholder={t.basicInfo.descriptionPlaceholder}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Form.Item
            label={t.basicInfo.priceLabel}
            name="price"
            rules={[{ required: true, message: t.basicInfo.priceRequired }]}
          >
            <Input
              placeholder="1,200,000"
              suffix="₪"
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item label={t.basicInfo.originalPriceLabel} name="originalPrice">
            <Input
              placeholder="1,500,000"
              suffix="₪"
              onChange={(e) => handleChange('originalPrice', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Form.Item label={t.basicInfo.vacancyDateLabel} name="vacancyDate">
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
                    handleChange('vacancyDate', VACANCY_IMMEDIATE);
                  } else if (newType === 'flexible') {
                    handleChange('vacancyDate', VACANCY_FLEXIBLE);
                  } else {
                    handleChange('vacancyDate', '');
                  }
                }}
                style={{ marginBottom: '8px', display: 'flex', width: '100%' }}
                options={[
                  { label: t.basicInfo.vacancyPickDate, value: 'date' },
                  { label: t.basicInfo.vacancyImmediate, value: 'immediately' },
                  { label: t.basicInfo.vacancyFlexible, value: 'flexible' },
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
                  placeholder={t.basicInfo.vacancyDatePlaceholder}
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  value={formData.vacancyDate && formData.vacancyDate !== VACANCY_IMMEDIATE && formData.vacancyDate !== 'immediately' && formData.vacancyDate !== VACANCY_FLEXIBLE && formData.vacancyDate !== 'flexible'
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
                  {t.basicInfo.vacancyImmediate}
                </div>
              )}
              {vacancyType === 'flexible' && (
                <div style={{ padding: '8px 12px', background: '#F1F3F5', borderRadius: '6px', color: '#595959' }}>
                  {t.basicInfo.vacancyFlexible}
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
              checkedChildren={t.basicInfo.activeOn}
              unCheckedChildren={t.basicInfo.activeOff}
              onChange={(checked) => handleChange('isActive', checked)}
            />
            <span style={{ marginInlineStart: '8px' }}>{t.basicInfo.activeCaption}</span>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="isSold" valuePropName="checked">
            <Switch
              checked={formData.isSold}
              checkedChildren={formData.dealType === 'rent' ? t.basicInfo.rentedOn : t.basicInfo.soldOn}
              unCheckedChildren={formData.dealType === 'rent' ? t.basicInfo.rentedOff : t.basicInfo.soldOff}
              onChange={(checked) => handleChange('isSold', checked)}
            />
            <span style={{ marginInlineStart: '8px' }}>{t.basicInfo.soldCaption}</span>
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item name="isPinned" valuePropName="checked">
            <Switch
              checked={formData.isPinned}
              checkedChildren={t.basicInfo.pinnedOn}
              unCheckedChildren={t.basicInfo.pinnedOff}
              onChange={(checked) => handleChange('isPinned', checked)}
            />
            <span style={{ marginInlineStart: '8px' }}>{t.basicInfo.pinnedCaption}</span>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
