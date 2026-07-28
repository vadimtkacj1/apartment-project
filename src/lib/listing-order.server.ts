import { prisma } from '@/lib/prisma';
import { DEFAULT_LISTING_ORDER, ListingOrder, toListingOrder } from '@/lib/listing-order';

/**
 * Server-only reader for the CMS listing order.
 *
 * Kept out of `listing-order.ts` so that module (labels, sorting) stays
 * importable from client components without dragging Prisma into the bundle.
 *
 * Never throws: if the settings row is missing or the column has not been
 * pushed to this database yet, the catalog falls back to newest-first.
 */
export async function getListingOrder(): Promise<ListingOrder> {
  try {
    const settings = await prisma.homepageSettings.findFirst({
      select: { propertyListingOrder: true },
    });
    return toListingOrder(settings?.propertyListingOrder);
  } catch (error) {
    console.error('Error reading property listing order:', error);
    return DEFAULT_LISTING_ORDER;
  }
}
