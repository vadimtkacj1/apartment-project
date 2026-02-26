"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';

// Define the Property interface to avoid 'any' types
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
        const response = await fetch('/api/properties');

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        const mappedProperties: Property[] = data
          .filter((prop: any) => prop.id !== currentPropertyId)
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
          // FIXED: Explicitly typed parameters 'a' and 'b' to resolve TS7006 error
          .sort((a: Property, b: Property) => {
            const aSold = a.isSold || false;
            const bSold = b.isSold || false;
            if (aSold && !bSold) return 1;
            if (!aSold && bSold) return -1;
            return Math.random() - 0.5;
          })
          .slice(0, limit);

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

  if (loading) {
    return (
      <section className="w-full py-16 bg-[#fdfbf7]" dir="rtl">
        <div className="px-6 lg:px-12">
          <div className="text-center py-10">
            <p className="text-gray-600">טוען נכסים דומים...</p>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-24 " dir="rtl">
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-black text-[#1c3664] mb-4 uppercase" style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}>
            נכסים דומים
          </h2>
          <p className="text-slate-500 text-lg font-medium">
            נכסים נוספים שעשויים לעניין אותך
          </p>
        </motion.div>

        {/* Properties Grid */}
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