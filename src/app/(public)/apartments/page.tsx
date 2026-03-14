import ApartmentsPageClient from '@/components/pages/ApartmentsPageClient';
import { DealType } from '@/types/property.types';

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ApartmentsPage({ searchParams }: PageProps) {
  const dealType = searchParams.dealType as DealType | undefined;
  return <ApartmentsPageClient initialDealType={dealType} />;
}