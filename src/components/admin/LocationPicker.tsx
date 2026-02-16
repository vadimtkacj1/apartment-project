'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Input, Button, Space, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';
// @ts-ignore
import 'leaflet/dist/leaflet.css';

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
  onAddressChange?: (address: any) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  position,
  onPositionChange,
  onAddressChange,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [searching, setSearching] = useState(false); 

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    if (!onAddressChange) return;
    try {
      const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      const data = await response.json();

      if (data.success && data.results?.length > 0) {
        const result = data.results[0];
        onAddressChange({
          city: result.city || '',
          street: result.street || '',
          streetNumber: result.streetNumber || '',
          neighborhood: result.neighborhood || '',
          postcode: result.postcode || ''
        });
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const searchAddressOnMap = async () => {
    const term = searchAddress.trim();
    if (!term) return;

    setSearching(true);
    try {
      // Check if it's a postal code (Israeli postal codes are 5 or 7 digits, may contain spaces or dashes)
      const normalizedTerm = term.replace(/[\s-]/g, '');
      const isPostalCode = /^\d{5,7}$/.test(normalizedTerm);

      // Use our server-side geocoding API
      const params = new URLSearchParams();
      if (isPostalCode) {
        params.append('postalCode', normalizedTerm);
      } else {
        params.append('address', term);
      }

      const response = await fetch(`/api/geocode?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.success && data.results?.length > 0) {
        const result = data.results[0];
        let { lat, lng } = result;

        // Validate coordinates
        if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
          throw new Error('Invalid coordinates received');
        }

        // Additional validation: ensure coordinates are within reasonable bounds
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          throw new Error('Coordinates out of valid range');
        }

        // For Israel, validate coordinates are within country bounds (lat: 29-33.5, lng: 34-36)
        // This helps catch coordinate swap issues
        const isWithinIsrael = lat >= 29 && lat <= 33.5 && lng >= 34 && lng <= 36;
        const mightBeSwapped = lng >= 29 && lng <= 33.5 && lat >= 34 && lat <= 36;
        
        if (mightBeSwapped && !isWithinIsrael) {
          console.warn('Coordinates appear to be swapped, fixing...', { lat, lng });
          // Swap coordinates
          [lat, lng] = [lng, lat];
        }

        if (!isWithinIsrael && !mightBeSwapped) {
          console.warn('Coordinates outside Israel bounds:', { lat, lng });
          // Still use them but warn - might be intentional for other countries
        }

        handlePositionChange({ lat, lng });

        // Update address fields if callback provided
        if (onAddressChange) {
          onAddressChange({
            city: result.city || '',
            street: result.street || '',
            streetNumber: result.streetNumber || '',
            neighborhood: result.neighborhood || '',
            postcode: result.postcode || ''
          });
        }

        message.success(`נמצא: ${result.formatted || result.city || term}`);
      } else {
        console.log('No results found for term:', term, 'Response:', data);
        const errorMsg = data.error || 'לא נמצאו תוצאות. בדוק את המיקוד או הכתובת';
        message.error(errorMsg);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      const errorMessage = error.message || 'שגיאה בחיפוש';
      message.error(`שגיאה בחיפוש: ${errorMessage}`);
    } finally {
      setSearching(false);
    }
  };

  const handlePositionChange = (newPosition: Position) => {
    onPositionChange(newPosition);
    fetchAddressFromCoords(newPosition.lat, newPosition.lng);
  };

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

  const defaultCenter: [number, number] = [32.0158, 34.7874];
  const center: [number, number] = position ? [position.lat, position.lng] : defaultCenter;

  if (!isMounted || typeof window === 'undefined') return null;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            size="large"
            placeholder="הזן מיקוד או כתובת"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onPressEnter={searchAddressOnMap}
            prefix={<EnvironmentOutlined />}
          />
          <Button type="primary" size="large" icon={<SearchOutlined />} onClick={searchAddressOnMap} loading={searching}>
            חפש
          </Button>
        </Space.Compact>
      </div>

      <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #dee2e6' }}>
        <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler onPositionChange={handlePositionChange} />
          <MapCenterer position={position} />
          {position && <DraggableMarker position={position} onPositionChange={handlePositionChange} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;