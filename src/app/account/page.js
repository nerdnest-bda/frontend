"use client"
import React, { useState } from 'react'
import Header from '../components/Header';
import Avatar from 'react-avatar';

const AccountDetails = () => {
    const [user, setUser] = useState({
      name: "John Doe",
      email: "johndoe@example.com",
      gre_quant: 130,
      gre_verbal: 130,
      gpa: 4.0,
    });
  
    const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
    };
  
    return (
        <div>
            <Header displaySearch={true} />
            <div className="font-nunito mx-[20px] max-w-3xl md:mx-auto mt-16 p-8 bg-white rounded-2xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center">account details</h1>
                <p className='text-center text-[12px]'>click on value to edit</p>
                <div className='flex items-center justify-center mt-[20px]'>
                    <Avatar name={user.name} size="100" className='rounded-[999px]'/>
                </div>
                <div className="mt-6 space-y-4 max-w-[70%] mx-auto">
                    <div className='flex items-center justify-between'>
                        <label className="text-gray-600 ">full name</label>
                        <input name="name" value={user.name} onChange={handleChange} className='text-right focus:ring-0 focus:outline-none'/>
                    </div>
                    <div className='flex items-center justify-between'>
                        <label className="text-gray-600">email address</label>
                        <input name="email" type="email" value={user.email} onChange={handleChange} className='text-right focus:ring-0 focus:outline-none'/>
                    </div>
                    <div className='flex items-center justify-between'>
                        <label className="text-gray-600">gre quantitative</label>
                        <input name="gre quantitative" value={user.gre_quant} onChange={handleChange} className='text-right focus:ring-0 focus:outline-none'/>
                    </div>
                    <div className='flex items-center justify-between'>
                        <label className="text-gray-600">gre verbal</label>
                        <input name="gre verbal" value={user.gre_verbal} onChange={handleChange} className='text-right focus:ring-0 focus:outline-none'/>
                    </div>
                    <div className='flex items-center justify-between'>
                        <label className="text-gray-600">gpa</label>
                        <input name="gpa" value={user.gpa} onChange={handleChange} className='text-right focus:ring-0 focus:outline-none'/>
                    </div>
                </div>
                <div className="mt-6 max-w-[70%] mx-auto text-center cursor-pointer">
                    <div className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
                        save changes
                    </div>
                </div>
            </div>
        </div>
    );
  };
  
  export default AccountDetails;