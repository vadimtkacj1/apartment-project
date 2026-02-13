'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button, Form, Spin, Typography } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { usePropertyForm } from './usePropertyForm';
import {
  BasicInfoSection,
  LocationSection,
  PropertyDetailsSection,
  FeaturesSection,
  MapSection,
  ImagesSection,
} from './sections';

const { Title } = Typography;

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const isNew = params.id === 'new';

  const {
    formData,
    loading,
    saving,
    handleChange,
    handleSubmit,
    handleAddressFromMap,
  } = usePropertyForm(params.id, isNew, form);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>
          <HomeOutlined style={{ marginLeft: '12px' }} />
          {isNew ? 'הוסף נכס חדש' : 'ערוך נכס'}
        </Title>
        <Button
          icon={<ArrowLeftOutlined />}
          iconPosition="end"
          onClick={() => router.push('/admin/properties')}
          size="large"
        >
          חזרה לרשימה
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleSubmit(values)}
        initialValues={formData}
      >
        <BasicInfoSection formData={formData} handleChange={handleChange} />
        <LocationSection formData={formData} handleChange={handleChange} />
        <PropertyDetailsSection formData={formData} handleChange={handleChange} />
        <FeaturesSection formData={formData} handleChange={handleChange} />
        <MapSection
          formData={formData}
          handleChange={handleChange}
          onAddressChange={handleAddressFromMap}
        />
        <ImagesSection formData={formData} handleChange={handleChange} />

        {/* Submit Buttons */}
        <div
          style={{
            position: 'sticky',
            marginTop: '30px',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              size="large"
              onClick={() => router.push('/admin/properties')}
            >
              ביטול
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              size="large"
              icon={<SaveOutlined />}
            >
              שמור נכס
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
