import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCityLabel } from '@/data/cities';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

async function getProperty(id: number) {
  try {
    return await prisma.property.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const propertyId = parseInt(resolvedParams.id);

    if (!resolvedParams.id || isNaN(propertyId)) {
      return {
        title: 'נכס לא נמצא',
        description: 'מזהה נכס לא תקין',
      };
    }

    const property = await getProperty(propertyId);

    if (!property || !property.isActive) {
      return {
        title: 'נכס לא נמצא',
        description: 'הנכס המבוקש לא נמצא או אינו זמין',
      };
    }

    const images = parseJsonArray(property.images);
    const mainImage = images[0] || '/images/hero/main-hero.jpg';
    const fullImageUrl = mainImage.startsWith('http') ? mainImage : `${siteUrl}${mainImage}`;

    const dealTypeNames: Record<string, string> = {
      sale: 'למכירה',
      rent: 'להשכרה',
    };

    const cityName = getCityLabel(property.city) || property.city;
    const dealTypeName = dealTypeNames[property.dealType] || '';
    const propertyTitle = `דירה ${dealTypeName} ב${cityName} - ${property.rooms} חדרים, ${property.area} מ״ר`;
    const propertyDescription = property.description ||
      `דירה ${dealTypeName} ב${cityName}. ${property.rooms} חדרים, ${property.area} מ״ר${property.builtArea ? `, ${property.builtArea} מ״ר בנוי` : ''}. ${property.floor ? `קומה ${property.floor}` : ''}${property.totalFloors ? ` מתוך ${property.totalFloors}` : ''}. מחיר: ${property.price}`;

    const url = `${siteUrl}/apartments/${resolvedParams.id}`;

    return {
      title: propertyTitle,
      description: propertyDescription,
      keywords: [
        `דירה ${dealTypeName}`,
        `דירה ${dealTypeName} ב${cityName}`,
        `${property.rooms} חדרים ${cityName}`,
        `נדל״ן ${cityName}`,
        `תיווך ${cityName}`,
        property.neighborhood || '',
      ].filter(Boolean),
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: 'website',
        title: propertyTitle,
        description: propertyDescription,
        url: url,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: propertyTitle,
          },
          ...images.slice(1, 4).map((img: string) => ({
            url: img.startsWith('http') ? img : `${siteUrl}${img}`,
            width: 1200,
            height: 630,
            alt: propertyTitle,
          })),
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: propertyTitle,
        description: propertyDescription,
        images: [fullImageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for property:', error);
    return {
      title: 'נכס',
      description: 'פרטי נכס',
    };
  }
}

export default async function ApartmentDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  let propertySchema = null;
  let breadcrumbSchema = null;

  try {
    const resolvedParams = await params;
    const propertyId = parseInt(resolvedParams.id);

    if (!isNaN(propertyId)) {
      const property = await getProperty(propertyId);

      if (property && property.isActive) {
        const images = parseJsonArray(property.images);
        const dealTypeNames: Record<string, string> = { sale: 'למכירה', rent: 'להשכרה' };
        const cityName = getCityLabel(property.city) || property.city;
        const dealTypeName = dealTypeNames[property.dealType] || '';
        const propertyTitle = `דירה ${dealTypeName} ב${cityName} - ${property.rooms} חדרים, ${property.area} מ״ר`;
        const url = `${siteUrl}/apartments/${resolvedParams.id}`;

        propertySchema = {
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          name: propertyTitle,
          description: property.description || propertyTitle,
          url,
          image: images.map((img: string) =>
            img.startsWith('http') ? img : `${siteUrl}${img}`
          ),
          offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'ILS',
            availability: 'https://schema.org/InStock',
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: property.location || undefined,
            addressLocality: cityName,
            addressRegion: property.neighborhood || undefined,
            addressCountry: 'IL',
          },
          numberOfRooms: property.rooms,
          floorLevel: property.floor || undefined,
          floorSize: property.area
            ? { '@type': 'QuantitativeValue', value: property.area, unitCode: 'MTK' }
            : undefined,
        };

        breadcrumbSchema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'דף הבית', item: siteUrl },
            { '@type': 'ListItem', position: 2, name: 'דירות', item: `${siteUrl}/apartments` },
            { '@type': 'ListItem', position: 3, name: propertyTitle, item: url },
          ],
        };
      }
    }
  } catch (error) {
    console.error('Error generating property structured data:', error);
  }

  return (
    <>
      {propertySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {children}
    </>
  );
}
