"use client";
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, Mail } from 'lucide-react';

// Component Imports
import SecondaryHero from '@/components/layout/SecondaryHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilters from '@/components/properties/PropertyFilters';
import ContactFormPopup from '@/components/layout/ContactFormPopup';

// Logic & Data Imports
import { FilterState, DealType, City } from '@/types/property.types';

import {
  CATEGORIES,
  Category,
  SortOption
} from '@/data/properties.data';

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

interface CategoryItem {
  id: string;
  label: string;
  value: string;
}

const ITEMS_PER_PAGE = 8;

function ApartmentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ dealType: 'all', city: 'all' });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    if (pageFromUrl) setCurrentPage(parseInt(pageFromUrl, 10));
    
    const dealTypeFromUrl = searchParams.get('dealType');
    if (dealTypeFromUrl && (dealTypeFromUrl === 'sale' || dealTypeFromUrl === 'rent')) {
      setFilters(prev => ({ ...prev, dealType: dealTypeFromUrl as DealType }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        // Basic filters
        if (filters.dealType && filters.dealType !== 'all') params.append('dealType', filters.dealType);
        if (filters.city && filters.city !== 'all') params.append('city', filters.city);
        if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);

        // Property type filter
        if (filters.propertyType && filters.propertyType !== 'all') {
          params.append('propertyType', filters.propertyType);
        }

        // Rooms filter
        if (filters.minRooms !== undefined) params.append('minRooms', String(filters.minRooms));
        if (filters.maxRooms !== undefined) params.append('maxRooms', String(filters.maxRooms));

        // Price filter
        if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
        if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));

        // Area filter
        if (filters.minArea !== undefined) params.append('minArea', String(filters.minArea));
        if (filters.maxArea !== undefined) params.append('maxArea', String(filters.maxArea));

        // Floor filter
        if (filters.floor !== undefined) params.append('floor', String(filters.floor));

        // Parking filter
        if (filters.parking && filters.parking !== 'all') {
          params.append('parking', filters.parking);
        }

        // Furniture filter
        if (filters.furniture && filters.furniture !== 'all') {
          params.append('furniture', filters.furniture);
        }

        // Kitchen filter
        if (filters.kitchen && filters.kitchen !== 'all') {
          params.append('kitchen', filters.kitchen);
        }

        // Position filter
        if (filters.position && filters.position !== 'all') {
          params.append('position', filters.position);
        }

        // Neighborhood filter
        if (filters.neighborhood) {
          params.append('neighborhood', filters.neighborhood);
        }

        // Street filter
        if (filters.street) {
          params.append('street', filters.street);
        }

        // Vacancy date filter
        if (filters.vacancyDate) {
          params.append('vacancyDate', filters.vacancyDate);
        }

        // Feature filters
        if (filters.features?.hasAirConditioning) params.append('hasAirConditioning', 'true');
        if (filters.features?.hasElevator) params.append('hasElevator', 'true');
        if (filters.features?.hasSunBalcony) params.append('hasSunBalcony', 'true');
        if (filters.features?.hasSafeRoom) params.append('hasSafeRoom', 'true');
        if (filters.features?.hasStorage) params.append('hasStorage', 'true');
        if (filters.features?.hasDisabledAccess) params.append('hasDisabledAccess', 'true');

        const response = await fetch(`/api/properties?${params.toString()}`, {
          next: { revalidate: 60 }
        });
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();

        const mappedProperties = data.map((prop: any) => ({
          ...prop,
          bedrooms: prop.rooms,
          category: prop.category || (prop.dealType === 'sale' ? 'sales' : 'rentals'),
          image: prop.images?.[0] || "/images/hero/sales.jpg",
        }));

        // Filter out sold properties
        const filteredProperties = mappedProperties.filter((prop: Property) => !prop.isSold);

        setProperties(filteredProperties);
      } catch (error) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters, selectedCategory]);

  const currentProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return properties.slice(start, start + ITEMS_PER_PAGE);
  }, [properties, currentPage]);

  const updatePage = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <ContactFormPopup isOpen={isContactPopupOpen} onClose={() => setIsContactPopupOpen(false)} />

      {/* Hero Section */}
      <SecondaryHero
        img="/7.jpg"
        title="נכסים למכירה והשכרה"
        centered={true}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs />

      <div className="min-h-screen bg-warm pt-16 pb-16" dir="rtl">
        <div className="mx-auto px-6">

          {/* Categories */}
          <div className="flex justify-center gap-3 mb-10">
            {CATEGORIES.filter(cat => ['all', 'sales', 'rentals'].includes(cat.value)).map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.value); updatePage(1); }}
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
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-5xl mx-auto mb-10">
                {/* <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-gray-100"> */}
                  <PropertyFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onApply={() => updatePage(1)}
                    onReset={() => { setFilters({ dealType: 'all', city: 'all' }); updatePage(1); }}
                  />
                {/* </div> */}
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

              {/* Pagination */}
              {properties.length > ITEMS_PER_PAGE && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center items-center gap-2 mt-12"
                >
                  {/* Previous Button */}
                  <button
                    onClick={() => updatePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#1c3664] border-2 border-gray-200 hover:border-[#1c3664] hover:bg-[#1c3664] hover:text-white'
                    }`}
                  >
                    הקודם
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: Math.ceil(properties.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => updatePage(page)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all ${
                        currentPage === page
                          ? 'bg-[#1c3664] text-white shadow-lg scale-110'
                          : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#1c3664]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => updatePage(currentPage + 1)}
                    disabled={currentPage === Math.ceil(properties.length / ITEMS_PER_PAGE)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      currentPage === Math.ceil(properties.length / ITEMS_PER_PAGE)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-[#1c3664] border-2 border-gray-200 hover:border-[#1c3664] hover:bg-[#1c3664] hover:text-white'
                    }`}
                  >
                    הבא
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function ApartmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApartmentsPageContent />
    </Suspense>
  );
}