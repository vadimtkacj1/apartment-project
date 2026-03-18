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

    // Fetch owners and agents (team members) for this property
    let owners: Array<{ id: number; name: string; phone: string; whatsapp?: string }> = [];
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
      // Deduplicate while preserving order (e.g. ["owner-1","owner-2","owner-1"] -> [1,2])
      const seenOwner = new Set<number>();
      const seenTeam = new Set<number>();
      const dedupedOwnerIds = ownerIds.filter((id) => {
        if (seenOwner.has(id)) return false;
        seenOwner.add(id);
        return true;
      });
      const dedupedTeamIds = teamIds.filter((id) => {
        if (seenTeam.has(id)) return false;
        seenTeam.add(id);
        return true;
      });

      // Fetch owners (for contact form "call directly"), preserve order from agentIds
      if (dedupedOwnerIds.length > 0) {
        const ownerRecords = await prisma.owner.findMany({
          where: { id: { in: dedupedOwnerIds }, isActive: true },
        });
        const ownerMap = new Map(ownerRecords.map((o) => [o.id, o]));
        owners = dedupedOwnerIds
          .map((id) => ownerMap.get(id))
          .filter(Boolean)
          .map((o) => ({
            id: o!.id,
            name: o!.name,
            phone: o!.phone || o!.whatsapp || '',
            whatsapp: o!.whatsapp ?? undefined,
          }));
      }

      // Fetch team members (for PropertyAgentBlock)
      if (dedupedTeamIds.length > 0) {
        const teamMembers = await prisma.teamMember.findMany({
          where: { id: { in: dedupedTeamIds }, isActive: true },
        });
        agents = teamMembers.map((t) => ({
          id: t.id,
          name: t.name,
          phone: t.mobile || t.phone || '',
          whatsapp: (t as { whatsapp?: string | null }).whatsapp ?? undefined,
        }));
      }
    }

    return NextResponse.json({ ...formatted, owners, agents });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}
