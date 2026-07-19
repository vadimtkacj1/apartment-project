'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button, Form, Spin } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
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

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const [form] = Form.useForm();
  const t = useAdminMessages(propertyFormMessages);
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
      <AdminPageHeader
        title={
          <>
            <HomeOutlined style={{ marginInlineEnd: '8px' }} />
            {isNew ? t.page.addTitle : t.page.editTitle}
          </>
        }
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            iconPlacement="end"
            onClick={() => router.push('/admin/properties')}
            size="large"
            className="w-full sm:w-auto"
          >
            {t.page.backToList}
          </Button>
        }
      />

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
            marginTop: '30px',
            padding: '16px 0',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              size="large"
              icon={<SaveOutlined />}
              className="w-full sm:w-auto"
            >
              {t.page.save}
            </Button>
            <Button
              size="large"
              onClick={() => router.push('/admin/properties')}
              className="w-full sm:w-auto"
            >
              {t.page.cancel}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
