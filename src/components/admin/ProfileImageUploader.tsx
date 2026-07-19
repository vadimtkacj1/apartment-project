'use client';

import { useState } from 'react';
import { Upload, Button, App, Typography } from 'antd';
import ImgCrop from 'antd-img-crop';
import { CameraOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useAdminMessages } from '@/lib/adminI18n';
import { uploadersMessages } from '@/lib/adminI18n/messages/uploaders';
import { uploadAdminImage, validateImageFile } from './adminUpload';

const { Dragger } = Upload;
const { Text } = Typography;

interface ProfileImageUploaderProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
  uploadPath?: 'owners' | 'team';
}

export default function ProfileImageUploader({
  image,
  onImageChange,
  uploadPath = 'owners',
}: ProfileImageUploaderProps) {
  const { message } = App.useApp();
  const t = useAdminMessages(uploadersMessages);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    setUploading(true);

    try {
      const url = await uploadAdminImage(file as File, t, uploadPath);
      onImageChange(url);
      message.success(t.uploadSuccess);
      onSuccess?.(url);
    } catch (err: any) {
      message.error(err.message || t.uploadError);
      onError?.(err);
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const invalid = validateImageFile(file, t);
    if (invalid) {
      message.error(invalid);
      return false;
    }
    return true;
  };

  const removeImage = () => {
    onImageChange(null);
    message.success(t.imageDeleted);
  };

  // Crop-modal props shared by both upload entry points: a round 1:1 crop so
  // the admin sees exactly what the circular avatar will show on the site.
  const cropProps = {
    cropShape: 'round' as const,
    showGrid: false,
    rotationSlider: true,
    quality: 0.92,
    modalTitle: t.cropModalTitle,
    modalOk: t.cropApply,
    modalCancel: t.cropCancel,
  };

  // If image exists, show preview with edit/delete buttons
  if (image) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div
          style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #354AC4',
            marginBottom: '16px',
            background: '#F1F3F5',
          }}
        >
          <img
            src={image}
            alt="Profile"
            onClick={() => setPreviewImage(image)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              cursor: 'pointer',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <ImgCrop {...cropProps}>
            <Upload
              accept="image/*"
              customRequest={handleUpload}
              beforeUpload={beforeUpload}
              showUploadList={false}
              disabled={uploading}
            >
              <Button icon={<EditOutlined />} loading={uploading}>
                {t.changeImage}
              </Button>
            </Upload>
          </ImgCrop>
          <Button danger icon={<DeleteOutlined />} onClick={removeImage}>
            {t.delete}
          </Button>
        </div>

        {/* Preview Modal */}
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              cursor: 'pointer',
            }}
          >
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </div>
        )}
      </div>
    );
  }

  // If no image, show a circular dropzone — same 200px circle as the filled
  // preview above, so the empty state previews how the photo renders on the
  // public site. Selecting/dropping a file opens the round crop modal first.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}>
      <ImgCrop {...cropProps}>
        <Dragger
          name="file"
          accept="image/*"
          customRequest={handleUpload}
          beforeUpload={beforeUpload}
          showUploadList={false}
          disabled={uploading}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: '2px dashed #B9C4DE',
            background: '#F7F8FA',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '0 26px' }}>
            <CameraOutlined style={{ fontSize: '32px', color: '#354AC4' }} />
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#141414',
                margin: '10px 0 0',
                lineHeight: 1.35,
              }}
            >
              {t.dragImageHint}
            </p>
          </div>
        </Dragger>
      </ImgCrop>
      <p style={{ color: '#8c8c8c', fontSize: '13px', margin: '12px 0 0' }}>
        {t.profileUploadHint}
      </p>
      {uploading && (
        <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
          {t.uploading}
        </Text>
      )}
    </div>
  );
}
