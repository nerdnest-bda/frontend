import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { changeLoc } from '../features/locationSlice';
import assign_quadrant from '../utils';

const MapUpdater = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.setView(location, 13, { animate: true });
        }
    }, [location, map]);
    return null;
};

// Create a separate component to handle map events
function MapEvents({ onBoundsChange }) {
  const map = useMap();
  const boundsRef = useRef(null);
  
  useEffect(() => {
    const handleMoveEnd = () => {
      const newBounds = map.getBounds();
      
      // Compare with previous bounds to avoid unnecessary updates
      if (!boundsRef.current || 
          boundsRef.current.northEast.lat !== newBounds.getNorthEast().lat ||
          boundsRef.current.northEast.lng !== newBounds.getNorthEast().lng ||
          boundsRef.current.southWest.lat !== newBounds.getSouthWest().lat ||
          boundsRef.current.southWest.lng !== newBounds.getSouthWest().lng) {
        
        const boundsData = {
          northEast: {
            lat: newBounds.getNorthEast().lat,
            lng: newBounds.getNorthEast().lng
          },
          southWest: {
            lat: newBounds.getSouthWest().lat,
            lng: newBounds.getSouthWest().lng
          },
          center: {
            lat: map.getCenter().lat,
            lng: map.getCenter().lng
          },
          quadrant: assign_quadrant(map.getCenter().lat, map.getCenter().lng)
        };
        
        // Update ref with new bounds
        boundsRef.current = boundsData;
        
        // Call the callback with new bounds
        onBoundsChange(boundsData);
      }
    };

    map.on('moveend', handleMoveEnd);
    
    // Initial bounds update
    handleMoveEnd();
    
    return () => {
      map.off('moveend', handleMoveEnd);
    };
  }, [map, onBoundsChange]);

  return null;
}

const Map = ({ location, collegesInGrid }) => {
  const dispatch = useDispatch();
  const mapKey = useRef(`map-${Date.now()}`).current; // Generate unique key
  
  // Define the callback that will dispatch location updates
  const handleBoundsChange = (bounds) => {
    // Dispatch to Redux
    dispatch(changeLoc(bounds));
  };

  return (
    <div id="mapid" className="md:max-w-[50%] md:min-w-[50%] p-[40px]">
        <MapContainer 
            key={mapKey} // Add unique key here
            center={location} 
            zoom={13} 
            className="h-[500px] w-full rounded-[20px]" // Fixed height value
            scrollWheelZoom={false}  // Changed to true for better UX
        >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Map event handler component */}
        <MapEvents onBoundsChange={handleBoundsChange} />
        
        {/* Render college markers */}
        {collegesInGrid?.map((college) => (
            <Marker 
            key={college._id || `college-${college.coordinates.latitude}-${college.coordinates.longitude}`}
            position={[college.coordinates.latitude, college.coordinates.longitude]}
            >
            <Popup>
                {college.name || "Unnamed University"}
            </Popup>
            </Marker>
        ))}
        <MapUpdater location={location} />
        </MapContainer>
    </div>
  );
};

export default Map;