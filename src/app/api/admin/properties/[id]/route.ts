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

// GET single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: {
        id: parseInt(id),
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

// PUT - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const property = await prisma.property.update({
      where: {
        id: parseInt(id),
      },
      data: {
        // Deal Type
        dealType: body.dealType,

        // Location
        city: body.city,
        neighborhood: body.neighborhood || null,
        street: body.street || null,
        streetNumber: body.streetNumber || null,
        apartmentNumber: body.apartmentNumber || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,

        // Property Details
        propertyType: body.propertyType,
        floor: body.floor || null,
        parking: body.parking,
        position: body.position || null,
        furniture: body.furniture,
        directions: JSON.stringify(body.directions || []),
        kitchen: body.kitchen || null,

        // Measurements
        rooms: body.rooms,
        area: body.area,
        builtArea: body.builtArea || null,

        // Additional Info
        vacancyDate: body.vacancyDate || null,

        // Features
        hasAirConditioning: body.hasAirConditioning || false,
        hasDisabledAccess: body.hasDisabledAccess || false,
        hasSunBalcony: body.hasSunBalcony || false,
        hasStorage: body.hasStorage || false,
        hasSunroom: body.hasSunroom || false,
        hasBoiler: body.hasBoiler || false,
        hasSafeRoom: body.hasSafeRoom || false,
        hasElevator: body.hasElevator || false,

        // Display Info
        title: body.title,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice || null,
        images: JSON.stringify(body.images || []),
        status: body.status || null,
        location: body.location,

        // Compatibility fields
        bedrooms: body.bedrooms || body.rooms,
        bathrooms: body.bathrooms || 1,
        category: body.category || null,

        // Active status
        isActive: body.isActive !== undefined ? body.isActive : true,

        // Sold status
        isSold: body.isSold !== undefined ? body.isSold : false,

        // Pin status
        isPinned: body.isPinned !== undefined ? body.isPinned : false,
      },
    });

    return NextResponse.json(formatProperty(property));
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.property.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
