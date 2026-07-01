import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // Fallback
  return 'unknown';
}

// Helper function to generate session ID from IP and User-Agent
function generateSessionId(ip: string, userAgent: string | null): string {
  const combined = `${ip}-${userAgent || 'no-ua'}`;
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Fold a raw referer URL into a small set of acquisition buckets. Our own domain
// (and localhost) is intra-site navigation, not a source; a missing referer = direct.
function classifyReferer(referer: string | null): string {
  if (!referer) return 'direct';
  let host = referer.toLowerCase();
  try { host = new URL(referer).hostname.toLowerCase(); } catch { /* keep raw */ }
  if (host.includes('ram-haim') || host.includes('localhost') || host.includes('127.0.0.1')) return 'internal';
  if (host.includes('google')) return 'google';
  if (host.includes('facebook') || host.includes('fb.')) return 'facebook';
  if (host.includes('instagram')) return 'instagram';
  if (host.includes('yad2')) return 'yad2';
  if (host.includes('madlan')) return 'madlan';
  if (host.includes('whatsapp') || host.includes('wa.me')) return 'whatsapp';
  if (host.includes('bing')) return 'bing';
  if (host.includes('duckduckgo')) return 'duckduckgo';
  if (host.includes('t.co') || host.includes('twitter') || host === 'x.com' || host.endsWith('.x.com')) return 'twitter';
  return 'other';
}

export async function POST(request: NextRequest) {
  try {
    // Throttle unauthenticated writes so the events tables can't be flooded.
    const limit = rateLimit(`analytics:${getClientIp(request)}`, 60, 60_000);
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const body = await request.json();
    const {
      eventType,
      propertyId,
      elementId,
      elementType,
      url,
      sessionId: providedSessionId,
    } = body;

    if (!eventType) {
      return NextResponse.json(
        { error: 'eventType is required' },
        { status: 400 }
      );
    }

    // Get client information
    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;
    
    // Generate or use provided session ID
    const sessionId = providedSessionId || generateSessionId(ipAddress, userAgent);

    // Extract metadata
    const metadata = body.metadata ? JSON.stringify(body.metadata) : null;

    // Track property view
    if (eventType === 'property_view' && propertyId) {
      await prisma.propertyView.create({
        data: {
          propertyId: parseInt(propertyId),
          ipAddress,
          userAgent,
          referer,
          sessionId,
          country: body.country || null,
          city: body.city || null,
          region: body.region || null,
        },
      });
    }

    // Track click events
    if (eventType.startsWith('click_') || eventType === 'contact_form') {
      await prisma.clickEvent.create({
        data: {
          propertyId: propertyId ? parseInt(propertyId) : null,
          eventType,
          elementId: elementId || null,
          elementType: elementType || null,
          url: url || null,
          ipAddress,
          userAgent,
          referer,
          sessionId,
          country: body.country || null,
          city: body.city || null,
          region: body.region || null,
          metadata,
        },
      });
    }

    return NextResponse.json({
      success: true,
      sessionId, // Return session ID for client to store
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve analytics (for admin)
export async function GET(request: NextRequest) {
  try {
    // Returns IP addresses, user agents and other visitor PII — admin only.
    const denied = await requireAdmin();
    if (denied) return denied;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'views' | 'clicks' | 'summary'
    const propertyId = searchParams.get('propertyId');
    const ipAddress = searchParams.get('ipAddress');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (type === 'summary') {
      // Real lead/inquiry stats — from the Inquiry table (actual submitted
      // contact forms), accurate unlike the old clickEvent-derived "פניות".
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      // Sparkline window — was fetched as ≤1000 fully-joined rows PER metric on the
      // client, then bucketed in JS. Now aggregated server-side (createdAt-only,
      // date-bounded) so the dashboard needs a single summary call, not three.
      const WINDOW_DAYS = 14;
      const windowStart = new Date(startOfToday.getTime() - (WINDOW_DAYS - 1) * 24 * 60 * 60 * 1000);

      // Phase 1 — every independent query runs concurrently (was ~13 sequential awaits).
      const [
        totalViews,
        totalClicks,
        uniqueIPs,
        topProperties,
        topPropertiesByClicksRaw,
        clickTypes,
        topUsersByClicksRaw,
        totalInquiries,
        newInquiries,
        inquiriesToday,
        inquiriesLast7Days,
        inquiriesBySourceRaw,
        inquiriesByStatusRaw,
        windowViews,
        windowClicks,
        trafficRaw,
      ] = await Promise.all([
        prisma.propertyView.count().catch(() => 0),
        prisma.clickEvent.count().catch(() => 0),
        prisma.propertyView.groupBy({ by: ['ipAddress'], _count: true }).catch(() => []),
        prisma.propertyView.groupBy({ by: ['propertyId'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10 }).catch(() => []),
        prisma.clickEvent.groupBy({ by: ['propertyId'], where: { propertyId: { not: null } }, _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10 }).catch(() => []),
        prisma.clickEvent.groupBy({ by: ['eventType'], _count: { id: true } }).catch(() => []),
        prisma.clickEvent.groupBy({ by: ['ipAddress'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 10 }).catch(() => []),
        prisma.inquiry.count().catch(() => 0),
        prisma.inquiry.count({ where: { status: 'new' } }).catch(() => 0),
        prisma.inquiry.count({ where: { createdAt: { gte: startOfToday } } }).catch(() => 0),
        prisma.inquiry.count({ where: { createdAt: { gte: sevenDaysAgo } } }).catch(() => 0),
        prisma.inquiry.groupBy({ by: ['source'], _count: { id: true } }).catch(() => []),
        prisma.inquiry.groupBy({ by: ['status'], _count: { id: true } }).catch(() => []),
        prisma.propertyView.findMany({ where: { createdAt: { gte: windowStart } }, select: { createdAt: true } }).catch(() => []),
        prisma.clickEvent.findMany({ where: { createdAt: { gte: windowStart } }, select: { createdAt: true } }).catch(() => []),
        prisma.propertyView.groupBy({ by: ['referer'], _count: { id: true } }).catch(() => []),
      ]);

      // Phase 2 — detail lookups that depend on the phase-1 "top" lists (each internally parallel).
      const [topPropertiesByClicks, topUsersByClicks] = await Promise.all([
        Promise.all(
          (Array.isArray(topPropertiesByClicksRaw) ? topPropertiesByClicksRaw : []).map(async (p) => {
            if (!p.propertyId) return { propertyId: null, clicks: p._count.id };
            const property = await prisma.property.findUnique({
              where: { id: p.propertyId },
              select: { id: true, title: true, location: true },
            }).catch(() => null);
            return { propertyId: p.propertyId, clicks: p._count.id, property };
          })
        ),
        Promise.all(
          (Array.isArray(topUsersByClicksRaw) ? topUsersByClicksRaw : []).map(async (u) => {
            const clickEvent = await prisma.clickEvent.findFirst({
              where: { ipAddress: u.ipAddress },
              select: { userAgent: true },
              orderBy: { createdAt: 'desc' },
            }).catch(() => null);
            return { ipAddress: u.ipAddress, clicks: u._count.id, userAgent: clickEvent?.userAgent || null };
          })
        ),
      ]);

      // Build the 14-day daily sparkline server-side (oldest → newest), keyed by
      // server-local day to match the inquiriesToday boundary above.
      const dayKey = (d: Date | string): string => {
        const x = new Date(d);
        return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
      };
      const buckets = new Map<string, { date: string; views: number; clicks: number }>();
      for (let i = WINDOW_DAYS - 1; i >= 0; i--) {
        const key = dayKey(new Date(startOfToday.getTime() - i * 24 * 60 * 60 * 1000));
        buckets.set(key, { date: key, views: 0, clicks: 0 });
      }
      (Array.isArray(windowViews) ? windowViews : []).forEach((v: any) => { const b = buckets.get(dayKey(v.createdAt)); if (b) b.views++; });
      (Array.isArray(windowClicks) ? windowClicks : []).forEach((c: any) => { const b = buckets.get(dayKey(c.createdAt)); if (b) b.clicks++; });
      const dailySeries = Array.from(buckets.values());
      const todayKey = dayKey(startOfToday);
      const viewsToday = (Array.isArray(windowViews) ? windowViews : []).filter((v: any) => dayKey(v.createdAt) === todayKey).length;

      // Acquisition sources from the referer header on property views (all-time),
      // folded into a handful of buckets (Google / Facebook / Yad2 / direct / …).
      // Internal referers (listing→listing browsing) are NOT acquisition, so they're
      // dropped — otherwise intra-site navigation would bury the real external sources.
      const tsMap = new Map<string, number>();
      (Array.isArray(trafficRaw) ? trafficRaw : []).forEach((r: any) => {
        const key = classifyReferer(r.referer);
        if (key === 'internal') return;
        tsMap.set(key, (tsMap.get(key) || 0) + (r._count?.id || 0));
      });
      const trafficSources = Array.from(tsMap.entries())
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count);

      return NextResponse.json({
        totalViews,
        totalClicks,
        uniqueVisitors: Array.isArray(uniqueIPs) ? uniqueIPs.length : 0,
        // 14-day sparkline + today's views, aggregated server-side.
        dailySeries,
        viewsToday,
        // Lead/inquiry KPIs (real submissions)
        totalInquiries,
        newInquiries,
        inquiriesToday,
        inquiriesLast7Days,
        inquiriesBySource: Array.isArray(inquiriesBySourceRaw)
          ? inquiriesBySourceRaw.map((s) => ({ source: s.source || 'unknown', count: s._count.id }))
          : [],
        inquiriesByStatus: Array.isArray(inquiriesByStatusRaw)
          ? inquiriesByStatusRaw.map((s) => ({ status: s.status, count: s._count.id }))
          : [],
        topProperties: Array.isArray(topProperties) ? topProperties.map(p => ({
          propertyId: p.propertyId,
          views: p._count.id,
        })) : [],
        topPropertiesByClicks: topPropertiesByClicks.filter(p => p.propertyId !== null),
        clickTypes: Array.isArray(clickTypes) ? clickTypes.map(c => ({
          eventType: c.eventType,
          count: c._count.id,
        })) : [],
        topUsersByClicks: topUsersByClicks,
        trafficSources,
      });
    }

    if (type === 'views') {
      const where: any = {};
      if (propertyId) where.propertyId = parseInt(propertyId);
      if (ipAddress) where.ipAddress = ipAddress;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const views = await prisma.propertyView.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              location: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1000,
      }).catch(() => []);

      return NextResponse.json(Array.isArray(views) ? views : []);
    }

    if (type === 'clicks') {
      const where: any = {};
      if (propertyId) where.propertyId = parseInt(propertyId);
      if (ipAddress) where.ipAddress = ipAddress;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const clicks = await prisma.clickEvent.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              location: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1000,
      }).catch(() => []);

      return NextResponse.json(Array.isArray(clicks) ? clicks : []);
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics' },
      { status: 500 }
    );
  }
}

