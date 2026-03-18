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

function parseAgentIds(value: string | null): number[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    return Array.isArray(arr) ? arr.map((x: any) => parseInt(String(x), 10)).filter((n) => !isNaN(n)) : [];
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
    agentIds: parseAgentIds(property.agentIds),
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
    console.log('💾 [DB] Received request to create property');
    const body = await request.json();

    console.log('📝 [DB] Data to save:');
    console.log('   - Title:', body.title);
    console.log('   - Images array:', body.images);
    console.log('   - Images count:', body.images?.length || 0);
    if (body.images && body.images.length > 0) {
      console.log('   - First image:', body.images[0]);
      console.log('   - Last image:', body.images[body.images.length - 1]);
    }

    const imagesJson = JSON.stringify(body.images || []);
    console.log('🔄 [DB] Images converted to JSON:', imagesJson);

    const agentIds = Array.isArray(body.agentIds) ? body.agentIds : [];
    if (agentIds.length < 1) {
      return NextResponse.json(
        { error: 'יש לבחור לפחות סוכן אחד' },
        { status: 400 }
      );
    }
    const agentIdsJson = JSON.stringify(agentIds);

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
        totalFloors: body.totalFloors || null,
        parking: body.parking,
        position: body.position || null,
        furniture: body.furniture,
        directions: JSON.stringify(body.directions || []),
        kitchen: body.kitchen || null,

        // Measurements
        rooms: body.rooms,
        area: body.area,
        builtArea: body.builtArea || null,
        balconySize: body.balconySize || null,

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
        hasMamak: body.hasMamak || false,
        hasBars: body.hasBars || false,
        hasPets: body.hasPets || false,
        hasHousingUnit: body.hasHousingUnit || false,
        hasShelter: body.hasShelter || false,

        // Display Info
        title: body.title,
        description: body.description,
        price: body.price,
        originalPrice: body.originalPrice || null,
        images: imagesJson,
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

        // Homepage section flags
        isHotProposition: body.isHotProposition !== undefined ? body.isHotProposition : false,
        isNoCommission: body.isNoCommission !== undefined ? body.isNoCommission : false,

        // Agents
        agentIds: agentIdsJson,
      },
    });

    console.log('✅ [DB] Property created successfully! ID:', property.id);
    console.log('   - Saved images count:', parseJsonArray(property.images).length);
    console.log('   - Images in DB:', property.images);

    const formatted = formatProperty(property);
    console.log('🎉 [DB] Property formatted and ready to send');
    console.log('   - Images in response:', formatted.images);

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('❌ [DB] Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
