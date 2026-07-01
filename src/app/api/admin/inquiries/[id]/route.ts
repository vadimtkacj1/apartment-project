import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

const STATUSES = ['new', 'in_progress', 'closed'];

// PATCH - update status / notes / assigned agent
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();

    const data: { status?: string; notes?: string | null; agentId?: string | null } = {};
    if (typeof body.status === 'string' && STATUSES.includes(body.status)) {
      data.status = body.status;
    }
    if (body.notes !== undefined) {
      data.notes = body.notes === null || body.notes === '' ? null : String(body.notes);
    }
    if (body.agentId !== undefined) {
      data.agentId = body.agentId === null || body.agentId === '' ? null : String(body.agentId);
    }

    const updated = await prisma.inquiry.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

// DELETE an inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    await prisma.inquiry.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
