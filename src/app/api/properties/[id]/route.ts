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

function parseAgentIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    if (!Array.isArray(arr)) return [];

    // Support both old format (numbers) and new format (strings with prefixes)
    return arr.map((x: any) => {
      if (typeof x === 'string') return x; // New format: "owner-1", "team-2"
      if (typeof x === 'number') return `team-${x}`; // Old format: convert to team
      return null;
    }).filter(Boolean) as string[];
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
    isHotProposition: Boolean(property.isHotProposition),
    isNoCommission: Boolean(property.isNoCommission),
  };
}

// GET single property (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findFirst({
      where: {
        id: parseInt(id),
        isActive: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const formatted = formatProperty(property);

    // Fetch agents (owners and team members) for this property
    let agents: Array<{ id: number; name: string; phone: string; whatsapp?: string }> = [];
    if (formatted.agentIds.length > 0) {
      // Separate owner IDs and team IDs
      const ownerIds: number[] = [];
      const teamIds: number[] = [];

      formatted.agentIds.forEach((id: string) => {
        if (id.startsWith('owner-')) {
          ownerIds.push(parseInt(id.replace('owner-', ''), 10));
        } else if (id.startsWith('team-')) {
          teamIds.push(parseInt(id.replace('team-', ''), 10));
        }
      });

      // Fetch owners
      if (ownerIds.length > 0) {
        const owners = await prisma.owner.findMany({
          where: { id: { in: ownerIds }, isActive: true },
        });
        agents.push(...owners.map((o) => ({
          id: o.id,
          name: o.name,
          phone: o.phone || '',
          whatsapp: o.whatsapp ?? undefined,
        })));
      }

      // Fetch team members
      if (teamIds.length > 0) {
        const teamMembers = await prisma.teamMember.findMany({
          where: { id: { in: teamIds }, isActive: true },
        });
        agents.push(...teamMembers.map((t) => ({
          id: t.id,
          name: t.name,
          phone: t.mobile || t.phone || '',
          whatsapp: (t as { whatsapp?: string | null }).whatsapp ?? undefined,
        })));
      }
    }

    return NextResponse.json({ ...formatted, agents });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}
