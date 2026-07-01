import { Card, Alert, Row, Col, Form, InputNumber, Typography, Space } from 'antd';
import { EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import LocationPicker from '@/components/admin/LocationPicker';
import { PropertyForm } from '../types';

const { Text } = Typography;

interface MapSectionProps {
  formData: PropertyForm;
  handleChange: (field: keyof PropertyForm, value: any) => void;
  onAddressChange: (address: any) => void;
}

export function MapSection({ formData, handleChange, onAddressChange }: MapSectionProps) {
  const hasCoordinates = formData.latitude && formData.longitude;

  return (
    <Card title={<><EnvironmentOutlined /> מיקום על המפה</>} className="mb-4">
      <Alert
        title="איך לבחור מיקום?"
        description={
          <Space vertical size="small">
            <Text>• הזן כתובת בשורת החיפוש למעלה</Text>
            <Text>• לחץ על המפה למיקום מדויק</Text>
            <Text>• גרור את הסמן למיקום הרצוי</Text>
            <Text>• או הזן קואורדינטות ידנית למטה</Text>
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
          הזנת קואורדינטות ידנית
        </Typography.Title>
        <Row gutter={16}>
          <Col md={12}>
            <Form.Item
              label="קו רוחב (Latitude)"
              name="latitude"
              tooltip="ערכים תקינים לישראל: בין 29 ל-33"
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
              label="קו אורך (Longitude)"
              name="longitude"
              tooltip="ערכים תקינים לישראל: בין 34 ל-36"
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
            title="קואורדינטות נשמרו"
            description={`קו רוחב: ${formData.latitude?.toFixed(6)}, קו אורך: ${formData.longitude?.toFixed(6)}`}
            type="success"
            showIcon
            style={{ marginTop: '12px' }}
          />
        )}
      </div>
    </Card>
  );
}
