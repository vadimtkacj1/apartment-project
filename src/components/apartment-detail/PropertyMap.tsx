import React from 'react';
import { motion } from 'framer-motion';

interface PropertyMapProps {
  isSold: boolean;
}

export function PropertyMap({ isSold }: PropertyMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`rounded-2xl p-8 shadow-lg border ${
        isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
      }`}
    >
      <h2 className={`text-3xl font-black mb-6 uppercase ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`}>מיקום</h2>
      <div className="rounded-xl overflow-hidden shadow-md">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3381.9441877937624!2d34.774577815081994!3d32.01615298119051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4b8b5c4e5e5d%3A0x5c5e5e5d5c4b8b5c!2z15fXldec15XXnw!5e0!3m2!1siw!2sil!4v1234567890123!5m2!1siw!2sil"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full"
        />
      </div>
    </motion.div>
  );
}
