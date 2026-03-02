import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single owner
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const owner = await prisma.owner.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(owner);
  } catch (error) {
    console.error('Error fetching owner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owner' },
      { status: 500 }
    );
  }
}

// PUT - Update owner
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const owner = await prisma.owner.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: body.name,
        title: body.title,
        image: body.image || null,
        phone: body.phone || null,
        email: body.email || null,
        whatsapp: body.whatsapp || null,
        description: body.description || null,
        order: body.order !== undefined ? body.order : 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(owner);
  } catch (error) {
    console.error('Error updating owner:', error);
    return NextResponse.json(
      { error: 'Failed to update owner' },
      { status: 500 }
    );
  }
}

// DELETE owner
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.owner.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting owner:', error);
    return NextResponse.json(
      { error: 'Failed to delete owner' },
      { status: 500 }
    );
  }
}
