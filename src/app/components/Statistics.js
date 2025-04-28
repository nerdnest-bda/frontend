import { Icon } from '@iconify/react'
import React, { forwardRef, useState } from 'react'
import ScatterPlot from './plots/ScatterPlot'
import RadarPlot from './plots/RadarPlot'
import OriginBarChart from './plots/BarGraph'

import { useSelector } from 'react-redux'
import { selectCurrentUniversity } from '../features/currentUniversitySlice'
import { selectUser } from '../features/userSlice'

const Statistics = forwardRef((props, ref) => {

    const currentUser = useSelector(selectUser);

    const [showMore, setShowMore] = useState(true)

    const contextCurrentUniversity = useSelector(selectCurrentUniversity)
    

    return (
          <div ref={ref} className={`w-[100%]  shadow-md rounded-[20px] relative overflow-hidden ${showMore ?"max-h-[400px] overflow-y-scroll" :"max-h-[800px] overflow-y-scroll"} transition-all duration-[300ms] border-[1px] border-black-100`}>
                <div className='sticky top-0 z-50 bg-[#fafafa] px-[60px] py-[30px] pb-[30px] text-[28px] font-[300] border-b-[1px] border-black-100 shadow-lg'>Statistics</div>
                {
                    currentUser? (
                        <div className='px-[60px] my-[30px] text-justify flex flex-col gap-[80px]'>
                            <ScatterPlot college_name={contextCurrentUniversity.name}/>
                            <RadarPlot college_name = {contextCurrentUniversity.name}/>
                            <OriginBarChart college_name = {contextCurrentUniversity.name}/>
                        </div>
                    )
                    :
                    (
                        <div className='flex flex-col items-center justify-center gap-[5px] my-[50px]'>
                            <Icon icon="mingcute:lock-fill" className='w-[50px] h-[50px]' />
                            <p className='font-nunito text-[15px] max-w-[80px] text-center'>login to see university statistics</p>
                        </div>
                    )
                    } 
                
                
                <div className='sticky bottom-0 w-[100%] bg-[#fafafa] flex items-center justify-center gap-[10px] hover:cursor-pointer py-[20px] mt-[5px] border-t-[2px] border-black-300' 
                  onClick={() => {
                      setShowMore(!showMore)
                  }}>
                  {
                      showMore?
                          <>
                              <div>Show more</div> 
                              <Icon icon="mingcute:down-fill"/>
                          </>
                      :
                          <>
                              <div>Show less</div> 
                              <Icon icon="mingcute:up-fill"/>
                          </>
                  }
                  
              </div>
          </div>
    )
})

export default Statistics