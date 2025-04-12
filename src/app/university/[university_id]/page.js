"use client"
import AboutCollege from '@/app/components/AboutCollege'
import Header from '@/app/components/Header'
import NewsViewer from '@/app/components/NewsViewer'
import Statistics from '@/app/components/Statistics'
import { changeCurrentUniversity, selectCurrentUniversity } from '@/app/features/currentUniversitySlice'
import { Icon } from '@iconify/react'
import axios from 'axios'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const UniversityDetails = () => {



  const params = useParams()

  const dispatch = useDispatch()

  const contextCurrentUniversity = useSelector(selectCurrentUniversity)
  const [loading, setLoading] = useState(false)
  const [currentSection, setCurrentSection] = useState("about")
  const aboutRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!aboutRef.current || !statsRef.current) return
  
      const aboutTop = aboutRef.current.getBoundingClientRect().top
      const statsTop = statsRef.current.getBoundingClientRect().top
  
      if (statsTop < 200) {
        setCurrentSection("stats")
      } else if (aboutTop < 200) {
        setCurrentSection("about")
      }
    }
  
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollWithOffset = (ref) => {
    const offset = 200;
    const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth',
    });
  }
  


  const stateMap = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming",
  };

  const getStateFromAddress = (address) => {
    const abbreviation = address.match(/,\s*([A-Z]{2})\s*[-\d]/)
    return abbreviation && stateMap[abbreviation[1]] ? stateMap[abbreviation[1]] : "United States";
  }


  // useEffect(() => {
  //   console.log("contextCurrentUniversity", contextCurrentUniversity)
  //   if(!contextCurrentUniversity) {
  //     setLoading(true)
  //     axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/${params.university_id}`)
  //     .then((res) => {
  //       dispatch(changeCurrentUniversity(res.data))
  //     })
  //     .catch((error) => {
  //       console.log("Error fetching university: ", error)
  //     })
  //     .finally(() => {
  //       setLoading(false)
  //     })
  //   }
  // }, [contextCurrentUniversity, dispatch, params.university_id])

  useEffect(() => {
    if (!contextCurrentUniversity) {
      setLoading(true)
      axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/${params.university_id}`)
        .then(async (res) => {
          const universityData = res.data;
          try {
            const logoRes = await axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/logo?university_name=${encodeURIComponent(universityData.name)}`)
            if (logoRes.status === 200) {
              universityData.mascot_photo = logoRes.data.logo_url
            }
          } catch {
          }
          dispatch(changeCurrentUniversity(universityData))
        })
        .catch((error) => {
          console.log("Error fetching university: ", error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [contextCurrentUniversity, dispatch, params.university_id])



  


  return (
    <div>
      <Header displaySearch={true} />
      {
        loading || !contextCurrentUniversity ? <div className="m-auto md:max-w-[50%] md:min-w-[50%] flex justify-center items-center w-full h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2"></div>
        </div> : (
          <div className='relative my-[50px]'>
            <div className='m-auto max-w-[100rem] bg-[url(/geometric-background.svg)]  bg-no-repeat bg-cover rounded-[20px] rounded-b-[0px] flex flex-col shadow-xl p-[40px] pb-[30px] border-[1px] border-black-300'>
              <Image src={contextCurrentUniversity?.mascot_photo} width={100} height={100} alt="college_mascot" className='rounded-[20px] h-[100px] w-[100px] shadow-xl p-[5px] border-[2px] border-black-100'/>
              <div className='font-nunito text-[32px] font-[500] mt-[30px]'>{contextCurrentUniversity?.name}</div>
              <div className='font-[200]'>{getStateFromAddress(contextCurrentUniversity?.address) + ", United States"}</div>
            </div>
            <div className='sticky top-[120px] z-[10] max-w-[100rem] mx-auto rounded-b-[20px] flex gap-[30px] items-center px-[40px] bg-[#fafafa] shadow-xl'>
              <div className={`${currentSection=="about"?"border-b-[2px] border-black":""} py-[20px] hover:cursor-pointer`}
                onClick={() => {
                  scrollWithOffset(aboutRef)
                  setCurrentSection("about")
                }}>
                  About
              </div>
              <div className={`${currentSection=="stats"?"border-b-[2px] border-black":""} py-[20px] hover:cursor-pointer`}
                onClick={() => {
                  scrollWithOffset(statsRef)
                  setCurrentSection("stats")
                }}>
                Statistics
              </div>
            </div>
            <div className='max-w-[100rem] gap-[40px] mx-auto my-[40px] flex relative'>
              
              <div className='w-[60%] rounded-[20px] flex flex-col gap-[20px] z-[0]'>
                <AboutCollege ref={aboutRef} currentUniversity={contextCurrentUniversity}/>
                <Statistics ref={statsRef} />
              </div>
              <NewsViewer universityId={params.university_id}/>
            </div>
            
            
            
          </div>
        )
      }
      
      
    </div>
  )
}

export default UniversityDetails
