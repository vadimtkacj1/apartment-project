import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET contact info
export async function GET(request: NextRequest) {
  try {
    const contactInfo = await prisma.contactInfo.findFirst();

    if (!contactInfo) {
      return NextResponse.json(null);
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    );
  }
}

// POST - Create or Update contact info
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if contact info already exists
    const existing = await prisma.contactInfo.findFirst();

    let contactInfo;

    if (existing) {
      // Update existing contact info
      contactInfo = await prisma.contactInfo.update({
        where: {
          id: existing.id,
        },
        data: {
          phone: body.phone,
          phoneLink: body.phoneLink,
          email: body.email,
          emailLink: body.emailLink,
          address: body.address,
          city: body.city,
          latitude: body.latitude || null,
          longitude: body.longitude || null,
          mapUrl: body.mapUrl || null,
          weekdayHours: body.weekdayHours,
          fridayHours: body.fridayHours,
          facebook: body.facebook || null,
          instagram: body.instagram || null,
          linkedin: body.linkedin || null,
        },
      });
    } else {
      // Create new contact info
      contactInfo = await prisma.contactInfo.create({
        data: {
          phone: body.phone,
          phoneLink: body.phoneLink,
          email: body.email,
          emailLink: body.emailLink,
          address: body.address,
          city: body.city,
          latitude: body.latitude || null,
          longitude: body.longitude || null,
          mapUrl: body.mapUrl || null,
          weekdayHours: body.weekdayHours,
          fridayHours: body.fridayHours,
          facebook: body.facebook || null,
          instagram: body.instagram || null,
          linkedin: body.linkedin || null,
        },
      });
    }

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error saving contact info:', error);
    return NextResponse.json(
      { error: 'Failed to save contact info' },
      { status: 500 }
    );
  }
}
