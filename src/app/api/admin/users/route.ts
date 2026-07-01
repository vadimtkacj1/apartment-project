import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import bcrypt from 'bcryptjs';

// Never expose the password hash.
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

// GET all users (admin only)
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: SAFE_SELECT,
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST - create a user (admin only)
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const username = String(body.username || '').trim();
    const password = String(body.password || '');

    if (username.length < 3) {
      return NextResponse.json({ error: 'שם המשתמש חייב להכיל לפחות 3 תווים' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      return NextResponse.json({ error: 'שם המשתמש כבר קיים' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, 10),
        name: body.name || null,
        email: body.email || null,
        role: body.role === 'agent' ? 'agent' : 'admin',
        isActive: body.isActive !== false,
      },
      select: SAFE_SELECT,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
