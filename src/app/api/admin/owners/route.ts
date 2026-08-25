import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { revalidateSite } from '@/lib/revalidate-public';

// GET all owners (including inactive for admin panel)
export async function GET(request: NextRequest) {
  try {
    // Admin-only: exposes inactive owners. Re-check independently of middleware.
    const denied = await requireAdmin();
    if (denied) return denied;

    const owners = await prisma.owner.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(owners);
  } catch (error: any) {
    console.error('Error fetching owners:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch owners',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create new owner
export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();

    const owner = await prisma.owner.create({
      data: {
        name: body.name,
        title: body.title,
        image: body.image || null,
        phone: body.phone || null,
        email: body.email || null,
        whatsapp: body.whatsapp || null,
        licenceNumber: body.licenceNumber || null,
        description: body.description || null,
        order: body.order !== undefined ? body.order : 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    revalidateSite();

    return NextResponse.json(owner, { status: 201 });
  } catch (error) {
    console.error('Error creating owner:', error);
    return NextResponse.json(
      { error: 'Failed to create owner' },
      { status: 500 }
    );
  }
}
