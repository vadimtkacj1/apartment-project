import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

// Same parsing rules as property-detail: legacy numeric ids mean team members
function parseAgentIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((x: any) => {
        if (typeof x === 'string') return x;
        if (typeof x === 'number') return `team-${x}`;
        return null;
      })
      .filter(Boolean) as string[];
  } catch {
    return [];
  }
}

// GET all team members (including inactive for admin panel)
export async function GET(request: NextRequest) {
  try {
    // Admin-only: exposes inactive team members. Re-check independently of middleware.
    const denied = await requireAdmin();
    if (denied) return denied;

    const [teamMembers, properties] = await Promise.all([
      prisma.teamMember.findMany({
        orderBy: {
          order: 'asc',
        },
      }),
      prisma.property.findMany({
        where: { isActive: true },
        select: { agentIds: true, isSold: true },
      }),
    ]);

    // Per-agent property counts: total assigned + how many of those are sold
    const totals = new Map<string, { properties: number; sold: number }>();
    for (const property of properties) {
      for (const agentId of parseAgentIds(property.agentIds)) {
        const entry = totals.get(agentId) || { properties: 0, sold: 0 };
        entry.properties += 1;
        if (property.isSold) entry.sold += 1;
        totals.set(agentId, entry);
      }
    }

    const withCounts = teamMembers.map((member) => {
      const entry = totals.get(`team-${member.id}`);
      return {
        ...member,
        propertiesCount: entry?.properties ?? 0,
        soldCount: entry?.sold ?? 0,
      };
    });

    return NextResponse.json(withCounts);
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
