/**
 * Shared upload + validation logic for the admin image uploaders
 * (ImageUploader gallery + ProfileImageUploader avatar) — one fetch/error
 * pipeline instead of two diverging copies.
 */

/** The subset of uploadersMessages strings the helpers need. */
export interface UploadStrings {
  imageTooLargeForServer: string;
  unexpectedServerResponse: string;
  onlyImageFiles: string;
  imageMaxSize: string;
}

export async function uploadAdminImage(
  file: File,
  t: UploadStrings,
  folder?: 'owners' | 'team',
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const endpoint = folder ? `/api/admin/upload?folder=${folder}` : '/api/admin/upload';
  const response = await fetch(endpoint, { method: 'POST', body: formData });

  if (!response.ok) {
    let errorMessage = 'Failed to upload image';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // Non-JSON error body — 413 means the server rejected the payload size
      // before our route handler ever ran.
      if (response.status === 413) {
        errorMessage = t.imageTooLargeForServer;
      }
    }
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    return data.url;
  } catch {
    throw new Error(t.unexpectedServerResponse);
  }
}

/** Returns an error message for invalid files, or null when the file is fine. */
export function validateImageFile(file: File, t: UploadStrings): string | null {
  if (!file.type.startsWith('image/')) return t.onlyImageFiles;
  if (file.size / 1024 / 1024 >= 50) return t.imageMaxSize;
  return null;
}
