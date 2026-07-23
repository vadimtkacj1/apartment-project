'use client';

import React from 'react';
import { m } from 'framer-motion';
import { MapPin } from 'lucide-react';
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
    version: 'weekly', // Актуальная версия (3.55 retired)
  });

  // No coordinates: never show a map centered on the Tel Aviv fallback —
  // render a plain location card instead (hooks above already ran, so this
  // early return is safe).
  if (!hasCoordinates) {
    if (!location) return null;
    return (
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={`rounded-2xl p-8 mb-8 shadow-lg border ${
          isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
        }`}
      >
        <h2 className={`text-2xl font-black mb-4 ${
          isSold ? 'text-gray-500 line-through' : 'text-gray-900'
        }`}>מיקום</h2>
        <div className="flex items-center gap-2 text-base font-semibold text-[#475569]">
          <MapPin size={18} className="shrink-0 text-[#354AC4]" aria-hidden="true" />
          <span>{location}</span>
        </div>
      </m.div>
    );
  }

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return (
      <m.div
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
            <p className="text-gray-600 mb-2">מפתח המפה חסר</p>
            <p className="text-sm text-gray-500">יש להוסיף את NEXT_PUBLIC_GOOGLE_MAPS_API_KEY לקובץ ה-env</p>
          </div>
        </div>
      </m.div>
    );
  }

  if (loadError) {
    return (
      <m.div
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
            <p className="text-gray-600 mb-2">טעינת המפה נכשלה</p>
            <p className="text-sm text-gray-500">אנא נסו לרענן את העמוד</p>
          </div>
        </div>
      </m.div>
    );
  }

  if (!isLoaded) {
    return (
      <m.div
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
      </m.div>
    );
  }

  return (
    <m.div
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
    </m.div>
  );
}
