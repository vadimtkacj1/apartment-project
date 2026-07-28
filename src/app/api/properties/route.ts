import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CENTER_REGION_CITY_SLUGS } from '@/data/cities';
import { applyListingOrder, extractNumericPrice } from '@/lib/listing-order';
import { getListingOrder } from '@/lib/listing-order.server';

// Helper to parse JSON arrays stored as strings in SQLite
function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

// Helper to convert property from DB format to API format
function formatProperty(property: any) {
  // Синхронизация dealType с category при расхождении (category — приоритет)
  let dealType = property.dealType;
  if (property.category === 'rentals' || property.category === 'commercial') {
    dealType = 'rent';
  } else if (property.category === 'sales' || property.category === 'land') {
    dealType = 'sale';
  }
  return {
    ...property,
    dealType,
    directions: parseJsonArray(property.directions),
    images: parseJsonArray(property.images),
    // Explicitly convert boolean fields from SQLite (0/1) to true booleans
    isActive: Boolean(property.isActive),
    isSold: Boolean(property.isSold),
    isPinned: Boolean(property.isPinned),
    hasAirConditioning: Boolean(property.hasAirConditioning),
    hasDisabledAccess: Boolean(property.hasDisabledAccess),
    hasSunBalcony: Boolean(property.hasSunBalcony),
    hasStorage: Boolean(property.hasStorage),
    hasSunroom: Boolean(property.hasSunroom),
    hasBoiler: Boolean(property.hasBoiler),
    hasSafeRoom: Boolean(property.hasSafeRoom),
    hasElevator: Boolean(property.hasElevator),
    hasMamak: Boolean(property.hasMamak),
    hasBars: Boolean(property.hasBars),
    hasPets: Boolean(property.hasPets),
    hasHousingUnit: Boolean(property.hasHousingUnit),
    hasShelter: Boolean(property.hasShelter),
    isHotProposition: Boolean(property.isHotProposition),
    isNoCommission: Boolean(property.isNoCommission),
  };
}

