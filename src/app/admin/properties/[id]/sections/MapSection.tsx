import { Card, Alert, Row, Col, Form, InputNumber, Typography, Space } from 'antd';
import { EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import LocationPicker from '@/components/admin/LocationPicker';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyForm } from '../types';

const { Text } = Typography;

interface MapSectionProps {
  formData: PropertyForm;
  handleChange: (field: keyof PropertyForm, value: any) => void;
  onAddressChange: (address: any) => void;
}

export function MapSection({ formData, handleChange, onAddressChange }: MapSectionProps) {
  const t = useAdminMessages(propertyFormMessages);
  const hasCoordinates = formData.latitude && formData.longitude;

  return (
    <Card title={<><EnvironmentOutlined /> {t.map.cardTitle}</>} className="mb-4">
      <Alert
        title={t.map.helpTitle}
        description={
          <Space vertical size="small">
            <Text>{t.map.helpEnterAddress}</Text>
            <Text>{t.map.helpClickMap}</Text>
            <Text>{t.map.helpDragMarker}</Text>
            <Text>{t.map.helpManualEntry}</Text>
          </Space>
        }
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <LocationPicker
        position={
          hasCoordinates
            ? { lat: formData.latitude!, lng: formData.longitude! }
            : null
        }
        onPositionChange={(position) => {
          handleChange('latitude', position.lat);
          handleChange('longitude', position.lng);
        }}
        onAddressChange={onAddressChange}
      />

      {/* Manual Coordinate Input */}
      <div style={{ marginTop: '24px' }}>
        <Typography.Title level={5} style={{ marginBottom: '16px' }}>
          {t.map.manualTitle}
        </Typography.Title>
        <Row gutter={16}>
          <Col md={12}>
            <Form.Item
              label={t.map.latitudeLabel}
              name="latitude"
              tooltip={t.map.latitudeTooltip}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="32.0853"
                step={0.000001}
                precision={6}
                min={-90}
                max={90}
                value={formData.latitude}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    handleChange('latitude', value);
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              label={t.map.longitudeLabel}
              name="longitude"
              tooltip={t.map.longitudeTooltip}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="34.7818"
                step={0.000001}
                precision={6}
                min={-180}
                max={180}
                value={formData.longitude}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    handleChange('longitude', value);
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {hasCoordinates && (
          <Alert
            title={t.map.savedTitle}
            description={t.map.savedDescription(
              formData.latitude?.toFixed(6) ?? '',
              formData.longitude?.toFixed(6) ?? ''
            )}
            type="success"
            showIcon
            style={{ marginTop: '12px' }}
          />
        )}
      </div>
    </Card>
  );
}
