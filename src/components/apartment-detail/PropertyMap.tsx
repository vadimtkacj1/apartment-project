'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
// @ts-ignore
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="h-112.5 flex items-center justify-center bg-gray-100 rounded-xl">טוען מפה...</div> }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);

interface PropertyMapProps {
  isSold: boolean;
  latitude?: number | null;
  longitude?: number | null;
  location?: string;
}

export function PropertyMap({ isSold, latitude, longitude, location }: PropertyMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        const Leaflet = L.default || L;
        if (Leaflet?.Icon?.Default) {
          const DefaultIcon = Leaflet.Icon.Default;
          const prototype = DefaultIcon.prototype as any;
          if (prototype && '_getIconUrl' in prototype) delete prototype._getIconUrl;
          DefaultIcon.mergeOptions({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          });
        }
        setIsMounted(true);
      });
    }
  }, []);

  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';
  const defaultCenter: [number, number] = [32.0853, 34.7818]; // Tel Aviv
  const center: [number, number] = hasCoordinates ? [latitude!, longitude!] : defaultCenter;

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

      <div dir="ltr" className="rounded-xl overflow-hidden shadow-md" style={{ height: '450px' }}>
        {isMounted ? (
          <MapContainer center={center} zoom={17} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {hasCoordinates && (
              <Marker position={center}>
                {location && (
                  <Tooltip permanent direction="top" offset={[0, 0]}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{location}</span>
                  </Tooltip>
                )}
              </Marker>
            )}
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">טוען מפה...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
