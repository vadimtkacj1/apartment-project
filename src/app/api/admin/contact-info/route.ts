import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

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
    const denied = await requireAdmin();
    if (denied) return denied;

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
          phoneName: body.phoneName || null,
          phone2: body.phone2 || null,
          phoneLink2: body.phoneLink2 || null,
          phoneName2: body.phoneName2 || null,
          email: body.email,
          emailLink: body.emailLink,
          email2: body.email2 || null,
          emailLink2: body.emailLink2 || null,
          whatsapp: body.whatsapp || null,
          whatsappName: body.whatsappName || null,
          whatsapp2: body.whatsapp2 || null,
          whatsappName2: body.whatsappName2 || null,
          address: body.address,
          city: body.city,
          latitude: body.latitude || null,
          longitude: body.longitude || null,
          mapUrl: body.mapUrl || null,
          weekdayHours: body.weekdayHours,
          fridayHours: body.fridayHours,
          facebook: body.facebook || null,
          facebookName: body.facebookName || null,
          facebook2: body.facebook2 || null,
          facebookName2: body.facebookName2 || null,
          instagram: body.instagram || null,
          instagramName: body.instagramName || null,
          instagram2: body.instagram2 || null,
          instagramName2: body.instagramName2 || null,
          linkedin: body.linkedin || null,
        },
      });
    } else {
      // Create new contact info
      contactInfo = await prisma.contactInfo.create({
        data: {
          phone: body.phone,
          phoneLink: body.phoneLink,
          phoneName: body.phoneName || null,
          phone2: body.phone2 || null,
          phoneLink2: body.phoneLink2 || null,
          phoneName2: body.phoneName2 || null,
          email: body.email,
          emailLink: body.emailLink,
          email2: body.email2 || null,
          emailLink2: body.emailLink2 || null,
          whatsapp: body.whatsapp || null,
          whatsappName: body.whatsappName || null,
          whatsapp2: body.whatsapp2 || null,
          whatsappName2: body.whatsappName2 || null,
          address: body.address,
          city: body.city,
          latitude: body.latitude || null,
          longitude: body.longitude || null,
          mapUrl: body.mapUrl || null,
          weekdayHours: body.weekdayHours,
          fridayHours: body.fridayHours,
          facebook: body.facebook || null,
          facebookName: body.facebookName || null,
          facebook2: body.facebook2 || null,
          facebookName2: body.facebookName2 || null,
          instagram: body.instagram || null,
          instagramName: body.instagramName || null,
          instagram2: body.instagram2 || null,
          instagramName2: body.instagramName2 || null,
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
