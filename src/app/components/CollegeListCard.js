import Image from 'next/image'
import React from 'react'

const CollegeListCard = ({college}) => {
  console.log("Current: ", college)

  return (
    <div className="bg-[#f5f5f5] rounded-lg flex border-[1px] border-black-500 hover:cursor-pointer hover:shadow-lg transition-shadow duration-[300ms]">
      <div className = "mr-[20px] rounded-l-lg h-full">
        <Image 
          alt="college_logo"
          src={college.mascot_photo}
          width={100} 
          height={100}
          className='rounded-l-lg object-contain h-full'/>
      </div>
      <div className = "font-nunito flex flex-col justify-center gap-[8px] overflow-hidden mr-[10px]">
        <div className='text-[20px] truncate'>{college.name}</div>
        <div className='text-[#999999] truncate'>{college.address}</div>
      </div>
      <div className = "ml-auto flex items-center justify-center pr-[10px] text-[30px]">22%</div>
      
    </div>
  )
}

export default CollegeListCard