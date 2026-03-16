import ApartmentsPageClient from '@/components/pages/ApartmentsPageClient';
import { DealType } from '@/types/property.types';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ApartmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dealType = params.dealType as DealType | undefined;
  return <ApartmentsPageClient initialDealType={dealType} />;
}