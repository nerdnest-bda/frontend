import React from 'react'
import { useRouter } from 'next/navigation';


const LoginRegister = () => {

    const router = useRouter();

    const handleLogin = () => {
        router.push('/login');
    }

    const handleRegister = () => {
        router.push('/register');
    }

    return (
        <div className='flex flex-col md:flex-row justify-center items-center gap-[20px]'>
            <div onClick={handleLogin} className="font-nunito text-black text-[20px] font-[700] hover:text-[#696969] transition duration-2000 cursor-pointer">login</div>
            <div onClick={handleRegister} className='font-nunito text-black text-[20px] font-[700] hover:text-[#696969] transition duration-2000 cursor-pointer'>register</div>
        </div>
    )
}

export default LoginRegister