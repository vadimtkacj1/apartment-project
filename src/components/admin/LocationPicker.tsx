'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/button';
import { toast } from '@/components/shadcn/sonner';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAdminMessages } from '@/lib/adminI18n';
import { uploadersMessages } from '@/lib/adminI18n/messages/uploaders';

interface Position {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  position: Position | null;
  onPositionChange: (position: Position) => void;
  onAddressChange?: (address: any) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px',
  border: '1px solid #dee2e6',
};

const defaultCenter = {
  lat: 32.0158,
  lng: 34.7874,
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

const LocationPicker: React.FC<LocationPickerProps> = ({
  position,
  onPositionChange,
  onAddressChange,
}) => {
  const t = useAdminMessages(uploadersMessages);
  const [searchAddress, setSearchAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<Position | null>(position);
  const [currentAddress, setCurrentAddress] = useState<{ city?: string; street?: string; streetNumber?: string; neighborhood?: string } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    language: 'he',
    region: 'IL',
    version: 'weekly', // Актуальная версия (3.55 retired)
  });

  // Load address when position is provided initially
  useEffect(() => {
    if (position && position.lat && position.lng) {
      fetchAddressFromCoords(position.lat, position.lng);
    }
  }, []);

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
      const data = await response.json();

      if (data.success && data.results?.length > 0) {
        const result = data.results[0];
        const addressData = {
          city: result.city || '',
          street: result.street || '',
          streetNumber: result.streetNumber || '',
          neighborhood: result.neighborhood || '',
          postcode: result.postcode || ''
        };
        
        setCurrentAddress(addressData);
        
        if (onAddressChange) {
          onAddressChange(addressData);
        }
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
      const normalizedTerm = term.replace(/[\s-]/g, '');
      const isPostalCode = /^\d{5,7}$/.test(normalizedTerm);

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

        if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
          throw new Error('Invalid coordinates received');
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          throw new Error('Coordinates out of valid range');
        }

        const isWithinIsrael = lat >= 29 && lat <= 33.5 && lng >= 34 && lng <= 36;
        const mightBeSwapped = lng >= 29 && lng <= 33.5 && lat >= 34 && lat <= 36;

        if (mightBeSwapped && !isWithinIsrael) {
          console.warn('Coordinates appear to be swapped, fixing...', { lat, lng });
          [lat, lng] = [lng, lat];
        }

        if (!isWithinIsrael && !mightBeSwapped) {
          console.warn('Coordinates outside Israel bounds:', { lat, lng });
        }

        handlePositionChange({ lat, lng });

        const addressData = {
          city: result.city || '',
          street: result.street || '',
          streetNumber: result.streetNumber || '',
          neighborhood: result.neighborhood || '',
          postcode: result.postcode || ''
        };
        
        setCurrentAddress(addressData);
        
        if (onAddressChange) {
          onAddressChange(addressData);
        }

        toast.success(t.foundResult(result.formatted || result.city || term));
      } else {
        console.log('No results found for term:', term, 'Response:', data);
        const errorMsg = data.error || t.noResults;
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      const errorMessage = error.message || t.searchError;
      toast.error(t.searchErrorWith(errorMessage));
    } finally {
      setSearching(false);
    }
  };

  const handlePositionChange = (newPosition: Position) => {
    setMarkerPosition(newPosition);
    onPositionChange(newPosition);
    fetchAddressFromCoords(newPosition.lat, newPosition.lng);

    // Center map on new position
    if (mapRef.current) {
      mapRef.current.panTo(newPosition);
    }
  };

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handlePositionChange({ lat, lng });
    }
  }, []);

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      handlePositionChange({ lat, lng });
    }
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return (
      <div style={{
        width: '100%',
        padding: '40px',
        background: '#F1F3F5',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          Google Maps API key is missing
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file
        </p>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
          Get your API key at: https://console.cloud.google.com/
        </p>
      </div>
    );
  }

  const center = markerPosition || position || defaultCenter;

  if (loadError) {
    return (
      <div style={{
        width: '100%',
        padding: '40px',
        background: '#F1F3F5',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '16px' }}>
          Google Maps failed to load
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Check API key, billing, and allowed referrer domains
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <div className="flex w-full">
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 size-4 text-muted-foreground" />
              <Input
                className="h-11 ps-9 rounded-e-none"
                placeholder={t.searchPlaceholder}
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                disabled
              />
            </div>
            <Button
              type="button"
              size="lg"
              className="rounded-s-none"
              onClick={searchAddressOnMap}
              disabled
            >
              <Loader2 className="size-4 animate-spin" />
              {t.search}
            </Button>
          </div>
        </div>
        <div style={{
          width: '100%',
          height: '500px',
          borderRadius: '12px',
          border: '1px solid #dee2e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F1F3F5'
        }}>
          <p>{t.loadingMap}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '16px' }}>
        <div className="flex w-full">
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute top-1/2 -translate-y-1/2 start-3 size-4 text-muted-foreground" />
            <Input
              className="h-11 ps-9 rounded-e-none"
              placeholder={t.searchPlaceholder}
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') searchAddressOnMap();
              }}
            />
          </div>
          <Button
            type="button"
            size="lg"
            className="rounded-s-none"
            onClick={searchAddressOnMap}
            disabled={searching}
          >
            {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
            {t.search}
          </Button>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        options={getMapOptions()}
        onClick={handleMapClick}
        onLoad={onLoad}
      >
        {markerPosition && (
          <>
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
            {currentAddress && (currentAddress.street || currentAddress.city) && (
              <InfoWindow 
                position={markerPosition}
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
                  {currentAddress.street && currentAddress.streetNumber && (
                    <strong style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>
                      {currentAddress.street} {currentAddress.streetNumber}
                    </strong>
                  )}
                  {currentAddress.neighborhood && (
                    <div style={{ fontSize: '10px', marginBottom: '2px' }}>{currentAddress.neighborhood}</div>
                  )}
                  {currentAddress.city && (
                    <div style={{ fontSize: '10px' }}>{currentAddress.city}</div>
                  )}
                </div>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default LocationPicker;
