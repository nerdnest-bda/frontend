import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Import Map component with no SSR
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] flex items-center justify-center">Loading map...</div>
});

import { useDispatch, useSelector } from 'react-redux';
import { selectLoc } from '../features/locationSlice';
import axios from 'axios';
import { Icon } from '@iconify/react';
import assign_quadrant from '../utils';
import CollegeListCard from './CollegeListCard';

const Locator = () => {
  const [location, setLocation] = useState([51.505, -0.09]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [city, setCity] = useState("");
  const [collegesInGrid, setCollegesInGrid] = useState([]);
  const [quadrantColleges, setQuadrantColleges] = useState([]);
  const [mapKey, setMapKey] = useState(Date.now()); // Add a key for Map remounting
  
  const prevQuadrantRef = useRef(null);
  const grid = useSelector(selectLoc);

  // Handle city search
  const getCoords = (city) => {
    if (!city.trim()) return;
    
    setIsLoading(true); // Show loading state during search
    axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const newLocation = [res.data[0].lat, res.data[0].lon];
          setLocation(newLocation);
          setMapKey(Date.now()); // Force Map remount when location changes
          return {lat: res.data[0].lat, lng: res.data[0].lon};
        } else {
          throw new Error("Location not found");
        }
      })
      .then((latLongObject) => {
        return axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/coordinates?latitude=${latLongObject.lat}&longitude=${latLongObject.lng}`);
      })
      .then((res) => {
        console.log("Response from server", res.data);
        setQuadrantColleges(res.data || []);
      })
      .catch((error) => {
        console.error("Error searching location:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Mount effect
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Grid change effect
  useEffect(() => {
    console.log("Current grid:", grid);
    
    if (grid?.center?.lat && grid?.center?.lng) {
      const currentQuadrant = grid.quadrant || assign_quadrant(grid.center.lat, grid.center.lng);
      if (currentQuadrant && currentQuadrant !== prevQuadrantRef.current) {
        axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/coordinates?latitude=${grid.center.lat}&longitude=${grid.center.lng}`)
          .then((res) => {
            console.log("Response from server", res.data);
            setQuadrantColleges(res.data || []);
            prevQuadrantRef.current = currentQuadrant;
          })
          .catch((error) => {
            console.error("Error fetching colleges:", error);
          });
      } else {
        console.log("Quadrant hasn't changed, skipping API call");
      }
    }
  }, [grid]);

  // Filter colleges effect
  useEffect(() => {
    if (grid && quadrantColleges.length > 0) {
      const filteredColleges = quadrantColleges.filter((college) => {
        if (!college.coordinates || typeof college.coordinates.latitude !== 'number' || 
            typeof college.coordinates.longitude !== 'number') {
          return false;
        }
        
        let collegeLat = college.coordinates.latitude;
        let collegeLng = college.coordinates.longitude;
  
        const north = grid.northEast.lat;
        const east = grid.northEast.lng;
        const south = grid.southWest.lat;
        const west = grid.southWest.lng;
        
        return collegeLat <= north && collegeLat >= south && collegeLng >= west && collegeLng <= east;
      });
      
      setCollegesInGrid(filteredColleges);
      console.log("Colleges in current grid:", filteredColleges);
    }
  }, [quadrantColleges, grid]);

  // Geolocation effect
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported");
      setIsLoading(false);
    }
  }, []);

  if (!hasMounted) return null;

  return (
    <div className='flex flex-col md:flex-row px-[100px] bg-[#fafafa] my-[100px] mt-[70px]'>
      {isLoading ? (
        <div className="md:max-w-[50%] md:min-w-[50%] flex justify-center items-center w-full h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : (
        <Map key={mapKey} location={location} collegesInGrid={collegesInGrid} />
      )}
      
      <div className='md:max-w-[50%] md:min-w-[50%] p-[40px] relative flex min-h-full max-h-full flex-col gap-[10px]'>
        <div className='flex gap-[20px]'>
          <div className="flex-1 rounded-md flex justify-center items-center bg-[#e0e0e0] p-[5px]">
            <Icon icon="icon-park-twotone:search" className="h-[30px] w-[30px]"/>
            <input 
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && getCoords(city)}
              className="bg-[#e0e0e0] m-[10px] text-[18px] pl-[10px] border-gray-600 rounded-md w-[80%] focus:outline-none" 
              type="text" 
              placeholder="Search location" 
            />
          </div>
          <div
            onClick={() => getCoords(city)}
            className="text-[#fff] flex items-center justify-center bg-black px-[20px] rounded-md hover:cursor-pointer hover:bg-[#fafafa] border-[1px] border-black hover:text-black hover:border-[1px] hover:border-black transition duration-200"
          >
            search
          </div>
        </div>
        <div className='flex-1 min-h-0 flex flex-col'>
          {collegesInGrid.length > 0 ? (
            <div className="relative overflow-y-scroll max-h-[400px]">
              <div className="font-nunito text-lg font-bold sticky top-0 bg-[#fafafa]">universities in view ({collegesInGrid.length}) </div>
              <div className="flex flex-col gap-[10px] mt-[10px]">
                {collegesInGrid.map((college, index) => (
                    <CollegeListCard key={college._id || index} college={college}/>
                ))}
              </div>
                
            </div>
          ) : (
            <div className="font-nunito flex items-center justify-center h-full text-gray-500">
              no universities found in current view
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Locator;