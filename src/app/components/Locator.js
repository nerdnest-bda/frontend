import React, { useEffect, useRef, useState } from 'react'
import Map from './Map';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoc } from '../features/locationSlice';
import axios from 'axios';
import { Icon } from '@iconify/react';
import assign_quadrant from '../utils';

const Locator = () => {
  const [location, setlocation] = useState([51.505, -0.09])
  const [isLoading, setIsLoading] = useState(true);

  const [city, setCity] = useState("");

  const[collegesInGrid, setCollegesInGrid] = useState([])
  const [quadrantColleges, setQuadrantColleges] = useState([])

  const prevQuadrantRef = useRef(null);

  const getCoords = (city) => {
    axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`)
    .then((res) => {
      // console.log("City long, lat", res.data[0])
      setlocation([res.data[0].lat, res.data[0].lon])
      return {lat: res.data[0].lat, lng: res.data[0].lon}
    }).then((latLongObject) => {
      return axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/coordinates?latitude=${latLongObject.lat}&longitude=${latLongObject.lng}`)
      
    }).then((res) => {
      console.log("Response from server", res)
    })
  }

  const grid = useSelector(selectLoc);

  useEffect(() => {
    console.log("Current grid:", grid)
    
    if (grid?.center?.lat && grid?.center?.lng) {
      const currentQuadrant = grid.quadrant || assign_quadrant(grid.center.lat, grid.center.lng)
      if (currentQuadrant && currentQuadrant !== prevQuadrantRef.current) {
        axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/coordinates?latitude=${grid?.center?.lat}&longitude=${grid?.center?.lng}`)
        .then((res) => {
          console.log("Response from server", res.data)
          setQuadrantColleges(res.data)
          prevQuadrantRef.current = currentQuadrant;
        })
        .catch((error) => {
          console.error("Error fetching colleges:", error);
          return
        })
        
      } else {
        console.log("Quadrant hasn't changed, skipping API call");
      }
      
    }
  }, [grid])

  useEffect(() =>{
    console.log("Quadrant colleges: ", quadrantColleges)
    if (grid && quadrantColleges.length > 0) {
      const filteredColleges = quadrantColleges.filter((college) => {
        let collegeLat = college.coordinates.latitude
        let collegeLng = college.coordinates.longitude
  
        const north = grid.northEast.lat;
        const east = grid.northEast.lng;
        const south = grid.southWest.lat;
        const west = grid.southWest.lng;
        
        return collegeLat <= north && collegeLat >= south && collegeLng >= west && collegeLng <= east;
      })
      
      setCollegesInGrid(filteredColleges)
      console.log("Colleges in current grid:", filteredColleges)
    }
  }, [quadrantColleges, grid])



  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setlocation([position.coords.latitude, position.coords.longitude]);
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

  return (
      <div className='flex flex-col md:flex-row px-[100px] bg-[#fafafa] mt-[100px]'>
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-[500px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <Map location={location} collegesInGrid={collegesInGrid} />
        )}
        <div className='md:max-w-[50%] md:min-w-[50%] overflow-x-scrol p-[40px] relative'>
          <div className='flex gap-[20px]'>
            <div className="flex-1 rounded-md flex justify-center items-center bg-[#e0e0e0] p-[5px]">
                <Icon icon="icon-park-twotone:search" className="h-[30px] w-[30px]"/>
                <input onChange={(e) => {
                  setCity(e.target.value)
                }} className = "bg-[#e0e0e0] m-[10px] text-[18px] pl-[10px] border-gray-600 rounded-md w-[80%]" type ="text" placeholder = "Search location" />
                
                
            </div>
            <div onClick={() => {
                  getCoords(city)
                }}className="text-[#fff] flex items-center justify-center bg-black px-[20px] rounded-md hover:cursor-pointer hover:bg-[#fafafa] border-[1px] border-black hover:text-black hover:border-[1px] hover:border-black transition duration-200">search</div>
          </div>
          
        </div>
      </div>
    
  );
}

export default Locator