"use client"

import React from 'react'
import Image from 'next/image'
import heroimage from "../../../public/image-hero-desktop.png"
import { motion } from "framer-motion";


const Banner = () => {

    const CollegeMascotFiles = ["stanford", "mit", "michigan", "cu", "ucberkeley", "ucla", "cornell", "princeton", "jhu", "upen"]

    return (
        <div className="flex justify-center items-center px-[200px] py-[50px] bg-[#fafafa] gap-[100px]">
            <div className="w-[50%] flex flex-col justify-between items-center gap-[80px]">
                <div className='flex flex-col gap-[30px] w-full'>
                    <div className="font-nunito font-[800] text-[80px] leading-[80px]">finding your <br/>dream university</div>
                    <div className="font-nunito text-[#696969] text-[25px] font-[700]">because <span className='text-[#E50914]'>Netflix</span> isn't a degree</div>
                    <div className="
                        bg-black 
                        text-white 
                        py-[20px] 
                        px-[30px] 
                        rounded-[10px] 
                        max-w-max 
                        font-[700] 
                        border-[1px] 
                        border-black 
                        hover:bg-[#fafafa] 
                        hover:text-black 
                        hover:border-[1px] 
                        hover:border-black 
                        transition duration-200 
                        cursor-pointer">
                        learn more
                    </div>
                </div>
                <div className=' w-full relative'>
                    {/* <div className='absolute left-0 h-full w-[80px] bg-[white]'></div> */}
                    {/* <div className='absolute right-0 h-full w-[40px] bg-gradient-to-r from-white to-transparent'></div> */}

                    <div className="overflow-hidden py-4 z-[1]">
                        <motion.div
                            className="flex space-x-8 w-[calc(200%)] flex-nowrap h-[55px]"
                            initial={{ x: 0 }}
                            animate={{ x: "-100%" }}
                            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
                        >
                            {[...CollegeMascotFiles, ...CollegeMascotFiles].map((src, index) => (
                                <img key={index} src={`/collegeLogos/${src}.png`} alt={`${index}`} className="w-30 h-auto grayscale brightness-75" />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="h-[100%] w-[50%] flex items-center justify-center">
                <Image src={heroimage} 
                    alt="My Image"
                    width={450} 
                    height={700}
                />
            </div>            
        </div>
    


    )
}

export default Banner