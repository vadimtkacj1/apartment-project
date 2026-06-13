import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl;

  // Static routes - optimized priorities based on SEO best practices
  // Priority scale: 1.0 (highest) to 0.1 (lowest)
  // No lastModified on static routes: stamping them with the current date on
  // every request teaches Google to distrust the sitemap's lastmod values.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1.0, // Homepage - highest priority
    },
    {
      url: `${baseUrl}/apartments`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      // Indexable landing page: self-canonical with its own title/description
      url: `${baseUrl}/apartments?dealType=sale`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      // Indexable landing page: self-canonical with its own title/description
      url: `${baseUrl}/apartments?dealType=rent`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: 'monthly', // About page changes less frequently
      priority: 0.8, // Important but static content
    },
    {
      url: `${baseUrl}/buying-apartment`,
      changeFrequency: 'monthly', // Service page - occasional updates
      priority: 0.8, // High priority service page
    },
    {
      url: `${baseUrl}/selling-apartment`,
      changeFrequency: 'monthly', // Service page - occasional updates
      priority: 0.8, // High priority service page
    },
    {
      url: `${baseUrl}/articles`,
      changeFrequency: 'weekly', // Articles section may have new content
      priority: 0.7, // Content section - medium-high priority
    },
    {
      url: `${baseUrl}/articles/foreign-investors`,
      changeFrequency: 'monthly', // Individual article - less frequent updates
      priority: 0.6, // Article page - medium priority
    },
    {
      url: `${baseUrl}/articles/selling-alone`,
      changeFrequency: 'monthly', // Individual article - less frequent updates
      priority: 0.6, // Article page - medium priority
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: 'monthly', // FAQ may be updated occasionally
      priority: 0.5, // Support page - medium priority
    },
    {
      url: `${baseUrl}/links`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/accessibility`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  try {
    // Active, still-available properties only. Sold/rented listings stay live
    // but are not promoted in the sitemap — to Google's crawl scheduler they
    // read as low-value pages and drag down the rest of the queue.
    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
        isSold: false,
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
    // Total sitemap size = static routes (10) + number of active properties
    return [...staticRoutes, ...propertyRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static routes if database query fails
    return staticRoutes;
  }
}

