import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next-auth's session reader and the auth options module so this guard can
// be tested in isolation (no DB / provider wiring loaded). `vi.hoisted` is
// required because vi.mock factories run before top-level statements.
const { getServerSession } = vi.hoisted(() => ({ getServerSession: vi.fn() }));
vi.mock('next-auth', () => ({ getServerSession }));
vi.mock('@/lib/auth', () => ({ authOptions: {} }));

import { requireAdmin } from '@/lib/require-admin';

describe('requireAdmin', () => {
  beforeEach(() => {
    getServerSession.mockReset();
  });

  it('returns null (allows) for an authenticated admin', async () => {
    getServerSession.mockResolvedValue({ user: { name: 'A', role: 'admin' } });
    const res = await requireAdmin();
    expect(res).toBeNull();
  });

  it('returns 401 when there is no session', async () => {
    getServerSession.mockResolvedValue(null);
    const res = await requireAdmin();
    expect(res).not.toBeNull();
    expect(res!.status).toBe(401);
    await expect(res!.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('returns 401 when the user exists but role is not admin', async () => {
    getServerSession.mockResolvedValue({ user: { name: 'A', role: 'editor' } });
    const res = await requireAdmin();
    expect(res!.status).toBe(401);
  });

  it('returns 401 when the user has no role at all', async () => {
    getServerSession.mockResolvedValue({ user: { name: 'A' } });
    const res = await requireAdmin();
    expect(res!.status).toBe(401);
  });
});
