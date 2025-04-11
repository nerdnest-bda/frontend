import Link from 'next/link'
import React, { useEffect } from 'react'

const NewsCard = ({news}) => {

    useEffect(() => {
        console.log("news_obj", news)
    }, [])

  return (
    <div className='min-w-[70%] border-[2px] border-black-100 rounded-[20px] p-[10px] flex flex-col gap-[5px]'>
        <div className='text-[16px] font-[700]'>{news?.title}</div>
        <div className='text-[14px] truncate overflow-hidden whitespace-nowrap'>{news?.description}</div>
        <Link target="blank" href={news?.url} className='text-blue-500 text-[13px] mt-auto'>Read more</Link>
    </div>
  )
}

export default NewsCard