import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all owners (including inactive for admin panel)
export async function GET(request: NextRequest) {
  try {
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
    const body = await request.json();

    const owner = await prisma.owner.create({
      data: {
        name: body.name,
        title: body.title,
        image: body.image || null,
        phone: body.phone || null,
        email: body.email || null,
        description: body.description || null,
        order: body.order !== undefined ? body.order : 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(owner, { status: 201 });
  } catch (error) {
    console.error('Error creating owner:', error);
    return NextResponse.json(
      { error: 'Failed to create owner' },
      { status: 500 }
    );
  }
}
