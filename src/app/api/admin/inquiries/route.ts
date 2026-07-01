import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

// GET all inquiries (newest first). Admin only — contains visitor PII.
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { id: true, title: true, location: true } },
      },
    });
    return NextResponse.json(inquiries);
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
