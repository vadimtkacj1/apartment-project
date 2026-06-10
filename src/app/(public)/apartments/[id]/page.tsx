import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ApartmentDetailClient from './ApartmentDetailClient';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id), isActive: true },
      select: {
        title: true,
        description: true,
        price: true,
        location: true,
        rooms: true,
        area: true,
        dealType: true,
        images: true,
        isSold: true,
      },
    });

    if (!property) {
      return {
        title: 'נכס לא נמצא',
        description: 'הנכס המבוקש אינו קיים או אינו זמין',
      };
    }

    const images = JSON.parse(property.images || '[]') as string[];
    const firstImage = images[0];
    const dealTypeLabel = property.dealType === 'rent' ? 'להשכרה' : 'למכירה';
    const title = property.title?.trim() ||
      `${property.rooms} חדרים ${dealTypeLabel} ב${property.location}`;
    const rawDesc = property.description || '';
    const description = rawDesc.length > 0
      ? rawDesc.slice(0, 155)
      : `דירה ${dealTypeLabel} | ${property.rooms} חדרים | ${property.area} מ"ר | ${property.location} | מחיר: ${property.price}`;

    const ogImage = firstImage
      ? (firstImage.startsWith('http') ? firstImage : `${siteUrl}${firstImage}`)
      : `${siteUrl}/images/hero/main-hero.jpg`;

    return {
      title,
      description,
      alternates: {
        canonical: `${siteUrl}/apartments/${id}`,
      },
      openGraph: {
        title: `${title} | רם נכסים`,
        description,
        type: 'article',
        url: `${siteUrl}/apartments/${id}`,
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
    };
  } catch {
    return {
      title: 'דירות למכירה ולהשכרה בחולון',
      description: 'מאגר דירות למכירה ולהשכרה בחולון ובאזור המרכז',
    };
  }
}

async function getPropertySchema(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: parseInt(id), isActive: true },
      select: {
        title: true,
        description: true,
        price: true,
        location: true,
        rooms: true,
        area: true,
        dealType: true,
        images: true,
        isSold: true,
        city: true,
      },
    });

    if (!property) return null;

    const images = JSON.parse(property.images || '[]') as string[];
    const firstImage = images[0];
    const ogImage = firstImage
      ? (firstImage.startsWith('http') ? firstImage : `${siteUrl}${firstImage}`)
      : undefined;

    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: property.title,
      description: property.description?.slice(0, 300) || undefined,
      url: `${siteUrl}/apartments/${id}`,
      ...(ogImage ? { image: ogImage } : {}),
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: 'ILS',
        availability: property.isSold
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: property.location || property.city,
        addressCountry: 'IL',
      },
    };
  } catch {
    return null;
  }
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const schema = await getPropertySchema(id);
  const propertyName = schema?.name as string | undefined;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <BreadcrumbSchema items={[
        { name: 'דירות', path: '/apartments' },
        { name: propertyName || `נכס ${id}`, path: `/apartments/${id}` },
      ]} />
      <ApartmentDetailClient propertyId={id} />
    </>
  );
}
