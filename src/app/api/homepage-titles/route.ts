import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Default titles to use as fallback
const DEFAULT_TITLES = {
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
};

// GET homepage section titles
export async function GET() {
  try {
    // Access model with type safety
    const HomepageSettings = (prisma as any).homepageSettings;

    if (!HomepageSettings) {
      console.warn('HomepageSettings model not found - returning defaults');
      return NextResponse.json(DEFAULT_TITLES);
    }

    let settings = await HomepageSettings.findFirst();

    // If no settings exist, create default
    if (!settings) {
      try {
        settings = await HomepageSettings.create({
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
      } catch (createError) {
        console.warn('Could not create settings, using defaults:', createError);
        return NextResponse.json(DEFAULT_TITLES);
      }
    }

    const response = NextResponse.json(settings);
    // Prevent caching to ensure users always get fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error fetching homepage titles:', error);
    // Always return default values instead of error
    const response = NextResponse.json(DEFAULT_TITLES);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  }
}

