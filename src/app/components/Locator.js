import React, { useEffect, useState } from 'react'
import Map from './Map';
import { useSelector } from 'react-redux';
import { selectLoc } from '../features/locationSlice';

const Locator = () => {
  const [location, setlocation] = useState([51.505, -0.09])

  const grid = useSelector(selectLoc);
  useEffect(() => {
    console.log("From locator.js", grid);
  }, [grid]);


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