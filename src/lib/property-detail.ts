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
    hasMamak: Boolean(property.hasMamak),
    hasBars: Boolean(property.hasBars),
    hasPets: Boolean(property.hasPets),
    hasHousingUnit: Boolean(property.hasHousingUnit),
    hasShelter: Boolean(property.hasShelter),
    isHotProposition: Boolean(property.isHotProposition),
    isNoCommission: Boolean(property.isNoCommission),
  };
}

export interface PropertyContact {
  id: number;
  name: string;
  phone: string;
  whatsapp?: string;
  image?: string;
}

// Full property in API shape (formatted + owners/agents), shared by the
// /api/properties/[id] route and the apartment detail page (SSR initial data).
export async function getFullProperty(id: number) {
  if (Number.isNaN(id)) return null;

  const property = await prisma.property.findFirst({
    where: {
      id,
      isActive: true,
    },
  });

  if (!property) return null;

  const formatted = formatProperty(property);

  // Fetch owners and agents (team members) for this property
  let owners: PropertyContact[] = [];
  let agents: PropertyContact[] = [];
  if (formatted.agentIds.length > 0) {
    // Separate owner IDs and team IDs
    const ownerIds: number[] = [];
    const teamIds: number[] = [];

    formatted.agentIds.forEach((agentId: string) => {
      if (agentId.startsWith('owner-')) {
        ownerIds.push(parseInt(agentId.replace('owner-', ''), 10));
      } else if (agentId.startsWith('team-')) {
        teamIds.push(parseInt(agentId.replace('team-', ''), 10));
      }
    });
    // Deduplicate while preserving order (e.g. ["owner-1","owner-2","owner-1"] -> [1,2])
    const seenOwner = new Set<number>();
    const seenTeam = new Set<number>();
    const dedupedOwnerIds = ownerIds.filter((oid) => {
      if (seenOwner.has(oid)) return false;
      seenOwner.add(oid);
      return true;
    });
    const dedupedTeamIds = teamIds.filter((tid) => {
      if (seenTeam.has(tid)) return false;
      seenTeam.add(tid);
      return true;
    });

    // Fetch owners and team members in parallel
    const [ownerRecords, teamMembers] = await Promise.all([
      dedupedOwnerIds.length > 0
        ? prisma.owner.findMany({ where: { id: { in: dedupedOwnerIds }, isActive: true } })
        : Promise.resolve([]),
      dedupedTeamIds.length > 0
        ? prisma.teamMember.findMany({ where: { id: { in: dedupedTeamIds }, isActive: true } })
        : Promise.resolve([]),
    ]);

    if (ownerRecords.length > 0) {
      const ownerMap = new Map(ownerRecords.map((o) => [o.id, o]));
      owners = dedupedOwnerIds
        .map((oid) => ownerMap.get(oid))
        .filter(Boolean)
        .map((o) => ({
          id: o!.id,
          name: o!.name,
          phone: o!.phone || o!.whatsapp || '',
          whatsapp: o!.whatsapp ?? undefined,
          image: o!.image ?? undefined,
        }));
    }

    if (teamMembers.length > 0) {
      agents = teamMembers.map((t) => ({
        id: t.id,
        name: t.name,
        phone: t.mobile || t.phone || '',
        whatsapp: (t as { whatsapp?: string | null }).whatsapp ?? undefined,
        image: (t as { image?: string | null }).image ?? undefined,
      }));
    }
  }

  return { ...formatted, owners, agents };
}
