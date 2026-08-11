import { defineMessages } from '@/lib/adminI18n';

/** Shared admin uploaders: image gallery uploader, profile image uploader, map location picker. */
export const uploadersMessages = defineMessages({
  he: {
    // Shared upload messages
    imageTooLargeForServer: 'התמונה גדולה מדי עבור השרת. נסה להקטין את התמונה ולהעלות שוב.',
    unexpectedServerResponse: 'שגיאה לא צפויה בתשובת השרת בעת העלאת התמונה',
    uploadSuccess: 'התמונה הועלתה בהצלחה',
    uploadError: 'שגיאה בהעלאת התמונה',
    onlyImageFiles: 'רק קבצי תמונה מותרים',
    imageMaxSize: 'התמונה חייבת להיות קטנה מ-50MB',
    maxImagesLimit: (maxImages: number) => `ניתן להעלות עד ${maxImages} תמונות`,
    imageDeleted: 'התמונה נמחקה',
    uploading: 'מעלה...',
    // Gallery uploader (ImageUploader)
    dragImagesHint: 'גרור תמונות לכאן או לחץ להעלאה',
    galleryUploadHint: (maxImages: number) =>
      `עד ${maxImages} תמונות (JPG, PNG, GIF) - מקסימום 50MB לכל תמונה`,
    uploadedImagesTitle: (count: number) => `תמונות שהועלו (${count})`,
    firstImageIsMain: 'התמונה הראשונה תוצג כתמונה ראשית',
    mainImageBadge: 'ראשית',
    // Profile uploader (ProfileImageUploader)
    changeImage: 'שנה תמונה',
    delete: 'מחק',
    dragImageHint: 'גרור תמונה לכאן או לחץ להעלאה',
    profileUploadHint: 'JPG, PNG, GIF - מקסימום 50MB',
    cropModalTitle: 'חיתוך תמונת פרופיל',
    cropApply: 'אישור',
    cropCancel: 'ביטול',
    // Location picker (LocationPicker)
    searchPlaceholder: 'הזן מיקוד או כתובת',
    search: 'חפש',
    loadingMap: 'טוען מפה...',
    foundResult: (place: string) => `נמצא: ${place}`,
    noResults: 'לא נמצאו תוצאות. בדוק את המיקוד או הכתובת',
    searchError: 'שגיאה בחיפוש',
    searchErrorWith: (details: string) => `שגיאה בחיפוש: ${details}`,
  },
  en: {
    // Shared upload messages
    imageTooLargeForServer:
      'The image is too large for the server. Try reducing the image size and uploading again.',
    unexpectedServerResponse: 'Unexpected server response while uploading the image',
    uploadSuccess: 'Image uploaded successfully',
    uploadError: 'Error uploading image',
    onlyImageFiles: 'Only image files are allowed',
    imageMaxSize: 'Image must be smaller than 50MB',
    maxImagesLimit: (maxImages: number) => `You can upload up to ${maxImages} images`,
    imageDeleted: 'Image deleted',
    uploading: 'Uploading...',
    // Gallery uploader (ImageUploader)
    dragImagesHint: 'Drag images here or click to upload',
    galleryUploadHint: (maxImages: number) =>
      `Up to ${maxImages} images (JPG, PNG, GIF) - maximum 50MB per image`,
    uploadedImagesTitle: (count: number) => `Uploaded images (${count})`,
    firstImageIsMain: 'The first image will be displayed as the main image',
    mainImageBadge: 'Main',
    // Profile uploader (ProfileImageUploader)
    changeImage: 'Change image',
    delete: 'Delete',
    dragImageHint: 'Drag an image here or click to upload',
    profileUploadHint: 'JPG, PNG, GIF - maximum 50MB',
    cropModalTitle: 'Crop profile photo',
    cropApply: 'Apply',
    cropCancel: 'Cancel',
    // Location picker (LocationPicker)
    searchPlaceholder: 'Enter a postal code or address',
    search: 'Search',
    loadingMap: 'Loading map...',
    foundResult: (place: string) => `Found: ${place}`,
    noResults: 'No results found. Check the postal code or address',
    searchError: 'Search error',
    searchErrorWith: (details: string) => `Search error: ${details}`,
  },
});
