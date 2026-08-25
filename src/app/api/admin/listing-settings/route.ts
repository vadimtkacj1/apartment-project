import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { revalidateProperty } from '@/lib/revalidate-public';
import { DEFAULT_LISTING_ORDER, isListingOrder, LISTING_ORDERS } from '@/lib/listing-order';

/**
 * CMS control for the order properties are listed in on /apartments.
 * Stored on the HomepageSettings singleton; read back by the public catalog
 * through src/lib/listing-order.server.ts.
 */

function noStore(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  return response;
}

// GET current listing order (admin)
export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const settings = await prisma.homepageSettings.findFirst({
      select: { propertyListingOrder: true },
    });

    return noStore(
      NextResponse.json({
        propertyListingOrder: isListingOrder(settings?.propertyListingOrder)
          ? settings.propertyListingOrder
          : DEFAULT_LISTING_ORDER,
      })
    );
  } catch (error) {
    console.error('Error fetching listing settings:', error);
    // Fall back to the default rather than blocking the admin page on a read error.
    return noStore(NextResponse.json({ propertyListingOrder: DEFAULT_LISTING_ORDER }));
  }
}

// PUT update listing order (admin)
export async function PUT(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json().catch(() => ({}));
    const propertyListingOrder = body?.propertyListingOrder;

    if (!isListingOrder(propertyListingOrder)) {
      return NextResponse.json(
        { error: `סוג מיון לא חוקי. ערכים אפשריים: ${LISTING_ORDERS.join(', ')}` },
        { status: 400 }
      );
    }

    // Singleton row — create it on first save if the CMS has never been touched.
    const existing = await prisma.homepageSettings.findFirst({ select: { id: true } });
    const settings = existing
      ? await prisma.homepageSettings.update({
          where: { id: existing.id },
          data: { propertyListingOrder },
          select: { propertyListingOrder: true },
        })
      : await prisma.homepageSettings.create({
          data: { propertyListingOrder },
          select: { propertyListingOrder: true },
        });

    revalidateProperty();

    return noStore(
      NextResponse.json({ success: true, propertyListingOrder: settings.propertyListingOrder })
    );
  } catch (error) {
    console.error('Error updating listing settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to update listing order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
