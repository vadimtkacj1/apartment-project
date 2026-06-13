import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export async function DELETE(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();
    const { type } = body; // 'all' | 'views' | 'clicks'

    if (type === 'all') {
      // Delete all analytics
      await prisma.clickEvent.deleteMany({});
      await prisma.propertyView.deleteMany({});
    } else if (type === 'views') {
      await prisma.propertyView.deleteMany({});
    } else if (type === 'clicks') {
      await prisma.clickEvent.deleteMany({});
    } else {
      return NextResponse.json(
        { error: 'Invalid type parameter' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to delete analytics' },
      { status: 500 }
    );
  }
}

