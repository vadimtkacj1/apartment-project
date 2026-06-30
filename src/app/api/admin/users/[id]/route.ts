import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { authOptions } from '@/lib/auth';

const SAFE_SELECT = {
  id: true,
  username: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

const activeAdminCount = () =>
  prisma.user.count({ where: { role: 'admin', isActive: true } });

async function currentUsername(): Promise<string | undefined> {
  const session = await getServerSession(authOptions);
  return (session?.user as { username?: string } | undefined)?.username;
}

// PATCH - update name / email / role / isActive / password (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const body = await request.json();

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Never let the last active admin be demoted or deactivated → lockout safety.
    const willDemote = body.role && body.role !== 'admin' && target.role === 'admin';
    const willDeactivate = body.isActive === false && target.isActive && target.role === 'admin';
    if ((willDemote || willDeactivate) && (await activeAdminCount()) <= 1) {
      return NextResponse.json(
        { error: 'לא ניתן להשבית או לשנות את המנהל הפעיל האחרון' },
        { status: 400 }
      );
    }

    const data: {
      name?: string | null;
      email?: string | null;
      role?: string;
      isActive?: boolean;
      password?: string;
    } = {};
    if (body.name !== undefined) data.name = body.name || null;
    if (body.email !== undefined) data.email = body.email || null;
    if (body.role === 'admin' || body.role === 'agent') data.role = body.role;
    if (body.isActive !== undefined) data.isActive = !!body.isActive;
    if (body.password) {
      if (String(body.password).length < 6) {
        return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 });
      }
      data.password = await bcrypt.hash(String(body.password), 10);
    }

    const updated = await prisma.user.update({ where: { id }, data, select: SAFE_SELECT });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE a user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const me = await currentUsername();
    if (me && me === target.username) {
      return NextResponse.json({ error: 'אי אפשר למחוק את המשתמש שלך' }, { status: 400 });
    }
    if (target.role === 'admin' && (await activeAdminCount()) <= 1) {
      return NextResponse.json({ error: 'לא ניתן למחוק את המנהל האחרון' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
