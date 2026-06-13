import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'

/**
 * Defense-in-depth authorization guard for route handlers.
 *
 * `middleware.ts` already blocks unauthenticated requests to `/api/admin/*` at
 * the edge, but every sensitive handler should re-check independently so a
 * single misconfigured matcher can never expose data-mutating endpoints.
 *
 * Returns `null` when the caller is an authenticated admin, or a ready-to-return
 * 401 `NextResponse` otherwise:
 *
 *   const denied = await requireAdmin()
 *   if (denied) return denied
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions)
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!session?.user || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}
