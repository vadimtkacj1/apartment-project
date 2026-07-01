import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

// GET all team members (including inactive for admin panel)
export async function GET(request: NextRequest) {
  try {
    // Admin-only: exposes inactive team members. Re-check independently of middleware.
    const denied = await requireAdmin();
    if (denied) return denied;

    const teamMembers = await prisma.teamMember.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch team members',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST - Create new team member
export async function POST(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();

    const teamMember = await prisma.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        image: body.image || null,
        phone: body.phone || null,
        mobile: body.mobile || null,
        whatsapp: body.whatsapp || null,
        fax: body.fax || null,
        email: body.email || null,
        licenceNumber: body.licenceNumber || null,
        description: body.description || null,
        order: body.order !== undefined ? body.order : 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
