'use client';

import { useState } from 'react';
import { Upload, Button, message, Typography } from 'antd';
import { InboxOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

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
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/admin/upload?folder=${uploadPath}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    setUploading(true);

    try {
      const url = await uploadImage(file as File);
      onImageChange(url);
      message.success('התמונה הועלתה בהצלחה');
      onSuccess?.(url);
    } catch (err: any) {
      message.error(err.message || 'שגיאה בהעלאת התמונה');
      onError?.(err);
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('רק קבצי תמונה מותרים');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('התמונה חייבת להיות קטנה מ-5MB');
      return false;
    }

    return true;
  };

  const removeImage = () => {
    onImageChange(null);
    message.success('התמונה נמחקה');
  };

  // If image exists, show preview with edit/delete buttons
  if (image) {
    return (
      <div>
        <div
          style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #1890ff',
            margin: '0 auto 16px',
            background: '#f5f5f5',
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

        <div style={{ textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Upload
            accept="image/*"
            customRequest={handleUpload}
            beforeUpload={beforeUpload}
            showUploadList={false}
            disabled={uploading}
          >
            <Button icon={<EditOutlined />} loading={uploading}>
              שנה תמונה
            </Button>
          </Upload>
          <Button danger icon={<DeleteOutlined />} onClick={removeImage}>
            מחק
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

  // If no image, show upload dragger
  return (
    <div>
      <Dragger
        name="file"
        accept="image/*"
        customRequest={handleUpload}
        beforeUpload={beforeUpload}
        showUploadList={false}
        disabled={uploading}
        style={{
          borderRadius: '12px',
          border: '2px dashed #d9d9d9',
          background: '#fafafa',
          padding: '20px',
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
        </p>
        <p style={{ fontSize: '18px', fontWeight: 600, color: '#141414', margin: '12px 0 8px' }}>
          גרור תמונה לכאן או לחץ להעלאה
        </p>
        <p style={{ color: '#8c8c8c', fontSize: '14px', margin: 0 }}>
          JPG, PNG, GIF - מקסימום 5MB
        </p>
        {uploading && (
          <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
            מעלה...
          </Text>
        )}
      </Dragger>
    </div>
  );
}
