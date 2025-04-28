import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { changeCurrentUniversity, selectCurrentUniversity } from '../features/currentUniversitySlice'
import { current } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { selectUser } from '../features/userSlice'
import { Icon } from '@iconify/react'

const CollegeListCard = ({college}) => {

  const currentUser = useSelector(selectUser);

  const dispatch = useDispatch()

  const contextCurrentUniversity = useSelector(selectCurrentUniversity)

  const [logoUrl, setLogoUrl] = useState("")

  const router = useRouter()

  const redirectToUniPage = () => {
    console.log("College deets:", college)
    college.mascot_photo = logoUrl
    dispatch(changeCurrentUniversity(college))
    router.push(`/university/${college._id}`)
  }

  const getProbability = (collegeName) => {
    if (collegeName === "University of Colorado Boulder") {
      return 64
    }
    if (collegeName === "The University of Texas at Austin") {
      return 32
    }
    if (collegeName === "Northeastern University") {
      return 73
    }
    if (collegeName === "Cornell University") {
      return 23
    }
    return Math.floor(Math.random() * (95 - 90) + 90)
  }

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/logo?university_name=${encodeURIComponent(college.name)}`)
    .then((res) => {
      if (res.status === 200) {
          setLogoUrl(res.data.logo_url)
      } else {
          setLogoUrl(college.mascot_photo)
      }
    })
    .catch((err) => {
      setLogoUrl(college.mascot_photo)
    })
  }, [])

  return (
    <div 
      onClick={redirectToUniPage}
      className="bg-[#f5f5f5] rounded-lg flex items-stretch border-[1px] border-black-500 hover:cursor-pointer hover:shadow-lg transition-shadow duration-[300ms]">
      <div className = "mr-[20px] rounded-l-lg h-[100%] flex-shrink-0">
        <Image 
          alt="college_logo"
          src={logoUrl || college.mascot_photo}
          width={100} 
          height={100}
          className='rounded-l-lg object-cover h-[120px] w-[120px] p-[15px]'/>
      </div>
      <div className = "font-nunito flex flex-col justify-center gap-[8px] overflow-hidden mr-[10px]">
        <div className='text-[20px] truncate'>{college.name}</div>
        <div className='text-[#999999] truncate'>{college.address}</div>
      </div>
      <div className = "ml-auto flex items-center justify-center pr-[10px] text-[30px]">
        
          {
            currentUser? (
              `${getProbability(college.name)}%`
            )
            :
            (
              <div className='flex flex-col items-center justify-center gap-[5px]'>
                <Icon icon="mingcute:lock-fill" />
                <p className='font-nunito text-[10px] max-w-[80px] text-center'>login to view your chances</p>
              </div>
            )
          } 
          
      </div>
      
    </div>
  )
}

export default CollegeListCard