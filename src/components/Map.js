import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import LocationInfoBox from './LocationInfoBox';

// Helper to extract coordinates (latitude and longitude) from different GeoJSON geometry types
const getEventCoordinates = (geometry) => {
  if (!geometry || !geometry.coordinates) return null;
  const { type, coordinates } = geometry;
  
  if (type === 'Point') {
    return {
      lng: coordinates[0],
      lat: coordinates[1]
    };
  } else if (type === 'Polygon' || type === 'MultiLineString') {
    // Return the first coordinate of the first path
    const ring = coordinates[0];
    if (ring && ring.length > 0) {
      const firstCoord = Array.isArray(ring[0]) ? ring[0] : ring;
      return {
        lng: firstCoord[0],
        lat: firstCoord[1]
      };
    }
  } else if (type === 'LineString') {
    if (coordinates.length > 0) {
      return {
        lng: coordinates[0][0],
        lat: coordinates[0][1]
      };
    }
  }
  return null;
};

// Create a custom Leaflet DivIcon based on category and selection
const createCustomIcon = (catId, isSelected) => {
  let emoji = '⚠️';
  let colorClass = 'default';

  if (catId === 'wildfires') {
    emoji = '🔥';
    colorClass = 'fire';
  } else if (catId === 'severeStorms') {
    emoji = '🌀';
    colorClass = 'storm';
  } else if (catId === 'volcanoes') {
    emoji = '🌋';
    colorClass = 'volcano';
  }

  return L.divIcon({
    html: `
      <div class="custom-marker-wrapper ${isSelected ? 'selected' : ''}">
        <div class="marker-icon marker-icon-${colorClass}">${emoji}</div>
      </div>
    `,
    className: 'custom-leaflet-icon-container',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

// Component to dynamically transition map viewport when selectedEvent changes
const ChangeMapView = ({ event }) => {
  const map = useMap();

  useEffect(() => {
    if (event) {
      const coords = getEventCoordinates(event.geometry);
      if (coords) {
        map.flyTo([coords.lat, coords.lng], 7, {
          animate: true,
          duration: 1.5
        });
      }
    }
  }, [event, map]);

  return null;
};

const Map = ({ eventData, selectedEvent, onMarkerClick, onCloseInfo, theme }) => {
  // Center of North America by default
  const defaultCenter = [39.8283, -98.5795];
  const defaultZoom = 3; // Zoom out slightly more by default for global view
  const earthBounds = [[-85, -180], [85, 180]];

  return (
    <div className="map-container-wrapper">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        minZoom={2}
        maxBounds={earthBounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        zoomControl={false} // We will position our zoom control or let CSS place it beautifully
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          key={theme}
          url={theme === 'dark'
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          }
          noWrap={true}
          bounds={earthBounds}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {eventData.map((ev) => {
          const coords = getEventCoordinates(ev.geometry);
          if (!coords) return null;

          const catId = ev.properties.categories?.[0]?.id;
          const isSelected = selectedEvent && selectedEvent.properties.id === ev.properties.id;

          return (
            <Marker
              key={ev.properties.id}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(catId, isSelected)}
              eventHandlers={{
                click: () => {
                  onMarkerClick(ev);
                }
              }}
            />
          );
        })}

        <ChangeMapView event={selectedEvent} />
      </MapContainer>

      {/* Floating Info Box on top of Map */}
      <LocationInfoBox event={selectedEvent} onClose={onCloseInfo} />
    </div>
  );
};

export default Map;
