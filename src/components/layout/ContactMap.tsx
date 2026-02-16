'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// @ts-ignore
import 'leaflet/dist/leaflet.css';

// Dynamically import React-Leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>טוען מפה...</div> }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface ContactMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
}

const ContactMap: React.FC<ContactMapProps> = ({ latitude, longitude, address, city }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Leaflet icon only on client side
      import('leaflet').then((L) => {
        // Fix Leaflet default icon issue in Next.js
        const Leaflet = L.default || L;
        if (Leaflet && Leaflet.Icon && Leaflet.Icon.Default) {
          const DefaultIcon = Leaflet.Icon.Default;
          const prototype = DefaultIcon.prototype as any;

          // Remove _getIconUrl if it exists
          if (prototype && '_getIconUrl' in prototype) {
            delete prototype._getIconUrl;
          }

          // Set icon URLs using CDN
          DefaultIcon.mergeOptions({
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          });
        }

        setIsMounted(true);
      }).catch((error) => {
        console.error('Error loading Leaflet:', error);
        setIsMounted(true);
      });
    }
  }, []);

  // Ensure coordinates are valid numbers
  // Leaflet uses [latitude, longitude] format
  const validLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : 32.0853;
  const validLng = typeof longitude === 'number' && !isNaN(longitude) ? longitude : 34.7818;
  
  // Debug logging
  useEffect(() => {
    console.log('ContactMap coordinates:', { 
      received: { latitude, longitude },
      using: { validLat, validLng },
      address,
      city
    });
  }, [latitude, longitude, validLat, validLng, address, city]);
  
  const center: [number, number] = [validLat, validLng];

  if (!isMounted || typeof window === 'undefined') {
    return (
      <div style={{ height: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>טוען מפה...</span>
      </div>
    );
  }

  return (
    <MapContainer
      key={`map-${validLat}-${validLng}`}
      center={center}
      zoom={15}
      style={{ height: '100%', width: '100%', zIndex: 1 }}
      scrollWheelZoom={false}
      dragging={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[validLat, validLng]}>
        {(address || city) && (
          <Popup>
            <div style={{ textAlign: 'center', fontFamily: 'inherit' }}>
              <strong>{address}</strong>
              {city && <div>{city}</div>}
            </div>
          </Popup>
        )}
      </Marker>
    </MapContainer>
  );
};

export default ContactMap;
