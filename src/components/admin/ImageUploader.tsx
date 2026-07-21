'use client';

import { useEffect, useRef, useState } from 'react';
import { Inbox, Trash2, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/shadcn/alert';
import { toast } from '@/components/shadcn/sonner';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAdminMessages, useAdminI18n } from '@/lib/adminI18n';
import { uploadersMessages } from '@/lib/adminI18n/messages/uploaders';
import { uploadAdminImage, validateImageFile } from './adminUpload';

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
  const t = useAdminMessages(uploadersMessages);
  const { dir } = useAdminI18n();
  const isMobile = useIsMobile();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const disabled = uploading || images.length >= maxImages;

  // Lock body scroll while the fullscreen preview overlay is open.
  useEffect(() => {
    if (!previewImage) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [previewImage]);

  const handleUpload = async (file: File) => {
    setUploading(true);

    try {
      const url = await uploadAdminImage(file, t);
      onImagesChange([...images, url]);
      toast.success(t.uploadSuccess);
    } catch (err: any) {
      toast.error(err.message || t.uploadError);
    } finally {
      setUploading(false);
    }
  };

  const beforeUpload = (file: File) => {
    const invalid = validateImageFile(file, t);
    if (invalid) {
      toast.error(invalid);
      return false;
    }

    if (images.length >= maxImages) {
      toast.error(t.maxImagesLimit(maxImages));
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (beforeUpload(file)) {
        handleUpload(file);
      }
    });
  };

  const openFilePicker = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success(t.imageDeleted);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div>
      {/* Upload Area — custom drag-and-drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFilePicker();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          marginBottom: '24px',
          borderRadius: '12px',
          border: `2px dashed ${dragOver ? '#354AC4' : '#d9d9d9'}`,
          background: dragOver ? '#EEF1FB' : '#F7F8FA',
          padding: '20px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'border-color 0.2s, background 0.2s',
          outline: 'none',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <p style={{ margin: 0 }}>
          <Inbox size={48} color="#354AC4" style={{ display: 'inline-block' }} />
        </p>
        <p style={{ fontSize: '18px', fontWeight: 600, color: '#141414', margin: '12px 0 8px' }}>
          {t.dragImagesHint}
        </p>
        <p style={{ color: '#8c8c8c', fontSize: '14px', margin: 0 }}>
          {t.galleryUploadHint(maxImages)}
        </p>
        {uploading && (
          <span className="text-muted-foreground text-sm" style={{ display: 'block', marginTop: '8px' }}>
            {t.uploading}
          </span>
        )}
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <Alert variant="info" style={{ marginBottom: '16px' }}>
            <Info className="size-4" />
            <AlertTitle>{t.uploadedImagesTitle(images.length)}</AlertTitle>
            <AlertDescription>{t.firstImageIsMain}</AlertDescription>
          </Alert>

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
                  border: index === 0 ? '3px solid #354AC4' : '1px solid #d9d9d9',
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
                      background: '#354AC4',
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
                    src="/aiterra-logo.png"
                    alt="Aiterra logo"
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
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => moveImage(index, index - 1)}
                      style={{ flex: 1 }}
                    >
                      {dir === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
                    </Button>
                  )}
                  {index < images.length - 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => moveImage(index, index + 1)}
                      style={{ flex: 1 }}
                    >
                      {dir === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(index)}
                    style={{ flex: 1 }}
                  >
                    <Trash2 />
                  </Button>
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
                src="/aiterra-logo.png"
                alt="Aiterra logo"
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
