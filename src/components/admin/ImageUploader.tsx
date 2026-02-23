'use client';

import { useState } from 'react';
import { Upload, Button, message, Alert, Typography } from 'antd';
import { InboxOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;
const { Text } = Typography;

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload', {
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
      onImagesChange([...images, url]);
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

    if (images.length >= maxImages) {
      message.error(`ניתן להעלות עד ${maxImages} תמונות`);
      return false;
    }

    return true;
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    message.success('התמונה נמחקה');
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div>
      {/* Upload Area */}
      <Dragger
        name="file"
        multiple
        accept="image/*"
        customRequest={handleUpload}
        beforeUpload={beforeUpload}
        showUploadList={false}
        disabled={uploading || images.length >= maxImages}
        style={{
          marginBottom: '24px',
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
          גרור תמונות לכאן או לחץ להעלאה
        </p>
        <p style={{ color: '#8c8c8c', fontSize: '14px', margin: 0 }}>
          עד {maxImages} תמונות (JPG, PNG, GIF) - מקסימום 5MB לכל תמונה
        </p>
        {uploading && (
          <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
            מעלה...
          </Text>
        )}
      </Dragger>

      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <Alert
            message={`תמונות שהועלו (${images.length})`}
            description="התמונה הראשונה תוצג כתמונה ראשית"
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '16px',
            }}
          >
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                style={{
                  position: 'relative',
                  border: index === 0 ? '3px solid #1890ff' : '1px solid #d9d9d9',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  background: '#f5f5f5',
                }}
              >
                {index === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#1890ff',
                      color: 'white',
                      padding: '2px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      zIndex: 2,
                    }}
                  >
                    ראשית
                  </div>
                )}

                {/* Logo overlay - top left */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    zIndex: 3,
                    pointerEvents: 'none',
                  }}
                >
                  <img
                    src="/images/logos.png"
                    alt="Logo"
                    style={{
                      maxWidth: '140px',
                      maxHeight: '70px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                    }}
                  />
                </div>

                {/* Use regular img tag to avoid Tailwind conflicts */}
                <img
                  src={url}
                  alt={`Property ${index + 1}`}
                  onClick={() => setPreviewImage(url)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    cursor: 'pointer',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    gap: '4px',
                    padding: '8px',
                    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                  }}
                >
                  {index > 0 && (
                    <Button
                      size="small"
                      icon={<RightOutlined />}
                      onClick={() => moveImage(index, index - 1)}
                      style={{ flex: 1 }}
                    />
                  )}
                  {index < images.length - 1 && (
                    <Button
                      size="small"
                      icon={<LeftOutlined />}
                      onClick={() => moveImage(index, index + 1)}
                      style={{ flex: 1 }}
                    />
                  )}
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeImage(index)}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          <div style={{ position: 'relative', display: 'inline-block' }}>
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
            {/* Logo overlay on preview */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            >
              <img
                src="/images/logos.png"
                alt="Logo"
                style={{
                  maxWidth: '200px',
                  maxHeight: '100px',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
