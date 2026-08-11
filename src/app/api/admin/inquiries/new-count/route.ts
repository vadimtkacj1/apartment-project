import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

// GET count of new (unhandled) inquiries — feeds the sidebar badge.
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const count = await prisma.inquiry.count({ where: { status: 'new' } });
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting new inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to count inquiries' },
      { status: 500 }
    );
  }
}
