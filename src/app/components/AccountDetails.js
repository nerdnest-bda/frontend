import React, { useEffect, useRef, useState } from 'react'
import { Icon } from "@iconify/react";
import { useRouter } from 'next/navigation';
import { logout } from '../features/userSlice';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../../../firebase';


const AccountDetails = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            dispatch(logout());
            await signOut(auth);
            setIsOpen(false);
            console.log("User signed out successfully");
        } catch (error) {
            console.error("Error while signing out");
        }
        
    }

    const handleAccountDetails = () => {
        router.push('/account');
        setIsOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

    return (
        <div className='relative' ref={dropdownRef}>
            <Icon 
                icon="iconamoon:profile-duotone" 
                className="h-[45px] w-[45px] text-black hover:text-[#4b5563] transition duration:200 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <button
                    onClick={handleAccountDetails}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                    <Icon icon="solar:user-broken" className="mr-2 h-4 w-4" />
                    <span className="font-nunito text-[15px] font-[700]">Account Details</span>
                </button>
                
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                >
                    <Icon icon="material-symbols-light:logout" className="mr-2 h-4 w-4" />
                    <span className="font-nunito text-[15px] font-[700]">Logout</span>
                </button>
                </div>
            )}
        </div>
        
    )
}

export default AccountDetails