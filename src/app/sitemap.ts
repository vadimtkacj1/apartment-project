import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

// Helper to parse JSON arrays stored as strings in SQLite
function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  // Static routes - optimized priorities based on SEO best practices
  // Priority scale: 1.0 (highest) to 0.1 (lowest)
  // Higher priority = more important pages that change frequently
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Homepage - highest priority
    },
    {
      url: `${baseUrl}/apartments`,
      lastModified: new Date(),
      changeFrequency: 'daily', // Properties list updates frequently
      priority: 0.9, // Main content page - very high priority
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // About page changes less frequently
      priority: 0.8, // Important but static content
    },
    {
      url: `${baseUrl}/buying-apartment`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // Service page - occasional updates
      priority: 0.8, // High priority service page
    },
    {
      url: `${baseUrl}/selling-apartment`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // Service page - occasional updates
      priority: 0.8, // High priority service page
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly', // Articles section may have new content
      priority: 0.7, // Content section - medium-high priority
    },
    {
      url: `${baseUrl}/articles/foreign-investors`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // Individual article - less frequent updates
      priority: 0.6, // Article page - medium priority
    },
    {
      url: `${baseUrl}/articles/selling-alone`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // Individual article - less frequent updates
      priority: 0.6, // Article page - medium priority
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // FAQ may be updated occasionally
      priority: 0.5, // Support page - medium priority
    },
    {
      url: `${baseUrl}/links`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // Links page may be updated occasionally
      priority: 0.5, // Resource page - medium priority
    },
    {
      url: `${baseUrl}/accessibility`,
      lastModified: new Date(),
      changeFrequency: 'yearly', // Legal/static page - rarely changes
      priority: 0.3, // Legal page - low priority (static content)
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly', // Legal/static page - rarely changes
      priority: 0.3, // Legal page - low priority (static content)
    },
  ];

  try {
    // Fetch all active properties from database
    // Note: The size of the sitemap depends on the number of active properties in the database
    // Each property will generate a separate URL in the sitemap
    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Dynamic property routes - only include active properties
    // Each property page is important for SEO and may be updated when status changes
    // This is where the sitemap gets its size - one URL per active property
    const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
      url: `${baseUrl}/apartments/${property.id}`,
      lastModified: property.updatedAt,
      changeFrequency: 'weekly' as const, // Properties may be updated (status, price, etc.)
      priority: 0.8, // High priority - these are the main content pages
    }));

    // Combine static routes with dynamic property routes
    // Total sitemap size = static routes (15) + number of active properties
    return [...staticRoutes, ...propertyRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static routes if database query fails
    return staticRoutes;
  }
}

