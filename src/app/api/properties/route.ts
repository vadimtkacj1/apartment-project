import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { existsSync } from 'fs';
import { join } from 'path';

// Helper to parse JSON arrays stored as strings in SQLite
function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

// Helper to validate that image files exist on disk
function validateImages(images: string[]): string[] {
  return images.filter((imagePath) => {
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = join(process.cwd(), 'public', cleanPath);
    const exists = existsSync(fullPath);

    // Log missing images in development
    if (!exists && process.env.NODE_ENV === 'development') {
      console.warn(`⚠️  Image not found: ${imagePath}`);
    }

    return exists;
  });
}

// Helper to convert property from DB format to API format
function formatProperty(property: any) {
  const allImages = parseJsonArray(property.images);
  // Filter out images that don't exist on disk
  const validImages = validateImages(allImages);

  return {
    ...property,
    directions: parseJsonArray(property.directions),
    images: validImages,
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
    isHotProposition: Boolean(property.isHotProposition),
    isNoCommission: Boolean(property.isNoCommission),
  };
}

// Helper to extract numeric price from string like "₪3,200,000" or "₪5,500"
function extractNumericPrice(priceStr: string): number {
  if (!priceStr) return 0;
  // Remove ₪, commas, and any non-numeric characters except for digits
  const numericStr = priceStr.replace(/[^\d]/g, '');
  return parseInt(numericStr) || 0;
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

    // Filter by region (center area)
    if (region === 'center') {
      where.city = {
        in: ['telaviv', 'holon', 'batyam', 'rishon']
      };
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
    if (neighborhood) {
      where.neighborhood = { contains: neighborhood, mode: 'insensitive' };
    }

    // Street filter
    if (street) {
      where.street = { contains: street, mode: 'insensitive' };
    }

    // Vacancy date filter
    if (vacancyDate) {
      where.vacancyDate = { contains: vacancyDate, mode: 'insensitive' };
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

    let properties = await prisma.property.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
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

    const response = NextResponse.json(properties.map(formatProperty));
    
    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
