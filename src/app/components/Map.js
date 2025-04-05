import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import styles from "../styles/Map.css"
import { useDispatch } from 'react-redux';
import { changeLoc } from '../features/locationSlice';
import assign_quadrant from '../utils';

// const MapEvents = ({ onBoundsChange }) => {
//     const map = useMapEvents({
//         moveend: () => {
//             const bounds = map.getBounds();
//             onBoundsChange({
//                 northEast: {
//                     lat: bounds.getNorthEast().lat,
//                     lng: bounds.getNorthEast().lng
//                 },
//                 southWest: {
//                     lat: bounds.getSouthWest().lat,
//                     lng: bounds.getSouthWest().lng
//                 },
//                 southEast: {
//                     lat: bounds.getSouthEast().lat,
//                     lng: bounds.getSouthEast().lng
//                 },
//                 northWest: {
//                     lat: bounds.getNorthWest().lat,
//                     lng: bounds.getNorthWest().lng
//                 },
//                 center: {
//                     lat: map.getCenter().lat,
//                     lng: map.getCenter().lng
//                 },
//                 quadrant: assign_quadrant(map.getCenter().lat, map.getCenter().lng)
//             });
//         },
    
//       });
//       return null;
// }

const MapUpdater = ({ location }) => {
    const map = useMap();
    useEffect(() => {
        if (location) {
            map.setView(location, 13, { animate: true });
        }
    }, [location, map]);
    return null;
};

// const Map = ({location, collegesInGrid}) => {


//     const [bounds, setBounds] = useState(null);
//     const [clickedCoords, setClickedCoords] = useState(null);

//     const dispatch = useDispatch();
    
//     useEffect(() => {
//         dispatch(changeLoc({
//             ...bounds
//         }))
//     },[bounds, dispatch])



//     return (
//         <div  id="mapid" className="md:max-w-[50%] md:min-w-[50%] p-[40px]">
//             <MapContainer center={location} zoom={13} scrollWheelZoom={false} className={`h-[100%] rounded-[20px]`}>
//                 <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 <MapEvents 
//                     onBoundsChange={setBounds}
//                 />
//                 {
//                     collegesInGrid?.map((college) => {
//                         const lat = college.coordinates?.lat ?? college.coordinates?.latitude;
//                         const lng = college.coordinates?.lng ?? college.coordinates?.longitude;

//                         if (lat === undefined || lng === undefined) return null;

//                         return (
//                         <Marker position={[parseFloat(lat), parseFloat(lng)]} key={college._id}>
//                             <Popup>
//                             {college.name || "Unnamed College"}
//                             </Popup>
//                         </Marker>
//                         );
//                     })
//                     }
//                 <MapUpdater location={location} />

//             </MapContainer>
//         </div>
//     );
// }

// export default Map


// import React, { useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, useMap } from 'react-leaflet';
// import { useDispatch } from 'react-redux';
// import { changeLoc } from '../features/locationSlice';
// Import your action creators for updating location

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
          southEast: {
            lat: newBounds.getSouthEast().lat,
            lng: newBounds.getSouthEast().lng
          },
          northWest: {
            lat: newBounds.getNorthWest().lat,
            lng: newBounds.getNorthWest().lng
          },
          center: {
            lat: map.getCenter().lat,
            lng: map.getCenter().lng
          }
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
  
  // Define the callback that will dispatch location updates
  const handleBoundsChange = (bounds) => {
    // Dispatch to Redux - assuming you have an action creator like updateLocation
    dispatch(changeLoc(bounds));
  };

  return (
    <div  id="mapid" className="md:max-w-[50%] md:min-w-[50%] p-[40px]">
    <MapContainer 
      center={location} 
      zoom={13} 
      style={{ height: '500px', width: '100%' }}
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