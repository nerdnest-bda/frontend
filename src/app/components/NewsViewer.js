import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NewsCard from './NewsCard'
import { useSelector } from 'react-redux'
import { selectCurrentUniversity } from '../features/currentUniversitySlice'
import { Icon } from '@iconify/react'
import Link from 'next/link'

const NewsViewer = ({universityId}) => {

  const [newsArticles, setNewsArticles] = useState([])

  const contextCurrentUniversity = useSelector(selectCurrentUniversity)


  useEffect(() => {
    console.log("In news:", universityId)
    axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/news/${universityId}`)
    .then((res) => {
      console.log("res: ", res)
      setNewsArticles(res.data[0].news)
    })
    .catch((err) => {
      console.log("Error occured while fetching news: ", err)
    })
  }, [])

  return (
    <div className='w-[40%] shadow-md rounded-[20px] p-[40px] self-start sticky top-[220px] border-[1px] border-black-100'>
      <div className='text-[18px] font-[200] border-b-[1px] border-black-300 mb-[20px]'>Contact</div>
      <div className='flex gap-[5px] items-center mb-[5px]'>
        <Icon icon="basil:location-outline" className='w-[20px] h-[20px]'/>
        <>{contextCurrentUniversity?.address}</>
      </div>
      <div className='flex gap-[5px] items-center mb-[20px]'>
        <Icon icon={"iconoir:internet"} className='w-[20px] h-[20px]' />
        {contextCurrentUniversity?.website ? (
          <Link
            target="blank"
            href={"https://" + contextCurrentUniversity.website}
            className="text-blue-500"
          >
            Website
          </Link>
        ): (<div>No website available</div>)}
        
      </div>

      <div className='text-[18px] font-[200] border-b-[1px] border-black-300 mb-[20px]'>What's Happening?</div>
      {
        
        newsArticles?.length > 0 ? (
          <div className='flex pb-[40px] gap-[20px] overflow-x-scroll no-scrollbar w-full'>
            {newsArticles.map((news_object, index) => (
              
              <NewsCard key={index} news={news_object}/>
            ))}
          </div>
        ):
        (
          <div>News not configured for this university</div>
        )
      }
    </div>

  )
}

export default NewsViewer