import React, { useState, useEffect } from 'react'
import { HiPlus, HiCheck } from 'react-icons/hi'
import { HiHandThumbUp, HiHandThumbDown, HiShare } from 'react-icons/hi2'

function ActionButtons({ movie }) {
    const [inList, setInList] = useState(false)
    const [copied, setCopied] = useState(false)

    // Comprovar si ja està a la llista en carregar
    useEffect(() => {
        if (!movie) return
        const watchlist = JSON.parse(localStorage.getItem('playmon_watchlist') || '[]')
        const exists = watchlist.some(m => m.id === movie.id)
        setInList(exists)
    }, [movie])

    const handleToggleList = () => {
        if (!movie) return
        const watchlist = JSON.parse(localStorage.getItem('playmon_watchlist') || '[]')
        
        if (inList) {
            const newList = watchlist.filter(m => m.id !== movie.id)
            localStorage.setItem('playmon_watchlist', JSON.stringify(newList))
            setInList(false)
        } else {
            watchlist.push(movie)
            localStorage.setItem('playmon_watchlist', JSON.stringify(watchlist))
            setInList(true)
        }
    }

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback en cas que no funcioni el clipboard
        }
    }

    const btnBase = `relative flex items-center justify-center w-11 h-11 rounded-full
                     border border-white/30 transition-all duration-300
                     hover:border-[#CC8400] hover:scale-110 active:scale-95 group`

    return (
        <div className='flex items-center gap-3'>
            {/* Afegir a la meva llista */}
            <button
                onClick={handleToggleList}
                className={`${btnBase} ${inList ? 'bg-[#CC8400] border-[#CC8400] shadow-[0_0_15px_rgba(204,132,0,0.6)]' : 'bg-white/10 hover:bg-white/20'}`}
                title={inList ? 'Treure de la llista' : 'Afegir a la meva llista'}
            >
                <div className={`transition-transform duration-300 ${inList ? 'scale-100' : 'scale-90 opacity-80'}`}>
                    {inList
                        ? <HiCheck className='text-white text-xl' />
                        : <HiPlus className='text-white text-xl' />
                    }
                </div>
            </button>

            {/* Compartir */}
            <button
                onClick={handleShare}
                className={`${btnBase} bg-white/10 hover:bg-white/20`}
                title='Compartir'
            >
                <HiShare className='text-white text-lg' />

                {/* Notificació visual animada */}
                <div className={`absolute -top-10 px-2 py-1 rounded bg-[#CC8400] text-black text-xs font-bold whitespace-nowrap
                                 transition-all duration-300 pointer-events-none shadow-lg
                                 ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    Enllaç copiat!
                    {/* Flecha a sota */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 
                                    border-l-[4px] border-l-transparent 
                                    border-t-[4px] border-t-[#CC8400] 
                                    border-r-[4px] border-r-transparent"></div>
                </div>
            </button>
        </div>
    )
}

export default ActionButtons
