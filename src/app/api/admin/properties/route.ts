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

// Helper to convert property from DB format (JSON strings) to API format (arrays)
function formatProperty(property: any) {
  return {
    ...property,
    directions: parseJsonArray(property.directions),
    images: parseJsonArray(property.images),
  };
}

// GET all properties
export async function GET(request: NextRequest) {
  try {
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(properties.map(formatProperty));
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch properties',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const property = await prisma.property.create({
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

    return NextResponse.json(formatProperty(property), { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
