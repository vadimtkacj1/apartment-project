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
    console.log('🔄 [DB UPDATE] Обновление property ID:', id);

    const body = await request.json();
    console.log('📝 [DB UPDATE] Данные для обновления:');
    console.log('   - Title:', body.title);
    console.log('   - Images array:', body.images);
    console.log('   - Images count:', body.images?.length || 0);
    if (body.images && body.images.length > 0) {
      console.log('   - Images:');
      body.images.forEach((img: string, idx: number) => {
        console.log(`     ${idx + 1}. ${img}`);
      });
    }

    // If property is being marked as sold, clear hot proposition and no commission flags
    const isSold = body.isSold !== undefined ? body.isSold : false;
    const isHotProposition = isSold ? false : (body.isHotProposition !== undefined ? body.isHotProposition : false);
    const isNoCommission = isSold ? false : (body.isNoCommission !== undefined ? body.isNoCommission : false);

    const imagesJson = JSON.stringify(body.images || []);
    console.log('🔄 [DB UPDATE] Images преобразованы в JSON:', imagesJson);

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
        isSold: isSold,

        // Pin status
        isPinned: body.isPinned !== undefined ? body.isPinned : false,

        // Homepage section flags - automatically clear if sold
        isHotProposition: isHotProposition,
        isNoCommission: isNoCommission,
      },
    });

    console.log('✅ [DB UPDATE] Property обновлён успешно! ID:', property.id);
    console.log('   - Изображений в БД:', property.images);

    const formatted = formatProperty(property);
    console.log('🎉 [DB UPDATE] Property форматирован для ответа');
    console.log('   - Images count:', formatted.images?.length || 0);
    console.log('   - Images:', formatted.images);

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('❌ [DB UPDATE] Ошибка обновления property:', error);
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
