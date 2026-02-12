'use client';

import { useEffect, useState } from 'react';
import { useMapEvents, useMap } from 'react-leaflet';
import { Marker, useMap as useMapContext } from 'react-leaflet';
import L from 'leaflet';

interface Position {
  lat: number;
  lng: number;
}

interface MapClickHandlerProps {
  onPositionChange: (position: Position) => void;
}

export function MapClickHandler({ onPositionChange }: MapClickHandlerProps) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onPositionChange({ lat, lng });
      // Also update marker position if it exists
      map.setView([lat, lng], map.getZoom());
    },
  });

  return null;
}

interface MapCentererProps {
  position: Position | null;
}

export function MapCenterer({ position }: MapCentererProps) {
  const map = useMap();

  useEffect(() => {
    if (position && map) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);

  return null;
}

interface DraggableMarkerProps {
  position: Position;
  onPositionChange: (position: Position) => void;
}

export function DraggableMarker({ position, onPositionChange }: DraggableMarkerProps) {
  const [currentPosition, setCurrentPosition] = useState(position);

  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const eventHandlers = {
    dragend(e: any) {
      const marker = e.target;
      const newPosition = marker.getLatLng();
      setCurrentPosition({ lat: newPosition.lat, lng: newPosition.lng });
      onPositionChange({ lat: newPosition.lat, lng: newPosition.lng });
    },
  };

  return (
    <Marker
      position={[currentPosition.lat, currentPosition.lng]}
      draggable={true}
      eventHandlers={eventHandlers}
    />
  );
}

