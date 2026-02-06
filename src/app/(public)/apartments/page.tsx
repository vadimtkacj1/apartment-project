"use client";
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search, Mail } from 'lucide-react';

// Component Imports
import PropertyCard from '@/components/properties/PropertyCard';
import PropertyFilters from '@/components/properties/PropertyFilters';
import ContactFormPopup from '@/components/layout/ContactFormPopup';

// Logic & Data Imports
import { FilterState } from '@/types/property.types';

import { 
  PROPERTIES, 
  CATEGORIES, 
  Category, 
  SortOption, 
  filterProperties 
} from '@/data/properties.data';

/**
 * Interface to resolve Error 7006 (Implicit any)
 */
interface Property {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status?: string;
  category: string;
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

  // --- UI State ---
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ dealType: 'all', city: 'all' });

  // --- Sync Pagination with URL ---
  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    if (pageFromUrl) setCurrentPage(parseInt(pageFromUrl, 10));
  }, [searchParams]);

  // --- Memoized Filtering Logic ---
  const filteredProperties = useMemo(() => 
    filterProperties(PROPERTIES, selectedCategory, filters), 
  [selectedCategory, filters]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const currentProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  // --- Navigation Handlers ---
  const updatePage = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    updatePage(1);
  };

  return (
    <>
      <ContactFormPopup isOpen={isContactPopupOpen} onClose={() => setIsContactPopupOpen(false)} />

      {/* FIXED CONTACT BUTTON (MATCHING PHOTO) */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsContactPopupOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-[#C19A6B] text-white py-6 px-3 rounded-r-2xl shadow-2xl hover:bg-gray-900 transition-all flex flex-col items-center gap-4 group border-y border-r border-white/20"
      >
        <Mail size={24} className="mb-1" />
        <span 
          className="font-bold tracking-widest uppercase"
          style={{ 
            writingMode: 'vertical-rl', 
            textOrientation: 'mixed',
            letterSpacing: '0.1em'
          }}
        >
          צור קשר
        </span>
      </motion.button>

      {/* Main Content */}
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white pt-32 pb-16" dir="rtl">
        <div className="w-full mx-auto px-6 lg:px-12">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tight">
              נכסים למכירה והשכרה
            </h1>
            <p className="text-xl text-gray-600 font-semibold">
              נמצאו {filteredProperties.length} תוצאות
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {CATEGORIES.map((cat: CategoryItem) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.value as Category)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                  selectedCategory === cat.value
                    ? 'bg-[#C19A6B] text-white shadow-2xl border border-white/20 scale-105'
                    : 'bg-white text-gray-700 border border-gray-200 hover:shadow-lg hover:scale-105'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-900 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <SlidersHorizontal size={20} />
              <span>{showFilters ? 'הסתר פילטרים' : 'הצג פילטרים'}</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-semibold">מיון:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold focus:border-[#C19A6B] outline-none shadow-md hover:shadow-lg transition-all duration-300"
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
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <PropertyFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onApply={() => updatePage(1)}
                  onReset={() => {
                    setFilters({ dealType: 'all', city: 'all' });
                    setSelectedCategory('all');
                    updatePage(1);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {currentProperties.map((property: Property, index: number) => (
              <PropertyCard key={property.id} {...property} index={index} />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-20">
              <Search size={40} className="mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-black text-gray-900">לא נמצאו תוצאות</h3>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => updatePage(page)}
                  className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-[#C19A6B] text-white shadow-2xl scale-110 border border-white/20'
                      : 'bg-white border border-gray-200 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {page}
                </button>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ApartmentsPageContent />
    </Suspense>
  );
}