import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/**
 * Recent admin activity (currently: agents closing sales). Admin-only — the
 * feed names staff and listings.
 */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const rawLimit = Number(searchParams.get('limit'));
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;

    const notifications = await prisma.notification.findMany({
      where: type ? { type } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    // A missing table (schema not pushed yet) must not break the dashboard.
    console.error('Error reading notifications:', error);
    return NextResponse.json([]);
  }
}

/** Marks notifications as read — `{ ids: [1,2] }` or `{ all: true }`. */
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json().catch(() => ({}));
    const ids = Array.isArray(body?.ids)
      ? body.ids.filter((id: unknown): id is number => Number.isInteger(id))
      : null;

    if (!body?.all && (!ids || ids.length === 0)) {
      return NextResponse.json({ error: 'Provide ids[] or all:true' }, { status: 400 });
    }

    const result = await prisma.notification.updateMany({
      where: { readAt: null, ...(ids && ids.length > 0 ? { id: { in: ids } } : {}) },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ success: true, updated: result.count });
  } catch (error) {
    console.error('Error marking notifications read:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
