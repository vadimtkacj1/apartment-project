import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
  return {
    ...property,
    directions: parseJsonArray(property.directions),
    images: parseJsonArray(property.images),
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dealType = searchParams.get('dealType');
    const city = searchParams.get('city');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');
    const maxPrice = searchParams.get('maxPrice');
    const region = searchParams.get('region'); // 'center' for center area
    const pinned = searchParams.get('pinned'); // 'true' to filter by isPinned
    const hotProposition = searchParams.get('hotProposition'); // 'true' to filter by isHotProposition
    const noCommission = searchParams.get('noCommission'); // 'true' to filter by isNoCommission

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
      // Center area includes: Tel Aviv, Holon, Bat Yam, Rishon LeZion, Ramat Gan, Givatayim, etc.
      where.city = {
        in: ['telaviv', 'holon', 'batyam', 'rishon']
      };
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    let properties = await prisma.property.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    // Filter by max price if provided (client-side filtering since price is stored as string)
    if (maxPrice) {
      const maxPriceNum = parseInt(maxPrice);
      properties = properties.filter((prop: any) => {
        const priceNum = extractNumericPrice(prop.price);
        return priceNum > 0 && priceNum <= maxPriceNum;
      });
    }

    return NextResponse.json(properties.map(formatProperty));
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}
