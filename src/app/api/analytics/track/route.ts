import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

export async function POST(request: NextRequest) {
  try {
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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'views' | 'clicks' | 'summary'
    const propertyId = searchParams.get('propertyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (type === 'summary') {
      // Get summary statistics
      const totalViews = await prisma.propertyView.count().catch(() => 0);
      const totalClicks = await prisma.clickEvent.count().catch(() => 0);
      
      const uniqueIPs = await prisma.propertyView.groupBy({
        by: ['ipAddress'],
        _count: true,
      }).catch(() => []);

      const topProperties = await prisma.propertyView.groupBy({
        by: ['propertyId'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      }).catch(() => []);

      // Get top properties by clicks
      const topPropertiesByClicksRaw = await prisma.clickEvent.groupBy({
        by: ['propertyId'],
        where: {
          propertyId: { not: null },
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      }).catch(() => []);

      // Get property details for top clicked properties
      const topPropertiesByClicks = await Promise.all(
        (Array.isArray(topPropertiesByClicksRaw) ? topPropertiesByClicksRaw : []).map(async (p) => {
          if (!p.propertyId) return { propertyId: null, clicks: p._count.id };
          const property = await prisma.property.findUnique({
            where: { id: p.propertyId },
            select: { id: true, title: true, location: true },
          }).catch(() => null);
          return {
            propertyId: p.propertyId,
            clicks: p._count.id,
            property: property,
          };
        })
      );

      const clickTypes = await prisma.clickEvent.groupBy({
        by: ['eventType'],
        _count: {
          id: true,
        },
      }).catch(() => []);

      return NextResponse.json({
        totalViews,
        totalClicks,
        uniqueVisitors: Array.isArray(uniqueIPs) ? uniqueIPs.length : 0,
        topProperties: Array.isArray(topProperties) ? topProperties.map(p => ({
          propertyId: p.propertyId,
          views: p._count.id,
        })) : [],
        topPropertiesByClicks: topPropertiesByClicks.filter(p => p.propertyId !== null),
        clickTypes: Array.isArray(clickTypes) ? clickTypes.map(c => ({
          eventType: c.eventType,
          count: c._count.id,
        })) : [],
      });
    }

    if (type === 'views') {
      const where: any = {};
      if (propertyId) where.propertyId = parseInt(propertyId);
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

