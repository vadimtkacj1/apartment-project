"use client";
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, Mail } from 'lucide-react';

// Component Imports
import Hero from '@/components/layout/Hero';
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

const ITEMS_PER_PAGE = 12;

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
        if (filters.dealType && filters.dealType !== 'all') params.append('dealType', filters.dealType);
        if (filters.city && filters.city !== 'all') params.append('city', filters.city);
        if (selectedCategory && selectedCategory !== 'all') params.append('category', selectedCategory);

        const response = await fetch(`/api/properties?${params.toString()}`);
        if (!response.ok) throw new Error('Failed');
        const data = await response.json();

        const mappedProperties = data.map((prop: any) => ({
          ...prop,
          bedrooms: prop.rooms,
          category: prop.category || (prop.dealType === 'sale' ? 'sales' : 'rentals'),
          image: prop.images?.[0] || "/images/hero/sales.jpg",
        }));

        // Sort: sold properties at the end
        const sortedProperties = mappedProperties.sort((a: Property, b: Property) => {
          const aSold = a.isSold || false;
          const bSold = b.isSold || false;
          if (aSold && !bSold) return 1;
          if (!aSold && bSold) return -1;
          return 0;
        });

        setProperties(sortedProperties);
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
      <Hero
        img="/7.jpg"
        staticTitle="נכסים למכירה והשכרה"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:pl-20">
              {currentProperties.map((prop, i) => (
                <PropertyCard key={prop.id} {...prop} index={i} />
              ))}
            </div>
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