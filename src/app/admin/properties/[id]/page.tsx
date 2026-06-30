'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button, Form, Spin, Typography } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { usePropertyForm } from './usePropertyForm';
import {
  BasicInfoSection,
  AgentSection,
  LocationSection,
  PropertyDetailsSection,
  FeaturesSection,
  MapSection,
  ImagesSection,
  SeoSection,
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
    <div className="px-2 sm:px-4 md:px-0">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={2} style={{ margin: 0, fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
          <HomeOutlined style={{ marginLeft: '8px' }} />
          {isNew ? 'הוסף נכס חדש' : 'ערוך נכס'}
        </Title>
        <Button
          icon={<ArrowLeftOutlined />}
          iconPlacement="end"
          onClick={() => router.push('/admin/properties')}
          size="large"
          className="w-full sm:w-auto"
        >
          חזרה לרשימה
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleSubmit(values, () => router.push('/admin/properties'))}
        onFinishFailed={({ errorFields }) => {
          form.scrollToField(errorFields[0]?.name?.[0], { behavior: 'smooth' });
        }}
        scrollToFirstError
        initialValues={formData}
      >
        <BasicInfoSection formData={formData} handleChange={handleChange} />
        <AgentSection formData={formData} handleChange={handleChange} />
        <LocationSection formData={formData} handleChange={handleChange} />
        <PropertyDetailsSection formData={formData} handleChange={handleChange} />
        <FeaturesSection formData={formData} handleChange={handleChange} />
        <MapSection
          formData={formData}
          handleChange={handleChange}
          onAddressChange={handleAddressFromMap}
        />
        <ImagesSection formData={formData} handleChange={handleChange} />
        <SeoSection formData={formData} handleChange={handleChange} />

        {/* Submit Buttons */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            marginTop: '30px',
            zIndex: 10,
            backgroundColor: 'white',
            padding: '16px 0',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button
              size="large"
              onClick={() => router.push('/admin/properties')}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              ביטול
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              size="large"
              icon={<SaveOutlined />}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              שמור נכס
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
