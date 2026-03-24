import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
import SearchOverlay from '@/features/search/SearchOverlay'

function Header() {
    const [toggle, setToggle] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const user = getCurrentUser()
    const isDetailPage = location.pathname.startsWith('/movie') || location.pathname.startsWith('/tv')

    const menu = [
        {
            name: "HOME",
            icon: HiHome,
            path: "/"
        },
        {
            name: "BUSCAR",
            icon: HiMagnifyingGlass,
            action: () => setIsSearchOpen(true)
        },
        {
            name: "ORIGINALS",
            icon: HiStar,
        },
        {
            name: "PELICULES",
            icon: HiPlayCircle,
            path: "/pelicules"
        },
        {
            name: "SERIES",
            icon: HiTv,
            path: "/series"
        }
    ]
    return (
        <div className='absolute top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent'>
            {/* Logo */}
            <img
                src={logo}
                className="w-[80px] md:w-[100px] object-contain z-10 cursor-pointer"
                onClick={() => navigate('/')}
                alt="Logo"
            />

            {/* Desktop Nav — centrat absolut */}
            <div className='hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2 items-center'>
                {menu.map((item, index) => (
                    <HeaderItem key={index} name={item.name} Icon={item.icon} onClick={() => {
                        if (item.action) item.action()
                        else if (item.path) navigate(item.path)
                    }} />
                ))}
            </div>

            {/* Mobile Nav */}
            <div className='flex md:hidden gap-6 items-center'>
                <div className='flex md:hidden gap-8'>
                    {menu.map((item, index) => index < 3 && (
                        <HeaderItem key={index} name={''} Icon={item.icon} onClick={() => {
                            if (item.action) item.action()
                            else if (item.path) navigate(item.path)
                        }} />
                    ))}
                    <div className='md:hidden' onClick={() => setToggle(!toggle)}>
                        <HeaderItem name={''} Icon={HiDotsVertical} />
                        {toggle ? <div className='absolute mt-3 bg-[#1A1A1A]
                        border-[1px] border-[#CC8400] p-3 px-5 py-4 z-50'>
                            {menu.map((item, index) => index > 2 && (
                                <HeaderItem key={index} name={item.name} Icon={item.icon} onClick={() => {
                                    if (item.action) item.action()
                                    else if (item.path) navigate(item.path)
                                }} />
                            ))}
                        </div> : null}
                    </div>
                </div>
            </div>

            {/* Perfil només visible si NO estem a detalls de peli/sèrie */}
            {!isDetailPage ? (
                <img
                    src={user?.avatar || perfilDefecte}
                    className="w-[40px] h-[40px] rounded-full cursor-pointer object-cover hover:ring-2 hover:ring-[#CC8400] transition-all"
                    onClick={() => navigate('/compte')}
                    alt="Profile"
                />
            ) : (
                <div className="w-[40px] h-[40px]"></div> /* Filler per mantenir l'alineació flex "space-between" del header */
            )}

            {/* Modal Superposada del Cercador Universal */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    )
}

export default Header