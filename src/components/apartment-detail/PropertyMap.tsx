'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

interface PropertyMapProps {
  isSold: boolean;
  latitude?: number | null;
  longitude?: number | null;
  location?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '450px',
  borderRadius: '12px',
};

const defaultCenter = {
  lat: 32.0853,
  lng: 34.7818, // Tel Aviv
};

const getMapOptions = (): google.maps.MapOptions => ({
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: 0 as google.maps.MapTypeControlStyle, // HORIZONTAL_BAR = 0
    position: 3 as google.maps.ControlPosition, // TOP_RIGHT = 3
    mapTypeIds: ['roadmap', 'satellite'] as google.maps.MapTypeId[]
  },
  fullscreenControl: true,
  mapTypeId: 'roadmap' as google.maps.MapTypeId,
  gestureHandling: 'cooperative',
  maxZoom: 18,
  minZoom: 12,
  disableDoubleClickZoom: false,
});

export function PropertyMap({ isSold, latitude, longitude, location }: PropertyMapProps) {
  const hasCoordinates = typeof latitude === 'number' && typeof longitude === 'number';
  const center = hasCoordinates ? { lat: latitude!, lng: longitude! } : defaultCenter;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    language: 'he',
    region: 'IL',
  });

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
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
        <div className="rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center" style={{ height: '450px' }}>
          <div className="text-center p-8">
            <p className="text-gray-600 mb-2">Google Maps API key is missing</p>
            <p className="text-sm text-gray-500">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (loadError) {
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
        <div className="rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center" style={{ height: '450px' }}>
          <div className="text-center p-8">
            <p className="text-gray-600 mb-2">Google Maps failed to load</p>
            <p className="text-sm text-gray-500">Check API key, billing, and allowed referrer domains</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!isLoaded) {
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
        <div className="rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center" style={{ height: '450px' }}>
          <div className="text-center p-8">
            <p className="text-gray-600">טוען מפה...</p>
          </div>
        </div>
      </motion.div>
    );
  }

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

      <div dir="ltr" className="rounded-xl overflow-hidden shadow-md">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={getMapOptions()}
        >
          {hasCoordinates && (
            <>
              <Marker
                position={center}
                title={location || 'מיקום הנכס'}
              />
              {location && (
                <InfoWindow 
                  position={center}
                  options={{
                    pixelOffset: typeof window !== 'undefined' && window.google?.maps 
                      ? new window.google.maps.Size(0, -40)
                      : undefined
                  }}
                >
                  <div style={{ 
                    textAlign: 'right', 
                    fontFamily: 'inherit', 
                    padding: '6px 8px',
                    direction: 'rtl',
                    whiteSpace: 'nowrap'
                  }}>
                    <strong style={{ fontSize: '11px', fontWeight: 'bold' }}>{location}</strong>
                  </div>
                </InfoWindow>
              )}
            </>
          )}
        </GoogleMap>
      </div>
    </motion.div>
  );
}
