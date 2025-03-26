import React, { useEffect, useState } from 'react'
import Map from './Map';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoc } from '../features/locationSlice';

const Locator = () => {
  const [location, setlocation] = useState([51.505, -0.09])

  const grid = useSelector(selectLoc);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("The current position is:", position.coords)
          setlocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error fetching location:", error);
          return
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // useEffect(() => {
  //   console.log("From locator.js", grid);
  // }, [grid]);

  return (
      <div className='flex flex-col md:flex-row px-[100px] bg-[#fafafa] mt-[100px]'>
        <Map location = {location}/>
        <div className='md:max-w-[50%] md:min-w-[50%] overflow-x-scroll'>
          {JSON.stringify(grid)}
        </div>
      </div>
    
  );
}

export default Locator