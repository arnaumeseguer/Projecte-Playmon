import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/LogoProducteLandingPageTransparent.png'
import {
    HiHome,
    HiMagnifyingGlass,
    HiPlayCircle,
    HiStar,
    HiTv
} from "react-icons/hi2";
import { HiPlus, HiDotsVertical } from "react-icons/hi"
import HeaderItem from './HeaderItem'
import perfilDefecte from '../assets/perfilDefecte.png'
import { getCurrentUser } from '../api/authApi'

function Header() {
    const [toggle, setToggle] = useState(false)
    const navigate = useNavigate()
    const user = getCurrentUser()
    const menu = [
        {
            name: "HOME",
            icon: HiHome,
        },
        {
            name: "BUSCAR",
            icon: HiMagnifyingGlass,
        },
        {
            name: "ORIGINALS",
            icon: HiStar,
        },
        {
            name: "PELICULES",
            icon: HiPlayCircle,
        },
        {
            name: "SERIES",
            icon: HiTv,
        }
    ]
    return (
        <div className='absolute top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent'>
            {/* Logo */}
            <button
                type="button"
                onClick={() => navigate('/')}
                className="z-10 cursor-pointer hover:opacity-85 transition-opacity"
                aria-label="Go to home"
            >
                <img src={logo} className="w-[80px] md:w-[100px] object-contain" alt="Playmon" />
            </button>

            {/* Desktop Nav — centrat absolut */}
            <div className='hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2 items-center'>
                {menu.map((item, index) => (
                    <HeaderItem key={index} name={item.name} Icon={item.icon} />
                ))}
            </div>

            {/* Mobile Nav */}
            <div className='flex md:hidden gap-6 items-center'>
                <div className='flex md:hidden gap-8'>
                    {menu.map((item, index) => index < 3 && (
                        <HeaderItem key={index} name={''} Icon={item.icon} />
                    ))}
                    <div className='md:hidden' onClick={() => setToggle(!toggle)}>
                        <HeaderItem name={''} Icon={HiDotsVertical} />
                        {toggle ? <div className='absolute mt-3 bg-[#1A1A1A]
                        border-[1px] border-[#CC8400] p-3 px-5 py-4 z-50'>
                            {menu.map((item, index) => index > 2 && (
                                <HeaderItem key={index} name={item.name} Icon={item.icon} />
                            ))}
                        </div> : null}
                    </div>
                </div>
            </div>
            <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate('/compte')}
            >
                <div className="flex items-center gap-1.5">
                    <span 
                        className={`text-sm hidden sm:inline-block transition-all ${
                            user?.pla_pagament === 'super' ? 'text-[#ff9d00] font-bold' : 
                            user?.pla_pagament === 'master' ? 'text-[#a855f7] font-black' : 
                            'text-white font-medium'
                        }`}
                        style={{
                            textShadow: user?.pla_pagament === 'super' ? '0 0 7px #ff9d00, 0 0 14px rgba(255,157,0,0.4)' : 
                                        user?.pla_pagament === 'master' ? '0 0 7px #a855f7, 0 0 14px rgba(168,85,247,0.4)' : 
                                        '0 0 4px rgba(255,255,255,0.3)'
                        }}
                    >
                        {user?.username || "Usuari"}
                        {user?.pla_pagament === 'master' && (
                            <span className="ml-1 text-white inline-block drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">★</span>
                        )}
                    </span>
                    <img 
                        src={user?.avatar || perfilDefecte} 
                        className={`w-[40px] h-[40px] rounded-full object-cover transition-all ${
                            user?.pla_pagament === 'super' ? 'ring-2 ring-[#ff9d00]' : 
                            user?.pla_pagament === 'master' ? 'ring-2 ring-[#a855f7]' : 
                            'hover:ring-2 hover:ring-[#CC8400]'
                        }`}
                        alt="Profile"
                    />
                </div>
            </div>
        </div>
    )
}

export default Header