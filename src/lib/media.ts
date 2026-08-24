export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v', 'ogv'] as const;

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  const path = url.split('?')[0].split('#')[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((extension) => path.endsWith(`.${extension}`));
}

export function isImageUrl(url: string | null | undefined): boolean {
  return typeof url === 'string' && url.trim().length > 0 && !isVideoUrl(url);
}

export function onlyImages(media: (string | null | undefined)[] | null | undefined): string[] {
  if (!Array.isArray(media)) return [];
  return media.filter((url): url is string => isImageUrl(url));
}

export function firstImage(media: (string | null | undefined)[] | null | undefined): string | undefined {
  return onlyImages(media)[0];
}

export function videoMimeType(url: string): string {
  const extension = url.split('?')[0].split('#')[0].toLowerCase().split('.').pop() || '';
  const types: Record<string, string> = {
    mp4: 'video/mp4',
    m4v: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    ogv: 'video/ogg',
  };
  return types[extension] || 'video/mp4';
}
