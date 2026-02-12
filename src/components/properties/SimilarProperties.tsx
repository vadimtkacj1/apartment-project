"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';

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
  category?: string;
  isSold?: boolean;
}

interface SimilarPropertiesProps {
  currentPropertyId?: number;
  limit?: number;
}

const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  currentPropertyId,
  limit = 3
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        setLoading(true);
        // Fetch properties from API
        const response = await fetch('/api/properties');

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        // Map and filter properties
        const mappedProperties: Property[] = data
          .filter((prop: any) => prop.id !== currentPropertyId) // Exclude current property
          .map((prop: any) => ({
            id: prop.id,
            title: prop.title,
            location: prop.location,
            price: prop.price,
            bedrooms: prop.rooms,
            bathrooms: prop.bathrooms,
            area: prop.area,
            status: prop.status,
            category: prop.category || (prop.dealType === 'sale' ? 'sales' : 'rentals'),
            image: prop.images && prop.images.length > 0 ? prop.images[0] : "/images/hero/sales.jpg",
            isSold: prop.isSold || false,
          }))
          .sort((a, b) => {
            // Sort: sold properties at the end, then randomize
            const aSold = a.isSold || false;
            const bSold = b.isSold || false;
            if (aSold && !bSold) return 1;
            if (!aSold && bSold) return -1;
            return Math.random() - 0.5; // Randomize non-sold properties
          })
          .slice(0, limit); // Limit results

        setProperties(mappedProperties);
      } catch (error) {
        console.error('Error fetching similar properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [currentPropertyId, limit]);

  // Show loading state
  if (loading) {
    return (
      <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-slate-50" dir="rtl">
        <div className="px-6 lg:px-12">
          <div className="text-center py-10">
            <p className="text-gray-600">טוען נכסים דומים...</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't show if no properties
  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-slate-50" dir="rtl">
      <div className="px-6 lg:px-12">
        {/* Заголовок секции */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase">
            נכסים דומים
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#1c3664] to-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            נכסים נוספים שעשויים לעניין אותך
          </p>
        </motion.div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PropertyCard {...property} index={index} isSold={property.isSold} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarProperties;
