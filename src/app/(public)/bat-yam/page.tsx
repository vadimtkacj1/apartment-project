import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityLandingContent from '@/components/pages/CityLandingContent';
import BreadcrumbSchema from '@/components/SEO/BreadcrumbSchema';
import { getCityLanding } from '@/data/city-landings';
import { cityFaqSchema, cityMetadata, cityServiceSchema, getCityProperties } from '@/lib/city-landing';

const city = getCityLanding('bat-yam')!;

export const metadata: Metadata = cityMetadata(city);

export const revalidate = 300;

export default async function BatYamPage() {
  if (!city) notFound();
  const properties = await getCityProperties(city);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityFaqSchema(city)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityServiceSchema(city)) }}
      />
      <BreadcrumbSchema items={[{ name: city.h1, path: `/${city.slug}` }]} />
      <CityLandingContent city={city} properties={properties} />
    </>
  );
}
