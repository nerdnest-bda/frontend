// "use client"

import Image from "next/image"
import { Icon } from "@iconify/react";
import { forwardRef, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { login, logout, selectUser } from "../features/userSlice";
import { auth } from "../../../firebase";
import AccountDetails from "./AccountDetails";
import LoginRegister from "./LoginRegister";
import { useRouter } from "next/navigation";
import axios from "axios";
import CollegeSuggestionsCard from "./CollegeSuggestionsCard";



const Header = ({displaySearch}) => {

    const user = useSelector(selectUser);
    // const user = "something";

    const router = useRouter();

    const inputRef = useRef(null);


    const dispatch = useDispatch();

    const [searchCollege, setSearchCollege] = useState("")

    const [collegeSuggestions, setCollegeSuggestions] = useState([])

    const getSuggestions = (collegeName) => {
        if (collegeName === "") {
            setCollegeSuggestions([])
            return
        }
        axios.get(`${process.env.NEXT_PUBLIC_NERDNEST_SERVER_URL}/api/universities/get_university_id?university_name=${encodeURIComponent(collegeName)}`)
        .then((res) => {
            setCollegeSuggestions(res.data)
        })
        .catch((err) => {
            console.log("Some error occured during fetching suggestions")
        })
    }

    useEffect(() => {
        onAuthStateChanged(auth, (userAuth) => {
            if(userAuth) {
                dispatch(login({
                    email: userAuth.email,
                    uid: userAuth.uid,
                    displayName: userAuth.displayName,
                }))
            }
        });
    }, [dispatch])

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check for CMD+K (Mac) or CTRL+K
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }
            // Close on escape
            if (event.key === 'Escape') {
              inputRef.current.blur();
              setCollegeSuggestions([])
            }
        };
      
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [])

    const [sidebar, setSidebar] = useState(true);

    return(
        <div className="sticky top-0 z-50 flex flex-col md:flex-row justify-between md:px-[100px] md:py-[20px] bg-[#fafafa] border-b-[2px] border-[#ecedef]">
            <div className="flex justify-between items-center px-[20px] py-[10px] md:p-0 md:content-center md:items-center md:gap-[20px] cursor-pointer" onClick={() => {router.push("/")}}>
                <Image src="/Nerd_Nest.png" alt="nerd_nest_logo" width={75} height={75}/>
                <div className="font-nunito text-[40px] font-[700]"><span className="font-[900]">n</span>erd <span className="font-[900]">n</span>est</div>
                <Icon icon="famicons:menu" onClick={() => setSidebar(!sidebar)} className="h-[30px] w-[30px] md:hidden"/>
            </div>
            {
                sidebar && (
                    <div className="md:hidden flex flex-col gap-[20px] px-[20px]">
                        {
                            displaySearch && (
                                <div className="relative rounded-md flex justify-between items-center bg-[#e0e0e0] p-[5px] border-[2px]">
                                    <Icon icon="icon-park-twotone:search" className="h-[30px] w-[30px]"/>
                                    <input ref={inputRef} className = "bg-[#e0e0e0] block ml-[10px] pl-[10px] border-gray-600 rounded-md focus:ring-0 focus:outline-none w-[100%]" type = "text" placeholder = "search university" />
                                </div>
                            )
                            
                        }
                        {
                            user? (
                                <AccountDetails />
                            ) : (
                                <LoginRegister />
                            )
                        }
                    </div>
                )
            }
            
            <div className="hidden md:flex justify-center items-center gap-[40px] ">
                {
                    displaySearch && (
                        <div className="relative rounded-md flex justify-center items-center bg-[#e0e0e0] p-[5px] border-[2px]">
                            <Icon icon="icon-park-twotone:search" className="h-[30px] w-[30px]"/>
                            <input ref={inputRef} 
                                onChange={(e) => {
                                    setSearchCollege(e.target.value)
                                    getSuggestions(searchCollege)
                                }}
                                // onKeyPress={(e) => e.key === 'Enter' && }
                                className = "bg-[#e0e0e0] block ml-[10px] pl-[10px] border-gray-600 rounded-md focus:ring-0 focus:outline-none w-[200px] focus:w-[400px] transition-all duration-500" 
                                type = "text" placeholder = "search university" 
                            />
                            <div className="text-[#9ca3af]">⌘ k</div>
                            {   
                                collegeSuggestions.length > 0 ? (
                                    <div className="absolute w-full top-[120%] flex flex-col rounded-[20px] transition-all transition-duration-[300ms]"> 
                                        {
                                            collegeSuggestions.map((college) => {
                                                return (
                                                    <CollegeSuggestionsCard 
                                                        key={college._id} 
                                                        college = {college}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                ):(
                                    <div className="hidden"> </div>
                                )
                                
                            }
                        </div>
                    )
                    
                }
                {
                    user? (
                        <AccountDetails />
                    ) : (
                        <LoginRegister />
                    )
                }
            </div>
        </div>
    );
};

export default Header