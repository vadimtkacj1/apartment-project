'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// @ts-ignore
import 'leaflet/dist/leaflet.css';

// Dynamically import React-Leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>טוען מפה...</div> }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const DraggableMarker = dynamic(
  () => import('./MapEventHandlers').then((mod) => mod.DraggableMarker),
  { ssr: false }
);

const MapClickHandler = dynamic(
  () => import('./MapEventHandlers').then((mod) => mod.MapClickHandler),
  { ssr: false }
);

const MapCenterer = dynamic(
  () => import('./MapEventHandlers').then((mod) => mod.MapCenterer),
  { ssr: false }
);

interface Position {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  position: Position | null;
  onPositionChange: (position: Position) => void;
  onAddressChange?: (address: AddressData) => void;
}

interface AddressData {
  city?: string;
  street?: string;
  streetNumber?: string;
  neighborhood?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  position,
  onPositionChange,
  onAddressChange,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // Reverse geocoding: get address from coordinates
  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    if (!onAddressChange) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=he`
      );
      const data = await response.json();

      if (data && data.address) {
        const address: AddressData = {
          city: data.address.city || data.address.town || data.address.village || '',
          street: data.address.road || '',
          streetNumber: data.address.house_number || '',
          neighborhood: data.address.suburb || data.address.neighbourhood || '',
        };

        onAddressChange(address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handlePositionChange = (newPosition: Position) => {
    onPositionChange(newPosition);
    fetchAddressFromCoords(newPosition.lat, newPosition.lng);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Leaflet icon only on client side
      import('leaflet').then((L) => {
        // Fix Leaflet default icon issue in Next.js
        // Use CDN URLs for icons to avoid SSR issues
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
        // Still try to render even if there's an error
        setIsMounted(true);
      });
    }
  }, []);

  // Default center (Tel Aviv, Israel)
  const defaultCenter: [number, number] = [32.0853, 34.7818];
  const center: [number, number] = position
    ? [position.lat, position.lng]
    : defaultCenter;

  if (!isMounted || typeof window === 'undefined') {
    return (
      <div className="w-100" style={{ height: '400px', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>טוען מפה...</span>
      </div>
    );
  }

  return (
    <div className="location-picker" style={{ 
      height: '500px', 
      width: '100%', 
      position: 'relative', 
      zIndex: 1,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #dee2e6'
    }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onPositionChange={handlePositionChange} />
        <MapCenterer position={position} />
        {position && <DraggableMarker position={position} onPositionChange={handlePositionChange} />}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
