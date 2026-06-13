"use client";
import React, { useEffect, Suspense, useMemo, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

// Component Imports
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilters from '@/components/properties/PropertyFilters';
import ContactFormPopup from '@/components/layout/ContactFormPopup';

// Logic & Data Imports
import { FilterState, DealType, City } from '@/types/property.types';

import { CATEGORIES, Category, SortOption } from '@/data/properties.data';
import { ISRAELI_CITIES } from '@/data/cities';

interface Property {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  bedrooms: string;
  bathrooms: number;
  area: number;
  status?: string;
  category: string;
  dealType?: DealType;
  city?: City;
  isSold?: boolean;
}

const ITEMS_PER_PAGE = 8;
const LOAD_MORE_COUNT = 8;

function getInitialCategory(initialDealType?: DealType): Category {
  if (initialDealType === 'sale') return 'sales';
  if (initialDealType === 'rent') return 'rentals';
  return 'all';
}

// Available properties first, sold/rented last (stable otherwise)
function sortSoldLast(list: Property[]): Property[] {
  return [...list].sort((a, b) => {
    if (a.isSold && !b.isSold) return 1;
    if (!a.isSold && b.isSold) return -1;
    return 0;
  });
}

interface ApartmentsPageProps {
  initialDealType?: DealType;
  /** Validated city from the URL, already applied to initialProperties server-side */
  initialCity?: City;
  /** Server-rendered listing matching initialFilterKey — lets the first paint skip the client fetch */
  initialProperties?: Property[];
  /** Query string the server data corresponds to (e.g. "dealType=rent") */
  initialFilterKey?: string;
}

function ApartmentsPageContent({ initialDealType, initialCity, initialProperties, initialFilterKey }: ApartmentsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<Category>(() => getInitialCategory(initialDealType));
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>(() => ({
    dealType: initialDealType ?? 'all',
    city: initialCity ?? 'all',
  }));
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(() => ({
    dealType: initialDealType ?? 'all',
    city: initialCity ?? 'all',
  }));

  const [properties, setProperties] = useState<Property[]>(() =>
    initialProperties ? sortSoldLast(initialProperties) : []
  );
  const [loading, setLoading] = useState(!initialProperties);

  // Consumed on the first fetch-effect run: when the client's filter state
  // serializes to the same query string the server already fetched, the
  // initial round-trip to /api/properties is skipped.
  const pendingInitialKey = useRef<string | null>(
    initialProperties ? (initialFilterKey ?? '') : null
  );

  useEffect(() => {
    const dealTypeFromUrl = searchParams.get('dealType');
    const cityFromUrl = searchParams.get('city');

    // Return prev unchanged when values are equal — a new object identity here
    // re-triggers the fetch effect and causes a duplicate API call.
    const syncFromUrl = (prev: FilterState): FilterState => {
      let nextDealType = prev.dealType;
      let nextCity = prev.city;
      if (dealTypeFromUrl && (dealTypeFromUrl === 'sale' || dealTypeFromUrl === 'rent')) {
        nextDealType = dealTypeFromUrl as DealType;
      }
      if (cityFromUrl) {
        nextCity = ISRAELI_CITIES.some((c) => c.value === cityFromUrl) ? cityFromUrl : 'all';
      }
      if (nextDealType === prev.dealType && nextCity === prev.city) return prev;
      return { ...prev, dealType: nextDealType, city: nextCity };
    };

    setFilters(syncFromUrl);
    setAppliedFilters(syncFromUrl);
    if (dealTypeFromUrl && (dealTypeFromUrl === 'sale' || dealTypeFromUrl === 'rent')) {
      setSelectedCategory(getInitialCategory(dealTypeFromUrl as DealType));
    }
  }, [searchParams]);

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setVisibleCount(ITEMS_PER_PAGE);

    // Sync dealType filter and apply immediately
    let newDealType: DealType | 'all' = 'all';
    if (category === 'sales') {
      newDealType = 'sale';
    } else if (category === 'rentals') {
      newDealType = 'rent';
    }

    const updatedFilters = { ...filters, dealType: newDealType };
    setFilters(updatedFilters);
    setAppliedFilters(updatedFilters);
  };

  // Sync category when dealType changes
  useEffect(() => {
    if (filters.dealType === 'sale' && selectedCategory === 'rentals') {
      setSelectedCategory('sales');
    } else if (filters.dealType === 'rent' && selectedCategory === 'sales') {
      setSelectedCategory('rentals');
    } else if (filters.dealType === 'all' && (selectedCategory === 'sales' || selectedCategory === 'rentals')) {
      setSelectedCategory('all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.dealType]);

  useEffect(() => {
    const params = new URLSearchParams();

    // Basic filters
    if (appliedFilters.dealType && appliedFilters.dealType !== 'all') params.append('dealType', appliedFilters.dealType);
    if (appliedFilters.city && appliedFilters.city !== 'all') params.append('city', appliedFilters.city);

    // Property type filter
    if (appliedFilters.propertyType && appliedFilters.propertyType !== 'all') {
      params.append('propertyType', appliedFilters.propertyType);
    }

    // Rooms filter
    if (appliedFilters.minRooms !== undefined && appliedFilters.minRooms !== null) {
      params.append('minRooms', String(appliedFilters.minRooms));
    }
    if (appliedFilters.maxRooms !== undefined && appliedFilters.maxRooms !== null) {
      params.append('maxRooms', String(appliedFilters.maxRooms));
    }

    // Price filter
    if (appliedFilters.minPrice !== undefined) params.append('minPrice', String(appliedFilters.minPrice));
    if (appliedFilters.maxPrice !== undefined) params.append('maxPrice', String(appliedFilters.maxPrice));

    // Area filter
    if (appliedFilters.minArea !== undefined) params.append('minArea', String(appliedFilters.minArea));
    if (appliedFilters.maxArea !== undefined) params.append('maxArea', String(appliedFilters.maxArea));

    // Floor filter
    if (appliedFilters.floor !== undefined) params.append('floor', String(appliedFilters.floor));

    // Parking filter
    if (appliedFilters.parking && appliedFilters.parking !== 'all') {
      params.append('parking', appliedFilters.parking);
    }

    // Furniture filter
    if (appliedFilters.furniture && appliedFilters.furniture !== 'all') {
      params.append('furniture', appliedFilters.furniture);
    }

    // Kitchen filter
    if (appliedFilters.kitchen && appliedFilters.kitchen !== 'all') {
      params.append('kitchen', appliedFilters.kitchen);
    }

    // Position filter
    if (appliedFilters.position && appliedFilters.position !== 'all') {
      params.append('position', appliedFilters.position);
    }

    // Neighborhood filter
    if (appliedFilters.neighborhood) {
      params.append('neighborhood', appliedFilters.neighborhood);
    }

    // Street filter
    if (appliedFilters.street) {
      params.append('street', appliedFilters.street);
    }

    // Vacancy date filter
    if (appliedFilters.vacancyDate) {
      params.append('vacancyDate', appliedFilters.vacancyDate);
    }

    // Feature filters
    if (appliedFilters.features?.hasAirConditioning) params.append('hasAirConditioning', 'true');
    if (appliedFilters.features?.hasElevator) params.append('hasElevator', 'true');
    if (appliedFilters.features?.hasSunBalcony) params.append('hasSunBalcony', 'true');
    if (appliedFilters.features?.hasSafeRoom) params.append('hasSafeRoom', 'true');
    if (appliedFilters.features?.hasStorage) params.append('hasStorage', 'true');
    if (appliedFilters.features?.hasDisabledAccess) params.append('hasDisabledAccess', 'true');
    if (appliedFilters.features?.hasMamak) params.append('hasMamak', 'true');
    if (appliedFilters.features?.hasBars) params.append('hasBars', 'true');
    if (appliedFilters.features?.hasPets) params.append('hasPets', 'true');
    if (appliedFilters.features?.hasHousingUnit) params.append('hasHousingUnit', 'true');
    if (appliedFilters.features?.hasShelter) params.append('hasShelter', 'true');

    const qs = params.toString();

    // First run with server-rendered data for these exact filters — skip the
    // redundant round-trip. Consumed once; later filter changes always fetch.
    if (pendingInitialKey.current !== null) {
      const matchesServerData = pendingInitialKey.current === qs;
      pendingInitialKey.current = null;
      if (matchesServerData) return;
    }

    const controller = new AbortController();

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties?${qs}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();

        const mappedProperties: Property[] = data.map((prop: any) => ({
          ...prop,
          bedrooms: prop.rooms,
          category: prop.category || (prop.dealType === 'sale' ? 'sales' : 'rentals'),
          image: prop.images?.[0] || "/images/hero/sales.jpg",
        }));

        setProperties(sortSoldLast(mappedProperties));
        setVisibleCount(ITEMS_PER_PAGE);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
    return () => controller.abort();
  }, [appliedFilters, selectedCategory]);

  const currentProperties = useMemo(() => {
    return properties.slice(0, visibleCount);
  }, [properties, visibleCount]);

  const hasMore = visibleCount < properties.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, properties.length));
  }, [properties.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  /** Sync URL with applied filters (call when applying or resetting). */
  const syncUrlFromFilters = (f: FilterState) => {
    const params = new URLSearchParams();
    if (f.dealType && f.dealType !== 'all') params.set('dealType', f.dealType);
    if (f.city && f.city !== 'all') params.set('city', f.city);
    if (f.propertyType && f.propertyType !== 'all') params.set('propertyType', f.propertyType);
    if (f.minRooms != null) params.set('minRooms', String(f.minRooms));
    if (f.maxRooms != null) params.set('maxRooms', String(f.maxRooms));
    if (f.minPrice != null) params.set('minPrice', String(f.minPrice));
    if (f.maxPrice != null) params.set('maxPrice', String(f.maxPrice));
    if (f.minArea != null) params.set('minArea', String(f.minArea));
    if (f.maxArea != null) params.set('maxArea', String(f.maxArea));
    if (f.floor != null) params.set('floor', String(f.floor));
    if (f.parking && f.parking !== 'all') params.set('parking', f.parking);
    if (f.furniture && f.furniture !== 'all') params.set('furniture', f.furniture);
    if (f.kitchen && f.kitchen !== 'all') params.set('kitchen', f.kitchen);
    if (f.position && f.position !== 'all') params.set('position', f.position);
    if (f.neighborhood) params.set('neighborhood', f.neighborhood);
    if (f.street) params.set('street', f.street);
    if (f.vacancyDate) params.set('vacancyDate', f.vacancyDate);
    if (f.features?.hasAirConditioning) params.set('hasAirConditioning', 'true');
    if (f.features?.hasElevator) params.set('hasElevator', 'true');
    if (f.features?.hasSunBalcony) params.set('hasSunBalcony', 'true');
    if (f.features?.hasSafeRoom) params.set('hasSafeRoom', 'true');
    if (f.features?.hasStorage) params.set('hasStorage', 'true');
    if (f.features?.hasDisabledAccess) params.set('hasDisabledAccess', 'true');
    if (f.features?.hasMamak) params.set('hasMamak', 'true');
    if (f.features?.hasBars) params.set('hasBars', 'true');
    if (f.features?.hasPets) params.set('hasPets', 'true');
    if (f.features?.hasHousingUnit) params.set('hasHousingUnit', 'true');
    if (f.features?.hasShelter) params.set('hasShelter', 'true');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <ContactFormPopup isOpen={isContactPopupOpen} onClose={() => setIsContactPopupOpen(false)} />

      {/* Hero Section */}
      <SecondaryHero img="/7.jpg" title="נכסים למכירה והשכרה" centered={true} />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="min-h-screen bg-warm pt-16 pb-32" dir="rtl">
        <div className="mx-auto px-6">
          {/* Categories */}
          <div className="flex justify-center gap-3 mb-10">
            {CATEGORIES.filter((cat) => ['all', 'sales', 'rentals'].includes(cat.value)).map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-8 py-3 rounded-2xl font-bold transition-all ${selectedCategory === cat.value ? 'bg-[#1c3664] text-white shadow-lg scale-105' : 'bg-white text-gray-600 border border-gray-200'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold shadow-sm"
            >
              <SlidersHorizontal size={18} />
              <span>{showFilters ? 'הסתר פילטרים' : 'הצג פילטרים'}</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-bold">מיון לפי:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pr-4 pl-10 py-3 bg-white border border-gray-200 rounded-2xl font-bold outline-none shadow-sm appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231c3664' stroke-width='3'%3E%3Cpath d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left 12px center',
                  backgroundSize: '16px',
                }}
              >
                <option value="newest">החדשים ביותר</option>
                <option value="price-asc">מחיר: נמוך לגבוה</option>
                <option value="price-desc">מחיר: גבוה לנמוך</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-5xl mx-auto mb-10"
              >
                <PropertyFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onApply={() => {
                    setAppliedFilters(filters);
                    setVisibleCount(ITEMS_PER_PAGE);
                    syncUrlFromFilters(filters);
                  }}
                  onReset={() => {
                    const resetFilters: FilterState = { dealType: initialDealType ?? 'all', city: 'all' };
                    setFilters(resetFilters);
                    setAppliedFilters(resetFilters);
                    setVisibleCount(ITEMS_PER_PAGE);
                    syncUrlFromFilters(resetFilters);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="text-center py-20 font-bold text-gray-400">טוען נכסים...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:pl-20">
                {currentProperties.map((prop, i) => (
                  <PropertyCard key={prop.id} {...prop} index={i} />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={sentinelRef} className="mt-8 flex justify-center">
                {hasMore && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-gray-400 font-bold py-4"
                  >
                    <span className="w-5 h-5 border-2 border-[#1c3664] border-t-transparent rounded-full animate-spin inline-block" />
                    <span>טוען עוד נכסים...</span>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function ApartmentsPageClient({ initialDealType, initialCity, initialProperties, initialFilterKey }: ApartmentsPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApartmentsPageContent
        initialDealType={initialDealType}
        initialCity={initialCity}
        initialProperties={initialProperties}
        initialFilterKey={initialFilterKey}
      />
    </Suspense>
  );
}


