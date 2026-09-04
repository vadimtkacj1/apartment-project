import { MetadataRoute } from 'next';
import { isVideoUrl } from '@/lib/media';
import { prisma } from '@/lib/prisma';
import { articles, ARTICLES_LAST_REVISED } from '@/data/articles';
import { cityLandings } from '@/data/city-landings';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

// Property.images is a JSON string column ("[]" by default). Parse it into a list
// of absolute URLs for the image sitemap so listing photos can surface in Google
// Images — a real traffic source for real estate. Capped at 25/listing to keep the
// sitemap lean, and tolerant of malformed/empty values.
function parseImageUrls(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((u): u is string => typeof u === 'string' && u.length > 0 && !isVideoUrl(u))
      .slice(0, 25)
      .map((u) => (u.startsWith('http') ? u : `${siteUrl}${u.startsWith('/') ? '' : '/'}${u}`));
  } catch {
    return [];
  }
}

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
      // privacy-policy is intentionally omitted: it is robots noindex, so listing
      // it in the sitemap triggers a "Submitted URL marked noindex" warning that
      // erodes crawl-budget trust for the legitimate URLs alongside it.
      url: `${baseUrl}/accessibility`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Articles come from the shared registry (src/data/articles.ts) so a new guide
  // is added in exactly one place and still lands in the sitemap. lastModified uses
  // the revision date (per-article `updated`, else the catalog default), NOT the
  // publish date — so <lastmod> matches each page's JSON-LD dateModified instead of
  // claiming the guide is months staler than its own structured data says.
  const cityRoutes: MetadataRoute.Sitemap = cityLandings.map((c) => ({
    url: `${baseUrl}/${c.slug}`,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => {
    const revised = a.updated ?? (a.date > ARTICLES_LAST_REVISED ? a.date : ARTICLES_LAST_REVISED);
    return {
      url: `${baseUrl}/articles/${a.id}`,
      lastModified: new Date(revised),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

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
        images: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Dynamic property routes - only include active properties
    // Each property page is important for SEO and may be updated when status changes
    // This is where the sitemap gets its size - one URL per active property
    const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => {
      const images = parseImageUrls(property.images);
      return {
        url: `${baseUrl}/apartments/${property.id}`,
        lastModified: property.updatedAt,
        changeFrequency: 'weekly' as const, // Properties may be updated (status, price, etc.)
        priority: 0.8, // High priority - these are the main content pages
        // Image sitemap: surfaces listing photos to Google Images.
        ...(images.length > 0 ? { images } : {}),
      };
    });

    // Combine static routes with dynamic property routes
    // Total sitemap size = static routes (10) + number of active properties
    return [...staticRoutes, ...cityRoutes, ...articleRoutes, ...propertyRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static + article routes if the property query fails
    return [...staticRoutes, ...cityRoutes, ...articleRoutes];
  }
}