// GET all active properties (public endpoint)
// This endpoint depends on query params and request URL, so it must be dynamic.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealType = searchParams.get('dealType');
    const city = searchParams.get('city');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const maxPrice = searchParams.get('maxPrice');
    const minPrice = searchParams.get('minPrice');
    const region = searchParams.get('region');
    const pinned = searchParams.get('pinned');
    const hotProposition = searchParams.get('hotProposition');
    const noCommission = searchParams.get('noCommission');
    // Opt-in: only the /apartments catalog asks for the CMS-managed order.
    // Homepage sections and "similar properties" keep their own ordering.
    const useCmsOrder = searchParams.get('order') === 'cms';

    // Additional filters
    const propertyType = searchParams.get('propertyType');
    const minRooms = searchParams.get('minRooms');
    const maxRooms = searchParams.get('maxRooms');
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    const floor = searchParams.get('floor');
    const parking = searchParams.get('parking');
    const furniture = searchParams.get('furniture');
    const kitchen = searchParams.get('kitchen');
    const position = searchParams.get('position');
    const neighborhood = searchParams.get('neighborhood');
    const street = searchParams.get('street');
    const vacancyDate = searchParams.get('vacancyDate');

    // Feature filters
    const hasAirConditioning = searchParams.get('hasAirConditioning');
    const hasElevator = searchParams.get('hasElevator');
    const hasSunBalcony = searchParams.get('hasSunBalcony');
    const hasSafeRoom = searchParams.get('hasSafeRoom');
    const hasStorage = searchParams.get('hasStorage');
    const hasDisabledAccess = searchParams.get('hasDisabledAccess');
    const hasMamak = searchParams.get('hasMamak');
    const hasBars = searchParams.get('hasBars');
    const hasPets = searchParams.get('hasPets');
    const hasHousingUnit = searchParams.get('hasHousingUnit');
    const hasShelter = searchParams.get('hasShelter');

    const where: any = {
      isActive: true,
    };

    // Filter by pinned status if requested
    if (pinned === 'true') {
      where.isPinned = true;
    }

    // Filter by hot proposition status if requested
    if (hotProposition === 'true') {
      where.isHotProposition = true;
    }

    // Filter by no commission status if requested
    if (noCommission === 'true') {
      where.isNoCommission = true;
    }

    if (dealType && dealType !== 'all') {
      where.dealType = dealType;
    }

    if (city && city !== 'all') {
      where.city = city;
    }

    // Filter by region (center area - Gush Dan)
    if (region === 'center') {
      where.city = { in: CENTER_REGION_CITY_SLUGS };
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    // Property type filter
    if (propertyType && propertyType !== 'all') {
      where.propertyType = propertyType;
    }

    // Rooms filter - will be applied client-side since rooms is stored as string

    // Area filter
    if (minArea || maxArea) {
      where.area = {};
      if (minArea) {
        where.area.gte = parseInt(minArea);
      }
      if (maxArea) {
        where.area.lte = parseInt(maxArea);
      }
    }

    // Floor filter
    if (floor) {
      where.floor = parseInt(floor);
    }

    // Parking filter
    if (parking && parking !== 'all') {
      where.parking = parking;
    }

    // Furniture filter
    if (furniture && furniture !== 'all') {
      where.furniture = furniture;
    }

    // Kitchen filter
    if (kitchen && kitchen !== 'all') {
      where.kitchen = kitchen;
    }

    // Position filter
    if (position && position !== 'all') {
      where.position = position;
    }

    // Neighborhood filter
    // NOTE: `mode: 'insensitive'` is not supported by Prisma on SQLite and made
    // these filters throw (HTTP 500). SQLite's `contains` (LIKE) is already
    // case-insensitive for ASCII, and Hebrew has no letter case.
    if (neighborhood) {
      where.neighborhood = { contains: neighborhood };
    }

    // Street filter
    if (street) {
      where.street = { contains: street };
    }

    // Vacancy date filter
    if (vacancyDate) {
      where.vacancyDate = { contains: vacancyDate };
    }

    // Feature filters
    if (hasAirConditioning === 'true') {
      where.hasAirConditioning = true;
    }
    if (hasElevator === 'true') {
      where.hasElevator = true;
    }
    if (hasSunBalcony === 'true') {
      where.hasSunBalcony = true;
    }
    if (hasSafeRoom === 'true') {
      where.hasSafeRoom = true;
    }
    if (hasStorage === 'true') {
      where.hasStorage = true;
    }
    if (hasDisabledAccess === 'true') {
      where.hasDisabledAccess = true;
    }
    if (hasMamak === 'true') where.hasMamak = true;
    if (hasBars === 'true') where.hasBars = true;
    if (hasPets === 'true') where.hasPets = true;
    if (hasHousingUnit === 'true') where.hasHousingUnit = true;
    if (hasShelter === 'true') where.hasShelter = true;

    const listingOrder = useCmsOrder ? await getListingOrder() : 'newest';
    // A SQL-level `take` would slice the newest N before reordering, so a
    // price/random order has to fetch the full set and slice after sorting.
    const sliceAfterOrder = listingOrder !== 'newest';

    let properties = await prisma.property.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit && !sliceAfterOrder ? parseInt(limit) : undefined,
    });

    // Filter by price range (client-side filtering since price is stored as string)
    if (minPrice || maxPrice) {
      properties = properties.filter((prop: any) => {
        const priceNum = extractNumericPrice(prop.price);
        if (priceNum === 0) return false;

        if (minPrice && priceNum < parseInt(minPrice)) return false;
        if (maxPrice && priceNum > parseInt(maxPrice)) return false;

        return true;
      });
    }

    // Filter by rooms range (client-side filtering since rooms is stored as string)
    if (minRooms || maxRooms) {
      properties = properties.filter((prop: any) => {
        const roomsNum = parseFloat(prop.rooms);
        if (isNaN(roomsNum)) return false;

        if (minRooms && roomsNum < parseFloat(minRooms)) return false;
        if (maxRooms && roomsNum > parseFloat(maxRooms)) return false;

        return true;
      });
    }

    // Order last, so it applies to the post-filter result set
    if (sliceAfterOrder) {
      properties = applyListingOrder(properties, listingOrder);
      if (limit) properties = properties.slice(0, parseInt(limit));
    }

    const response = NextResponse.json(properties.map(formatProperty));
    
    // Add caching headers for better performance.
    // For dynamic homepage sections (pinned / hot / no-commission) disable cache
    // so changes from the admin panel appear immediately.
    if (pinned === 'true' || hotProposition === 'true' || noCommission === 'true') {
      response.headers.set('Cache-Control', 'no-store');
    } else {
      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
