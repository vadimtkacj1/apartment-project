import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted: vi.mock factories run before top-level statements, so the mock
// fns must be created in a hoisted block to be referenceable inside the factory.
const { findFirst, ownerFindMany, teamFindMany } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  ownerFindMany: vi.fn(),
  teamFindMany: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    property: { findFirst },
    owner: { findMany: ownerFindMany },
    teamMember: { findMany: teamFindMany },
  },
}));

import { getFullProperty } from '@/lib/property-detail';

// Minimal raw DB row (SQLite shape: JSON stored as strings, booleans as 0/1).
function dbRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    title: 'Nice flat',
    directions: '["north","south"]',
    images: '["/a.jpg","/b.jpg"]',
    agentIds: '[]',
    isActive: 1,
    isSold: 0,
    isPinned: 1,
    hasAirConditioning: 1,
    hasElevator: 1,
    hasPets: 0,
    hasDisabledAccess: 0,
    hasSunBalcony: 0,
    hasStorage: 0,
    hasSunroom: 0,
    hasBoiler: 0,
    hasSafeRoom: 0,
    hasMamak: 0,
    hasBars: 0,
    hasHousingUnit: 0,
    hasShelter: 0,
    isHotProposition: 0,
    isNoCommission: 0,
    ...overrides,
  };
}

describe('getFullProperty', () => {
  beforeEach(() => {
    findFirst.mockReset();
    ownerFindMany.mockReset();
    teamFindMany.mockReset();
    ownerFindMany.mockResolvedValue([]);
    teamFindMany.mockResolvedValue([]);
  });

  it('returns null for a NaN id without touching the DB', async () => {
    const res = await getFullProperty(Number.NaN);
    expect(res).toBeNull();
    expect(findFirst).not.toHaveBeenCalled();
  });

  it('returns null when no active property matches', async () => {
    findFirst.mockResolvedValue(null);
    const res = await getFullProperty(999);
    expect(res).toBeNull();
    expect(findFirst).toHaveBeenCalledWith({ where: { id: 999, isActive: true } });
  });

  it('parses JSON arrays and coerces SQLite 0/1 to real booleans', async () => {
    findFirst.mockResolvedValue(dbRow());
    const res = await getFullProperty(1);
    expect(res).not.toBeNull();
    expect(res!.directions).toEqual(['north', 'south']);
    expect(res!.images).toEqual(['/a.jpg', '/b.jpg']);
    expect(res!.isActive).toBe(true);
    expect(res!.isPinned).toBe(true);
    expect(res!.hasElevator).toBe(true);
    expect(res!.hasPets).toBe(false);
    expect(res!.isSold).toBe(false);
    // No agents linked -> empty contact arrays, no extra queries.
    expect(res!.owners).toEqual([]);
    expect(res!.agents).toEqual([]);
    expect(ownerFindMany).not.toHaveBeenCalled();
    expect(teamFindMany).not.toHaveBeenCalled();
  });

  it('falls back to [] for malformed JSON in array fields', async () => {
    findFirst.mockResolvedValue(dbRow({ directions: 'not-json', images: null }));
    const res = await getFullProperty(1);
    expect(res!.directions).toEqual([]);
    expect(res!.images).toEqual([]);
  });

  it('resolves prefixed owner/team agentIds, dedupes, and preserves order', async () => {
    findFirst.mockResolvedValue(
      dbRow({ agentIds: '["owner-2","team-5","owner-2","team-9"]' })
    );
    ownerFindMany.mockResolvedValue([
      { id: 2, name: 'Owner Two', phone: '050-111', whatsapp: '050-222', image: '/o2.jpg', isActive: true },
    ]);
    teamFindMany.mockResolvedValue([
      { id: 5, name: 'Team Five', mobile: '052-5', phone: '03-5', whatsapp: '052-w', image: '/t5.jpg' },
      { id: 9, name: 'Team Nine', mobile: null, phone: '03-9' },
    ]);

    const res = await getFullProperty(1);

    // Owner ids deduped to [2]; team ids [5,9].
    expect(ownerFindMany).toHaveBeenCalledWith({ where: { id: { in: [2] }, isActive: true } });
    expect(teamFindMany).toHaveBeenCalledWith({ where: { id: { in: [5, 9] }, isActive: true } });

    expect(res!.owners).toEqual([
      { id: 2, name: 'Owner Two', phone: '050-111', whatsapp: '050-222', image: '/o2.jpg' },
    ]);
    expect(res!.agents).toEqual([
      { id: 5, name: 'Team Five', phone: '052-5', whatsapp: '052-w', image: '/t5.jpg' },
      { id: 9, name: 'Team Nine', phone: '03-9', whatsapp: undefined, image: undefined },
    ]);
  });

  it('treats legacy numeric agentIds as team member ids', async () => {
    findFirst.mockResolvedValue(dbRow({ agentIds: '[3,4]' }));
    teamFindMany.mockResolvedValue([
      { id: 3, name: 'Team Three', mobile: '052-3' },
      { id: 4, name: 'Team Four', phone: '03-4' },
    ]);

    const res = await getFullProperty(1);

    expect(ownerFindMany).not.toHaveBeenCalled();
    expect(teamFindMany).toHaveBeenCalledWith({ where: { id: { in: [3, 4] }, isActive: true } });
    expect(res!.agents.map((a: { id: number }) => a.id)).toEqual([3, 4]);
    expect(res!.agents[0].phone).toBe('052-3'); // mobile preferred
    expect(res!.agents[1].phone).toBe('03-4'); // falls back to phone
  });

  it('falls back owner.phone to whatsapp when phone is empty', async () => {
    findFirst.mockResolvedValue(dbRow({ agentIds: '["owner-7"]' }));
    ownerFindMany.mockResolvedValue([
      { id: 7, name: 'Owner Seven', phone: '', whatsapp: '050-wa', image: null },
    ]);

    const res = await getFullProperty(1);
    expect(res!.owners[0].phone).toBe('050-wa');
    expect(res!.owners[0].image).toBeUndefined();
  });
});
