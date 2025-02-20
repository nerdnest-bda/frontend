import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import styles from "../styles/Map.css"
import { useDispatch } from 'react-redux';
import { changeLoc } from '../features/locationSlice';

const MapEvents = ({ onBoundsChange, onMapClick }) => {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            onBoundsChange({
                northEast: {
                    lat: bounds.getNorthEast().lat,
                    lng: bounds.getNorthEast().lng
                },
                southWest: {
                    lat: bounds.getSouthWest().lat,
                    lng: bounds.getSouthWest().lng
                },
                southEast: {
                    lat: bounds.getSouthEast().lat,
                    lng: bounds.getSouthEast().lng
                },
                northWest: {
                    lat: bounds.getNorthWest().lat,
                    lng: bounds.getNorthWest().lng
                },
                center: {
                    lat: map.getCenter().lat,
                    lng: map.getCenter().lng
                }
            });
        },
        click: (e) => {
          onMapClick({
            lat: e.latlng.lat.toFixed(6),
            lng: e.latlng.lng.toFixed(6)
          });
        }
      });
      return null;
}

const Map = ({location}) => {

    const [bounds, setBounds] = useState(null);
    const [clickedCoords, setClickedCoords] = useState(null);

    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(changeLoc({
            ...bounds
        }))
    },[bounds, dispatch])


    return (
        <div  id="mapid" className="md:max-w-[50%] md:min-w-[50%] p-[40px]">
            <MapContainer center={location} zoom={13} scrollWheelZoom={false} className={`h-[100%] rounded-[20px]`}>
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents 
                    onBoundsChange={setBounds}
                    onMapClick={setClickedCoords}
                />

                {/* <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
                </Marker> */}
            </MapContainer>
        </div>
    );
}

export default Map