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

// GET single property (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findFirst({
      where: {
        id: parseInt(id),
        isActive: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(formatProperty(property));
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}
