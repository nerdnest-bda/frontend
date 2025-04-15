import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { changeCurrentUniversity } from '../features/currentUniversitySlice';
import axios from 'axios';

const CollegeSuggestionsCard = ({college}) => {

    const router = useRouter();

    const dispatch = useDispatch()

    const [logoUrl, setLogoUrl] = useState("")

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
        className=' top-[100%] 
                    width-[100%] 
                    hover:cursor-pointer 
                    hover:bg-[#d0d0d0] 
                    bg-[#fafafa] p-[20px] 
                    border-[1px] border-black-100 
                    transition-all transition-duration-[300ms]
                    truncate' 
        onClick={() => {
            college.mascot_photo = logoUrl
            dispatch(changeCurrentUniversity(college))

            router.push(`/university/${college._id}`)
        }}>
        {college.name}
    </div>
  )
}

export default CollegeSuggestionsCard