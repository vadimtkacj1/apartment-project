import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ram-haim.co.il';

// Helper to parse JSON arrays stored as strings in SQLite
function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const propertyId = parseInt(resolvedParams.id);

    // Validate that id is a valid number
    if (!resolvedParams.id || isNaN(propertyId)) {
      return {
        title: 'נכס לא נמצא',
        description: 'מזהה נכס לא תקין',
      };
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property || !property.isActive) {
      return {
        title: 'נכס לא נמצא',
        description: 'הנכס המבוקש לא נמצא או אינו זמין',
      };
    }

    const images = parseJsonArray(property.images);
    const mainImage = images[0] || '/images/hero/main-hero.jpg';
    const fullImageUrl = mainImage.startsWith('http') ? mainImage : `${siteUrl}${mainImage}`;

    const cityNames: Record<string, string> = {
      holon: 'חולון',
      batyam: 'בת ים',
      rishon: 'ראשון לציון',
      telaviv: 'תל אביב',
    };

    const dealTypeNames: Record<string, string> = {
      sale: 'למכירה',
      rent: 'להשכרה',
    };

    const cityName = cityNames[property.city] || property.city;
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

export default function ApartmentDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

