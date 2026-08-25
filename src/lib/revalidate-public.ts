import { revalidatePath } from 'next/cache';

/**
 * Drops the cached public pages that an admin edit has just made stale.
 *
 * The property page is prerendered with `revalidate = 300` and the home page
 * with `revalidate = 60`, so without this an edit stays invisible to visitors
 * for up to five minutes.
 */
export function revalidateProperty(propertyId?: number | string | null) {
  drop(() => {
    revalidatePath('/');
    revalidatePath('/apartments');
    if (propertyId !== undefined && propertyId !== null) {
      revalidatePath(`/apartments/${propertyId}`);
    }
    revalidatePath('/sitemap.xml');
  });
}

/** Header, footer and every prerendered page — for edits that show site-wide. */
export function revalidateSite() {
  drop(() => revalidatePath('/', 'layout'));
}

// A cache that refuses to clear must never cost the admin their save.
function drop(purge: () => void) {
  try {
    purge();
  } catch (error) {
    console.error('Failed to revalidate public pages:', error);
  }
}
