import { Card, Alert, Row, Col, Form, InputNumber } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import LocationPicker from '@/components/admin/LocationPicker';
import { PropertyForm } from '../types';

interface MapSectionProps {
  formData: PropertyForm;
  handleChange: (field: keyof PropertyForm, value: any) => void;
  onAddressChange: (address: any) => void;
}

export function MapSection({ formData, handleChange, onAddressChange }: MapSectionProps) {
  return (
    <Card title={<><EnvironmentOutlined /> מיקום על המפה</>} className="mb-4">
      <LocationPicker
        position={
          formData.latitude && formData.longitude
            ? { lat: formData.latitude, lng: formData.longitude }
            : null
        }
        onPositionChange={(position) => {
          handleChange('latitude', position.lat);
          handleChange('longitude', position.lng);
        }}
        onAddressChange={onAddressChange}
      />
      {/* Manual Coordinate Input */}
      <Row gutter={16} style={{ marginTop: '16px' }}>
        <Col md={12}>
          <Form.Item label="קו רוחב (Latitude)" name="latitude">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="32.0853"
              step={0.000001}
              precision={6}
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
          <Form.Item label="קו אורך (Longitude)" name="longitude">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="34.7818"
              step={0.000001}
              precision={6}
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
    </Card>
  );
}
