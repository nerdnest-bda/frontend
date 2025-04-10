import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { changeCurrentUniversity, selectCurrentUniversity } from '../features/currentUniversitySlice'
import { current } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

const CollegeListCard = ({college}) => {

  const dispatch = useDispatch()

  const contextCurrentUniversity = useSelector(selectCurrentUniversity)

  const router = useRouter()

  const redirectToUniPage = () => {
    dispatch(changeCurrentUniversity(college))
    router.push(`/university/${college._id}`)
  }

  return (
    <div 
      onClick={redirectToUniPage}
      className="bg-[#f5f5f5] rounded-lg flex items-stretch border-[1px] border-black-500 hover:cursor-pointer hover:shadow-lg transition-shadow duration-[300ms]">
      <div className = "mr-[20px] rounded-l-lg h-[100%] flex-shrink-0">
        <Image 
          alt="college_logo"
          src={college.mascot_photo}
          width={100} 
          height={100}
          className='rounded-l-lg object-cover h-[120px] w-[120px]'/>
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