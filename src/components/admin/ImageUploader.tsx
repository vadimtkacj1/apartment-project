'use client';

import { useEffect, useState } from 'react';
import { Upload, Button, App, Alert, Typography } from 'antd';
import { InboxOutlined, DeleteOutlined, LeftOutlined, RightOutlined, CloseOutlined, PlayCircleFilled } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useIsMobile } from '@/hooks/useIsMobile';
import { isVideoUrl, videoMimeType } from '@/lib/media';

const { Dragger } = Upload;
const { Text } = Typography;

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const MAX_IMAGE_MB = 20;
const MAX_VIDEO_MB = 100;

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 25,
}: ImageUploaderProps) {
  const { message } = App.useApp();
  const isMobile = useIsMobile();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const previewIsVideo = isVideoUrl(previewImage);

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
          errorMessage = 'התמונה גדולה מדי עבור השרת. נסה להקטין את התמונה ולהעלות שוב.';
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
      throw new Error('שגיאה לא צפויה בתשובת השרת בעת העלאת התמונה');
    }
  };

  const handleUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    console.log('📤 [FRONTEND] handleUpload called');
    setUploading(true);

    try {
      const uploaded = file as File;
      const url = await uploadImage(uploaded);
      console.log('💾 [FRONTEND] Adding URL to images list:', url);
      onImagesChange([...images, url]);
      console.log('✅ [FRONTEND] Images list updated. Total images:', images.length + 1);
      message.success(uploaded.type.startsWith('video/') ? 'הסרטון הועלה בהצלחה' : 'התמונה הועלתה בהצלחה');
      onSuccess?.(url);
    } catch (err: any) {
      console.error('❌ [FRONTEND] Upload error:', err);
      message.error(err.message || 'שגיאה בהעלאת הקובץ');
      onError?.(err);
    } finally {
      setUploading(false);
      console.log('🏁 [FRONTEND] Upload completed\n');
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      message.error('רק קבצי תמונה או וידאו מותרים');
      return false;
    }

    const sizeMb = file.size / 1024 / 1024;
    const maxMb = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
    if (sizeMb >= maxMb) {
      message.error(
        isVideo
          ? `הסרטון חייב להיות קטן מ-${MAX_VIDEO_MB}MB`
          : `התמונה חייבת להיות קטנה מ-${MAX_IMAGE_MB}MB`
      );
      return false;
    }

    if (images.length >= maxImages) {
      message.error(`ניתן להעלות עד ${maxImages} קבצים`);
      return false;
    }

    return true;
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    message.success('הקובץ נמחק');
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
        accept="image/*,video/*"
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
          גרור תמונות או סרטונים לכאן או לחץ להעלאה
        </p>
        <p style={{ color: '#8c8c8c', fontSize: '14px', margin: 0 }}>
          עד {maxImages} קבצים - תמונות (JPG, PNG, WebP, GIF) עד {MAX_IMAGE_MB}MB, סרטונים (MP4, WebM, MOV) עד {MAX_VIDEO_MB}MB
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
            title={`קבצים שהועלו (${images.length})`}
            description="הקובץ הראשון מוצג ראשון בגלריה. התמונה הראשונה ברשימה משמשת כתמונה ראשית בכרטיסים ובשיתוף"
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
            {images.map((url, index) => {
              const isVideo = isVideoUrl(url);
              return (
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
                    ראשית
                  </div>
                )}

                {!isVideo && (
                  /* Logo overlay - top left */
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
                )}

                {isVideo ? (
                  <>
                    <video
                      src={url}
                      muted
                      playsInline
                      preload="metadata"
                      onClick={() => setPreviewImage(url)}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        cursor: 'pointer',
                        background: '#000',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 3,
                      }}
                    >
                      <PlayCircleFilled
                        style={{
                          fontSize: '44px',
                          color: 'rgba(255, 255, 255, 0.9)',
                          filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5))',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: 'rgba(0, 0, 0, 0.65)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        zIndex: 4,
                      }}
                    >
                      וידאו
                    </div>
                  </>
                ) : (
                  /* Use regular img tag to avoid Tailwind conflicts */
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
                )}

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
              );
            })}
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
          <div
            onClick={(event) => previewIsVideo && event.stopPropagation()}
            style={{ position: 'relative', display: 'inline-block', cursor: previewIsVideo ? 'default' : 'pointer' }}
          >
            {previewIsVideo ? (
              <video
                src={previewImage}
                controls
                autoPlay
                playsInline
                style={{
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  borderRadius: '8px',
                  background: '#000',
                  display: 'block',
                }}
              >
                <source src={previewImage} type={videoMimeType(previewImage)} />
              </video>
            ) : (
              <>
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
              </>
            )}
            {previewIsVideo && (
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                onClick={() => setPreviewImage(null)}
                style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 11 }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
