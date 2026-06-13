import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

// GET homepage section titles (admin)
export async function GET(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    // Use Prisma client directly
    let settings = await prisma.homepageSettings.findFirst();

    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.homepageSettings.create({
        data: {
          hotPropositionsTitle: 'הצעות חמות',
          featuredPropertiesTitle: 'נכסים באיזור המרכז',
          featuredPropertiesSubtitle: 'מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז',
          valuesSectionTitle: 'למה לבחור בנו?',
          aboutSectionTitle: 'אודות',
          processSectionTitle: 'מה חשוב לדעת כשקונים נכס?',
          testimonialsTitle: 'מה הלקוחות שלנו אומרים',
          noCommissionTitle: 'דירה ללא עמלת תיווך',
        }
      });
    }

    const response = NextResponse.json(settings);
    // Prevent caching to ensure admins always get fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error fetching homepage titles:', error);

    // Return default values on error
    const response = NextResponse.json({
      id: 1,
      hotPropositionsTitle: 'הצעות חמות',
      featuredPropertiesTitle: 'נכסים באיזור המרכז',
      featuredPropertiesSubtitle: 'מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז',
      valuesSectionTitle: 'למה לבחור בנו?',
      aboutSectionTitle: 'אודות',
      processSectionTitle: 'מה חשוב לדעת כשקונים נכס?',
      testimonialsTitle: 'מה הלקוחות שלנו אומרים',
      noCommissionTitle: 'דירה ללא עמלת תיווך',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  }
}

// PUT update homepage section titles (admin)
export async function PUT(request: NextRequest) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();

    // Get or create settings
    let settings = await prisma.homepageSettings.findFirst();

    if (!settings) {
      settings = await prisma.homepageSettings.create({
        data: {
          hotPropositionsTitle: body.hotPropositionsTitle || "הצעות חמות",
          featuredPropertiesTitle: body.featuredPropertiesTitle || "נכסים באיזור המרכז",
          featuredPropertiesSubtitle: body.featuredPropertiesSubtitle || "מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז",
          valuesSectionTitle: body.valuesSectionTitle || "למה לבחור בנו?",
          aboutSectionTitle: body.aboutSectionTitle || "אודות",
          processSectionTitle: body.processSectionTitle || "מה חשוב לדעת כשקונים נכס?",
          testimonialsTitle: body.testimonialsTitle || "מה הלקוחות שלנו אומרים",
          noCommissionTitle: body.noCommissionTitle || "דירה ללא עמלת תיווך",
        }
      });
    } else {
      settings = await prisma.homepageSettings.update({
        where: { id: settings.id },
        data: {
          hotPropositionsTitle: body.hotPropositionsTitle !== undefined ? body.hotPropositionsTitle : settings.hotPropositionsTitle,
          featuredPropertiesTitle: body.featuredPropertiesTitle !== undefined ? body.featuredPropertiesTitle : settings.featuredPropertiesTitle,
          featuredPropertiesSubtitle: body.featuredPropertiesSubtitle !== undefined ? body.featuredPropertiesSubtitle : settings.featuredPropertiesSubtitle,
          valuesSectionTitle: body.valuesSectionTitle !== undefined ? body.valuesSectionTitle : settings.valuesSectionTitle,
          aboutSectionTitle: body.aboutSectionTitle !== undefined ? body.aboutSectionTitle : settings.aboutSectionTitle,
          processSectionTitle: body.processSectionTitle !== undefined ? body.processSectionTitle : settings.processSectionTitle,
          testimonialsTitle: body.testimonialsTitle !== undefined ? body.testimonialsTitle : settings.testimonialsTitle,
          noCommissionTitle: body.noCommissionTitle !== undefined ? body.noCommissionTitle : settings.noCommissionTitle,
        }
      });
    }

    const response = NextResponse.json({ success: true, settings });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error updating homepage titles:', error);
    return NextResponse.json(
      {
        error: 'Failed to update homepage titles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

