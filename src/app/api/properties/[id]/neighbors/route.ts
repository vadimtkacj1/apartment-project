import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id);

    const current = await prisma.property.findUnique({
      where: { id: numericId, isActive: true },
      select: { id: true, createdAt: true },
    });

    if (!current) {
      return NextResponse.json({ previousId: null, nextId: null });
    }

    // Properties are listed newest-first (createdAt DESC).
    // "Previous" = one step newer  → createdAt > current, order ASC LIMIT 1
    // "Next"     = one step older  → createdAt < current, order DESC LIMIT 1
    const [previousProp, nextProp] = await Promise.all([
      prisma.property.findFirst({
        where: { isActive: true, createdAt: { gt: current.createdAt } },
        orderBy: { createdAt: 'asc' },
        select: { id: true },
      }),
      prisma.property.findFirst({
        where: { isActive: true, createdAt: { lt: current.createdAt } },
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      }),
    ]);

    const response = NextResponse.json({
      previousId: previousProp?.id ?? null,
      nextId: nextProp?.id ?? null,
    });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return response;
  } catch (error) {
    console.error('Error fetching property neighbors:', error);
    return NextResponse.json({ previousId: null, nextId: null });
  }
}
