"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/properties/PropertyCard';
import { SlidersHorizontal, Search } from 'lucide-react';

type Category = 'all' | 'sales' | 'rentals' | 'management' | 'land' | 'commercial';
type City = 'all' | 'holon' | 'batyam' | 'rishon';
type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc';

export default function ApartmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedCity, setSelectedCity] = useState<City>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9;

  const categories = [
    { id: 'all', label: 'הכל', value: 'all' },
    { id: 'sales', label: 'מכירות', value: 'sales' },
    { id: 'rentals', label: 'השכרות', value: 'rentals' },
    { id: 'management', label: 'ניהול נכסים', value: 'management' },
    { id: 'land', label: 'קרקעות ומגרשים', value: 'land' },
    { id: 'commercial', label: 'נדל״ן מסחרי', value: 'commercial' }
  ];

  const cities = [
    { id: 'all', label: 'כל הערים', value: 'all' },
    { id: 'holon', label: 'חולון', value: 'holon' },
    { id: 'batyam', label: 'בת ים', value: 'batyam' },
    { id: 'rishon', label: 'ראשון לציון', value: 'rishon' }
  ];

  // Sample properties data
  const properties = [
    {
      id: 1,
      image: "/images/hero/sales.jpg",
      title: "דירת 4 חדרים מרווחת במרכז חולון",
      location: "חולון",
      price: "1,950,000",
      bedrooms: 4,
      bathrooms: 2,
      area: 110,
      status: "בלעדיות",
      category: "sales"
    },
    {
      id: 2,
      image: "/images/hero/rentals.webp",
      title: "דירת 3 חדרים משופצת - להשכרה",
      location: "בת ים",
      price: "5,500",
      bedrooms: 3,
      bathrooms: 1.5,
      area: 85,
      status: "חדש",
      category: "rentals"
    },
    {
      id: 3,
      image: "/images/hero/rent.png",
      title: "פנטהאוז יוקרתי עם גג",
      location: "ראשון לציון",
      price: "3,200,000",
      bedrooms: 5,
      bathrooms: 3,
      area: 160,
      status: "בלעדיות",
      category: "sales"
    },
    {
      id: 4,
      image: "/images/hero/sales.jpg",
      title: "דירת 2 חדרים קומה גבוהה",
      location: "חולון",
      price: "4,200",
      bedrooms: 2,
      bathrooms: 1,
      area: 65,
      category: "rentals"
    },
    {
      id: 5,
      image: "/images/hero/rentals.webp",
      title: "מגרש לבנייה במיקום מרכזי",
      location: "ראשון לציון",
      price: "2,800,000",
      bedrooms: 0,
      bathrooms: 0,
      area: 500,
      status: "הזדמנות",
      category: "land"
    },
    {
      id: 6,
      image: "/images/hero/rent.png",
      title: "מחסן מסחרי + משרדים",
      location: "בת ים",
      price: "15,000",
      bedrooms: 0,
      bathrooms: 2,
      area: 250,
      category: "commercial"
    }
  ];

  // Filter properties
  const filteredProperties = properties.filter(property => {
    if (selectedCategory !== 'all' && property.category !== selectedCategory) return false;
    if (selectedCity !== 'all' && property.location !== cities.find(c => c.value === selectedCity)?.label) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-32 pb-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            נכסים למכירה והשכרה
          </h1>
          <p className="text-xl text-gray-600 font-semibold">
            נמצאו {filteredProperties.length} נכסים
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.value as Category)}
                className={`px-6 py-3 rounded-xl font-bold text-base uppercase tracking-tight transition-all duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-[#C19A6B] text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filters Toggle & Sort */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-900 hover:border-[#C19A6B] transition-all duration-300"
          >
            <SlidersHorizontal size={20} />
            <span>{showFilters ? 'הסתר פילטרים' : 'הצג פילטרים'}</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-semibold">מיון:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-900 focus:border-[#C19A6B] focus:outline-none transition-all duration-300"
            >
              <option value="newest">חדש ביותר</option>
              <option value="price-asc">מחיר: נמוך לגבוה</option>
              <option value="price-desc">מחיר: גבוה לנמוך</option>
              <option value="area-asc">שטח: קטן לגדול</option>
              <option value="area-desc">שטח: גדול לקטן</option>
            </select>
          </div>
        </motion.div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                  עיר
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value as City)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.value}>
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                  טווח מחירים
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="מ-"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="number"
                    placeholder="עד-"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Rooms */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase">
                  חדרים
                </label>
                <select className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-semibold text-gray-900 focus:border-[#C19A6B] focus:bg-white focus:outline-none transition-all duration-300">
                  <option value="">כל הכמויות</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-6 py-3 bg-[#C19A6B] text-white font-black text-base uppercase rounded-xl hover:bg-gray-900 transition-all duration-300 shadow-lg">
                החל פילטרים
              </button>
              <button
                onClick={() => {
                  setSelectedCity('all');
                  setCurrentPage(1);
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold text-base uppercase rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                אפס
              </button>
            </div>
          </motion.div>
        )}

        {/* Properties Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {currentProperties.map((property, index) => (
            <PropertyCard
              key={property.id}
              {...property}
              index={index}
            />
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center items-center gap-2 mt-12"
          >
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-[#C19A6B]'
              }`}
            >
              הקודם
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-[#C19A6B] text-white shadow-lg scale-110'
                      : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-[#C19A6B]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-[#C19A6B]'
              }`}
            >
              הבא
            </button>
          </motion.div>
        )}

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">לא נמצאו תוצאות</h3>
            <p className="text-gray-600 font-semibold">נסה לשנות את הפילטרים או את הקטגוריה</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
