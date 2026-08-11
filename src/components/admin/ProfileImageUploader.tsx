'use client';

import { useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { Camera, Pencil, Trash2, ZoomIn } from 'lucide-react';
import { Button } from '@/components/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/shadcn/dialog';
import { toast } from '@/components/shadcn/sonner';
import { useAdminMessages } from '@/lib/adminI18n';
import { uploadersMessages } from '@/lib/adminI18n/messages/uploaders';
import { uploadAdminImage, validateImageFile } from './adminUpload';

interface ProfileImageUploaderProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
  uploadPath?: 'owners' | 'team';
}

/** Load an image element from a data/object URL. */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });
}

/**
 * Crop the picked image to the selected pixel area on a canvas and return a
 * JPEG blob (quality 0.92, matching the previous antd-img-crop behaviour).
 */
async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context is unavailable');

  canvas.width = Math.round(pixelCrop.width);
  canvas.height = Math.round(pixelCrop.height);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas is empty'));
      },
      'image/jpeg',
      0.92,
    );
  });
}

export default function ProfileImageUploader({
  image,
  onImageChange,
  uploadPath = 'owners',
}: ProfileImageUploaderProps) {
  const t = useAdminMessages(uploadersMessages);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop dialog state — a round 1:1 crop so the admin sees exactly what the
  // circular avatar will show on the site.
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const beforeUpload = (file: File) => {
    const invalid = validateImageFile(file, t);
    if (invalid) {
      toast.error(invalid);
      return false;
    }
    return true;
  };

  const openFilePicker = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const onFileSelected = (file: File | undefined | null) => {
    if (!file) return;
    if (!beforeUpload(file)) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setCropSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedAreaPixels) return;
    setUploading(true);

    try {
      const blob = await getCroppedBlob(cropSrc, croppedAreaPixels);
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const url = await uploadAdminImage(file, t, uploadPath);
      onImageChange(url);
      toast.success(t.uploadSuccess);
      setCropSrc(null);
    } catch (err: any) {
      toast.error(err.message || t.uploadError);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onImageChange(null);
    toast.success(t.imageDeleted);
  };

  return (
    <>
      {/* Shared hidden file input for both entry points */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          onFileSelected(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      {image ? (
        // Filled state: circular preview with change/delete buttons
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
            <Button type="button" variant="outline" onClick={openFilePicker} disabled={uploading}>
              <Pencil />
              {t.changeImage}
            </Button>
            <Button type="button" variant="destructive" onClick={removeImage} disabled={uploading}>
              <Trash2 />
              {t.delete}
            </Button>
          </div>
        </div>
      ) : (
        // Empty state: circular dropzone. Selecting/dropping a file opens the
        // round crop dialog first.
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'center' }}>
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
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (!uploading) onFileSelected(e.dataTransfer.files?.[0]);
            }}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: '2px dashed #B9C4DE',
              background: '#F7F8FA',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1,
              outline: 'none',
            }}
          >
            <div style={{ padding: '0 26px' }}>
              <Camera size={32} color="#354AC4" style={{ display: 'inline-block' }} />
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
          </div>
          <p style={{ color: '#8c8c8c', fontSize: '13px', margin: '12px 0 0' }}>
            {t.profileUploadHint}
          </p>
          {uploading && (
            <span className="text-muted-foreground text-sm" style={{ display: 'block', marginTop: '8px' }}>
              {t.uploading}
            </span>
          )}
        </div>
      )}

      {/* Crop dialog */}
      <Dialog
        open={!!cropSrc}
        onOpenChange={(open) => {
          if (!open && !uploading) setCropSrc(null);
        }}
      >
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{t.cropModalTitle}</DialogTitle>
          </DialogHeader>

          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '320px',
              background: '#000',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {cropSrc && (
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_area, areaPixels) => setCroppedAreaPixels(areaPixels)}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
              aria-label="Zoom"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCropSrc(null)} disabled={uploading}>
              {t.cropCancel}
            </Button>
            <Button type="button" onClick={handleCropConfirm} disabled={uploading || !croppedAreaPixels}>
              {uploading ? '…' : t.cropApply}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </>
  );
}
