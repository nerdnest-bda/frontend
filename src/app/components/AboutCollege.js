
import { Icon } from '@iconify/react'
import React, { forwardRef, useEffect, useState } from 'react'
import Statistics from './Statistics'
import axios from 'axios'

const AboutCollege = forwardRef(({currentUniversity}, ref) => {

    const placeHolder = `What is Lorem Ipsum?
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                Why do we use it?
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).


                Where does it come from?
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

                Where can I get some?
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`

  const [showMore, setShowMore] = useState(true)

  const [aboutUniversity, setAboutUniversity] = useState("")

  const [aboutLoading, setAboutLoading] = useState(false)

  useEffect(() => {
    setAboutLoading(true)
    axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/about?university_name=${encodeURIComponent(currentUniversity.name)}`)
    .then((res) => {
        if (res.status === 200) {
            setAboutUniversity(res.data.about_college)
        } else {
            setAboutUniversity(placeHolder)
        }
        setAboutLoading(false)
    })
    .catch((err) => {
        setAboutUniversity(placeHolder)
        setAboutLoading(false)
    })
  }, [])


  return (
        <div ref={ref} className={`w-[100%]  shadow-md rounded-[20px] relative overflow-hidden ${showMore ?"max-h-[400px] overflow-y-scroll" :"max-h-[800px] overflow-y-scroll"} transition-all duration-[300ms] border-[1px] border-black-100`}>
            <div className='px-[60px] my-[30px] pb-[30px] text-[28px] font-[300] border-b-[1px] border-black-100'>About</div>
            {aboutLoading ? (
                <div className="md:max-w-[50%] md:min-w-[50%] flex justify-center items-center w-full h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
            ) : (
                <div className='px-[60px] my-[30px] text-justify'>
                {
                    aboutUniversity
                }
                </div>
            )}
            
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

export default AboutCollege