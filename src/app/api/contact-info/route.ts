import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET contact info (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const contactInfo = await prisma.contactInfo.findFirst({
      select: {
        phone: true,
        phoneLink: true,
        email: true,
        emailLink: true,
        address: true,
        city: true,
        latitude: true,
        longitude: true,
        mapUrl: true,
        weekdayHours: true,
        fridayHours: true,
        facebook: true,
        instagram: true,
        linkedin: true,
      },
    });

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
