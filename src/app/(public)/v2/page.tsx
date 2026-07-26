import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import V2Home, {
  type V2Property,
  type V2SoldItem,
  type V2Neighborhood,
  type V2Counts,
} from '@/components/v2/V2Home';

/* Alternative "Aiterra Editorial" frontend (design v2 preview route).
   Same data source as the main homepage — different art direction.
   All numbers on the page are computed live from the DB. */

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Aiterra — Editorial',
  robots: { index: false, follow: false }, // preview route — keep out of the index
};

const FRESH_MS = 14 * 24 * 60 * 60 * 1000; // «חדש» badge window

function firstImage(val: string | null | undefined): string {
  if (!val) return '/images/hero/sales.jpg';
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) && arr[0] ? arr[0] : '/images/hero/sales.jpg';
  } catch {
    return '/images/hero/sales.jpg';
  }
}

// Mirrors the catalog mapping: category has priority over dealType.
function resolveDealType(dealType: string, category?: string | null): 'sale' | 'rent' {
  return category === 'rentals' || dealType === 'rent' ? 'rent' : 'sale';
}

export default async function V2Page() {
  const activeWhere = { isActive: true, isSold: false } as const;

  const [propsRaw, totalCount, rentCount, hoodGroups, soldRaw, owner] = await Promise.all([
    prisma.property.findMany({
      where: activeWhere,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      select: {
        id: true, title: true, location: true, neighborhood: true, price: true,
        rooms: true, area: true, floor: true, dealType: true, category: true,
        images: true, createdAt: true,
      },
    }),
    prisma.property.count({ where: activeWhere }),
    prisma.property.count({
      where: { ...activeWhere, OR: [{ dealType: 'rent' }, { category: 'rentals' }] },
    }),
    prisma.property.groupBy({
      by: ['neighborhood', 'city'],
      where: { ...activeWhere, neighborhood: { not: null } },
      _count: true,
    }),
    prisma.property.findMany({
      where: { isActive: true, isSold: true },
      orderBy: { updatedAt: 'desc' },
      take: 3,
      select: { id: true, title: true, location: true, neighborhood: true, images: true },
    }),
    prisma.owner.findFirst({
      where: { isActive: true, phone: { not: null } },
      orderBy: { order: 'asc' },
      select: { phone: true },
    }).catch(() => null),
  ]);

  const now = Date.now();
  const properties: V2Property[] = propsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    location: p.location,
    neighborhood: p.neighborhood,
    price: p.price,
    rooms: p.rooms,
    area: p.area,
    floor: p.floor,
    dealType: resolveDealType(p.dealType, p.category),
    image: firstImage(p.images),
    isNew: now - p.createdAt.getTime() < FRESH_MS,
  }));

  const counts: V2Counts = {
    total: totalCount,
    rent: rentCount,
    sale: Math.max(totalCount - rentCount, 0),
  };

  const neighborhoods: V2Neighborhood[] = hoodGroups
    .filter((g) => g.neighborhood)
    .sort((a, b) => b._count - a._count)
    .slice(0, 6)
    .map((g) => ({ name: g.neighborhood as string, city: g.city, count: g._count }));

  const sold: V2SoldItem[] = soldRaw.map((s) => ({
    id: s.id,
    title: s.title,
    location: s.location,
    neighborhood: s.neighborhood,
    image: firstImage(s.images),
  }));

  return (
    <V2Home
      properties={properties}
      counts={counts}
      neighborhoods={neighborhoods}
      sold={sold}
      phone={owner?.phone ?? null}
    />
  );
}
