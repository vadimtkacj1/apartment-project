import { prisma } from '@/lib/prisma';

/**
 * Admin activity notifications.
 *
 * The only event so far is "an agent closed a sale": when a property's isSold
 * flips on, one row is written per assigned agent (name and title snapshotted,
 * so the entry survives a later rename or deletion). Writing a notification is
 * always best-effort — saving the property must never fail because the feed
 * could not be written.
 */

export const NOTIFICATION_PROPERTY_SOLD = 'property_sold';

/** Same rules as property-detail: legacy numeric ids mean team members. */
export function parseAgentIds(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry: unknown) => {
        if (typeof entry === 'string') return entry;
        if (typeof entry === 'number') return `team-${entry}`;
        return null;
      })
      .filter((entry): entry is string => Boolean(entry));
  } catch {
    return [];
  }
}

/** 'team-3' → the team member's name; 'owner-2' → the owner's name. */
async function resolveAgentName(agentId: string): Promise<string | null> {
  const [kind, rawId] = agentId.split('-');
  const id = Number(rawId);
  if (!Number.isFinite(id)) return null;

  try {
    if (kind === 'team') {
      const member = await prisma.teamMember.findUnique({ where: { id }, select: { name: true } });
      return member?.name ?? null;
    }
    if (kind === 'owner') {
      const owner = await prisma.owner.findUnique({ where: { id }, select: { name: true } });
      return owner?.name ?? null;
    }
  } catch {
    /* the notification is still worth writing without a name */
  }
  return null;
}

export interface SoldPropertyInput {
  id: number;
  title?: string | null;
  agentIds?: string | null;
}

/**
 * Records one "sold" notification per agent assigned to the property (and a
 * single agent-less entry when nobody is assigned). Never throws.
 */
export async function recordPropertySold(property: SoldPropertyInput): Promise<void> {
  try {
    const agentIds = parseAgentIds(property.agentIds);
    const propertyTitle = property.title ?? null;

    if (agentIds.length === 0) {
      await prisma.notification.create({
        data: {
          type: NOTIFICATION_PROPERTY_SOLD,
          propertyId: property.id,
          propertyTitle,
        },
      });
      return;
    }

    const agents = await Promise.all(
      agentIds.map(async (agentId) => ({ agentId, agentName: await resolveAgentName(agentId) }))
    );

    await prisma.notification.createMany({
      data: agents.map(({ agentId, agentName }) => ({
        type: NOTIFICATION_PROPERTY_SOLD,
        agentId,
        agentName,
        propertyId: property.id,
        propertyTitle,
      })),
    });
  } catch (error) {
    console.error('Failed to record sold notification:', error);
  }
}
