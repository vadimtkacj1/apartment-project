'use client';

import { useEffect, useState } from 'react';
import { Upload, Button, App, Alert, Typography } from 'antd';
import { InboxOutlined, DeleteOutlined, LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAdminMessages, useAdminI18n } from '@/lib/adminI18n';
import { uploadersMessages } from '@/lib/adminI18n/messages/uploaders';

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
  maxImages = 25,
}: ImageUploaderProps) {
  const { message } = App.useApp();
  const t = useAdminMessages(uploadersMessages);
  const { dir } = useAdminI18n();
  const isMobile = useIsMobile();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Lock body scroll while the fullscreen preview overlay is open.
  useEffect(() => {
    if (!previewImage) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [previewImage]);

  const uploadImage = async (file: File): Promise<string> => {
    console.log('🚀 [FRONTEND] Starting file upload:', file.name);
    console.log('   Size:', file.size, 'bytes');
    console.log('   Type:', file.type);

    const formData = new FormData();
    formData.append('file', file);

    console.log('📡 [FRONTEND] Sending request to /api/admin/upload...');
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    console.log('📥 [FRONTEND] Received response, status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Failed to upload image';

      try {
        const error = await response.json();
        console.error('❌ [FRONTEND] Error from server (JSON):', error);
        errorMessage = error.error || errorMessage;
      } catch (jsonError) {
        console.error('❌ [FRONTEND] Error parsing JSON error response:', jsonError);

        if (response.status === 413) {
          // Payload Too Large – сервер отверг файл ещё до обработки нашим бэкендом
          errorMessage = t.imageTooLargeForServer;
        } else {
          const text = await response.text().catch(() => null);
          console.error('❌ [FRONTEND] Non-JSON error response body:', text);
        }
      }

      throw new Error(errorMessage);
    }

    try {
      const data = await response.json();
      console.log('✅ [FRONTEND] File uploaded successfully!');
      console.log('   URL:', data.url);
      return data.url;
    } catch (parseError) {
      console.error('❌ [FRONTEND] Failed to parse success response as JSON:', parseError);
      throw new Error(t.unexpectedServerResponse);
    }
  };

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    console.log('📤 [FRONTEND] handleUpload called');
    setUploading(true);

    try {
      const url = await uploadImage(file as File);
      console.log('💾 [FRONTEND] Adding URL to images list:', url);
      onImagesChange([...images, url]);
      console.log('✅ [FRONTEND] Images list updated. Total images:', images.length + 1);
      message.success(t.uploadSuccess);
      onSuccess?.(url);
    } catch (err: any) {
      console.error('❌ [FRONTEND] Upload error:', err);
      message.error(err.message || t.uploadError);
      onError?.(err);
    } finally {
      setUploading(false);
      console.log('🏁 [FRONTEND] Upload completed\n');
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error(t.onlyImageFiles);
      return false;
    }

    const isLt50M = file.size / 1024 / 1024 < 50;
    if (!isLt50M) {
      message.error(t.imageMaxSize);
      return false;
    }

    if (images.length >= maxImages) {
      message.error(t.maxImagesLimit(maxImages));
      return false;
    }

    return true;
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    message.success(t.imageDeleted);
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
          background: '#F7F8FA',
          padding: '20px',
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: '48px', color: '#1C3664' }} />
        </p>
        <p style={{ fontSize: '18px', fontWeight: 600, color: '#141414', margin: '12px 0 8px' }}>
          {t.dragImagesHint}
        </p>
        <p style={{ color: '#8c8c8c', fontSize: '14px', margin: 0 }}>
          {t.galleryUploadHint(maxImages)}
        </p>
        {uploading && (
          <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
            {t.uploading}
          </Text>
        )}
      </Dragger>

      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <Alert
            title={t.uploadedImagesTitle(images.length)}
            description={t.firstImageIsMain}
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
                  border: index === 0 ? '3px solid #1C3664' : '1px solid #d9d9d9',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                  background: '#F1F3F5',
                }}
              >
                {index === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#1C3664',
                      color: 'white',
                      padding: '2px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      zIndex: 2,
                    }}
                  >
                    {t.mainImageBadge}
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
                      icon={dir === 'rtl' ? <RightOutlined /> : <LeftOutlined />}
                      onClick={() => moveImage(index, index - 1)}
                      style={{ flex: 1 }}
                    />
                  )}
                  {index < images.length - 1 && (
                    <Button
                      size="small"
                      icon={dir === 'rtl' ? <LeftOutlined /> : <RightOutlined />}
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
