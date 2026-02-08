"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import { PROPERTIES } from '@/data/properties.data';

interface SimilarPropertiesProps {
  currentPropertyId?: number;
  limit?: number;
}

const SimilarProperties: React.FC<SimilarPropertiesProps> = ({
  currentPropertyId,
  limit = 3
}) => {
  // Используем useState для хранения отфильтрованных объектов
  const [filteredProperties, setFilteredProperties] = useState<typeof PROPERTIES>([]);

  useEffect(() => {
    // Фильтруем и перемешиваем только на клиенте
    const filtered = PROPERTIES
      .filter(prop => prop.id !== currentPropertyId)
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    setFilteredProperties(filtered);
  }, [currentPropertyId, limit]);

  if (filteredProperties.length === 0) {
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
          <div className="w-24 h-1 bg-gradient-to-r from-[#C19A6B] to-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            נכסים נוספים שעשויים לעניין אותך
          </p>
        </motion.div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PropertyCard {...property} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarProperties;
