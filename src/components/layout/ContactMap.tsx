'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

interface ContactMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
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

const ContactMap: React.FC<ContactMapProps> = ({ latitude, longitude, address, city }) => {

  // Ensure coordinates are valid numbers
  const validLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : defaultCenter.lat;
  const validLng = typeof longitude === 'number' && !isNaN(longitude) ? longitude : defaultCenter.lng;

  const center = { lat: validLat, lng: validLng };
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    language: 'he',
    region: 'IL',
  });

  // Debug logging
  React.useEffect(() => {
    console.log('ContactMap coordinates:', {
      received: { latitude, longitude },
      using: { validLat, validLng },
      address,
      city
    });
  }, [latitude, longitude, validLat, validLng, address, city]);

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return (
      <div style={{
        height: '100%',
        background: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Google Maps API key is missing</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{
        height: '100%',
        background: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Google Maps failed to load</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Check API key, billing, and allowed referrer domains</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{
        height: '100%',
        background: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p>טוען מפה...</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={getMapOptions()}
      >
        <Marker
          position={center}
          title={address || city || 'מיקום'}
        />

        {(address || city) && (
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
              {address && <strong style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>{address}</strong>}
              {city && <div style={{ fontSize: '10px' }}>{city}</div>}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default ContactMap;
