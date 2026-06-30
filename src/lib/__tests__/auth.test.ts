import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

// vi.hoisted: needed because vi.mock factories are hoisted above top-level code.
const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock('@/lib/prisma', () => ({
  prisma: { user: { findUnique } },
}));

import { authOptions } from '@/lib/auth';

// In next-auth v4 the real `authorize` lives under `provider.options` — the
// top-level `provider.authorize` is just a sync `() => null` stub. Prefer the
// options copy and fall back to the top level for forward-compatibility.
const provider = authOptions.providers[0] as any;
const authorize = (provider.options?.authorize ?? provider.authorize).bind(provider);

const hashed = bcrypt.hashSync('correct-horse', 8);

const adminUser = {
  id: 'u1',
  username: 'admin',
  password: hashed,
  name: 'Admin',
  email: 'admin@example.com',
  role: 'admin',
};

// Unique IP per call keeps the real rate limiter from bleeding across tests.
let ipSeed = 0;
const reqFor = (ip = `10.0.0.${ipSeed++}`) => ({ headers: { 'x-forwarded-for': ip } });

describe('authOptions.authorize', () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it('returns a sanitized user on valid credentials', async () => {
    findUnique.mockResolvedValue(adminUser);
    const result = await authorize({ username: 'admin', password: 'correct-horse' }, reqFor());
    expect(result).toMatchObject({
      id: 'u1',
      username: 'admin',
      role: 'admin',
      name: 'Admin',
      email: 'admin@example.com',
    });
    // Password must never be returned to the session layer.
    expect(result).not.toHaveProperty('password');
  });

  it('returns null for a wrong password', async () => {
    findUnique.mockResolvedValue(adminUser);
    const result = await authorize({ username: 'admin', password: 'wrong' }, reqFor());
    expect(result).toBeNull();
  });

  it('returns null when the user does not exist', async () => {
    findUnique.mockResolvedValue(null);
    const result = await authorize({ username: 'ghost', password: 'whatever' }, reqFor());
    expect(result).toBeNull();
  });

  it('returns null when username or password is missing', async () => {
    expect(await authorize({ username: '', password: 'x' }, reqFor())).toBeNull();
    expect(await authorize({ username: 'admin', password: '' }, reqFor())).toBeNull();
    expect(await authorize({}, reqFor())).toBeNull();
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('trims the username before the DB lookup', async () => {
    findUnique.mockResolvedValue(adminUser);
    await authorize({ username: '  admin  ', password: 'correct-horse' }, reqFor());
    expect(findUnique).toHaveBeenCalledWith({ where: { username: 'admin' } });
  });

  it('falls back name to username when name is null', async () => {
    findUnique.mockResolvedValue({ ...adminUser, name: null });
    const result = await authorize({ username: 'admin', password: 'correct-horse' }, reqFor());
    expect(result.name).toBe('admin');
  });

  it('throttles brute-force attempts from the same IP', async () => {
    findUnique.mockResolvedValue(adminUser);
    const ip = '203.0.113.7';
    // Limit is 10 per window; the 11th attempt should be rejected.
    for (let i = 0; i < 10; i++) {
      await authorize({ username: 'admin', password: 'wrong' }, reqFor(ip));
    }
    await expect(
      authorize({ username: 'admin', password: 'correct-horse' }, reqFor(ip))
    ).rejects.toThrow(/too many login attempts/i);
  });
});

describe('authOptions callbacks', () => {
  it('jwt copies role/username from the user onto the token', async () => {
    const token = await authOptions.callbacks!.jwt!({
      token: {},
      user: { role: 'admin', username: 'admin' } as any,
    } as any);
    expect(token).toMatchObject({ role: 'admin', username: 'admin' });
  });

  it('jwt leaves the token untouched when there is no user', async () => {
    const token = await authOptions.callbacks!.jwt!({
      token: { role: 'editor', username: 'ed' },
      user: undefined,
    } as any);
    expect(token).toMatchObject({ role: 'editor', username: 'ed' });
  });

  it('session projects token role/username onto session.user', async () => {
    const session = await authOptions.callbacks!.session!({
      session: { user: { name: 'A' } },
      token: { role: 'admin', username: 'admin' },
    } as any);
    expect((session.user as any).role).toBe('admin');
    expect((session.user as any).username).toBe('admin');
  });
});
