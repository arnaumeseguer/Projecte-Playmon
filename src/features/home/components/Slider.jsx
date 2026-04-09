import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import GlobalApi from '@/Services/GlobalApi';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2"

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"
const AUTO_ADVANCE_MS = 6000;
const SLIDE_MS = 650;

// ITEM_W% és l'ample de cada imatge (% del contenidor visible).
// SIDE_W% és la previsualització de cada costat.
// ITEM_W + 2*SIDE_W = 100%
const ITEM_W = 76;  // % del contenidor
const SIDE_W = 12;  // % de cada costat

function Slider() {
    const navigate = useNavigate();
    const [movieList, setMovieList] = useState([])
    const [trackIdx, setTrackIdx] = useState(1)
    const [noAnim, setNoAnim] = useState(false)  // desactiva transició per al salt del clon
    const timerRef = useRef(null)
    const isAnimatingRef = useRef(false) // Bloqueja els clics massius molt ràpids

    useEffect(() => {
        GlobalApi.getTrendingVideos().then(r => {
            const allItems = r.data?.results || [];
            if (allItems.length === 0) return;

            // Número de setmana actual (idèntic al WEEK_SEED de GlobalApi)
            // → el mateix durant tota la setmana, canvia cada 7 dies
            const weekNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));
            
            // Avança l'offset en blocs de 10 per setmana
            const offset = (weekNumber * 10) % Math.max(1, allItems.length - 10);
            
            // Agafa només 10 ítems d'aquesta "pàgina setmanal"
            const rotatingSelection = allItems.slice(offset, offset + 10);
            
            setMovieList(rotatingSelection);
        })
    }, [])

    const handleMovieClick = (movie) => {
        const isTv = movie.media_type === 'tv' || (!movie.title && movie.name)
        const type = isTv ? 'tv' : 'movie'
        navigate(`/${type}/${movie.id}`)
    }

    const total = movieList.length

    // Llista estesa: [clon_final, …originals…, clon_inicial]
    const extendedList = total > 0
        ? [movieList[total - 1], ...movieList, movieList[0]]
        : []

    const currentMovieIdx = Math.max(0, Math.min(trackIdx - 1, total - 1))

    // ── Quan aterrem al clon, saltem a l'original sense animació ──
    useEffect(() => {
        if (total === 0) return
        
        isAnimatingRef.current = true // Bloqueja els clics

        if (trackIdx === 0) {
            // Clon de la darrera → salt a la darrera real
            const t = setTimeout(() => {
                setNoAnim(true)
                setTrackIdx(total)
            }, SLIDE_MS)
            return () => clearTimeout(t)
        }
        if (trackIdx === total + 1) {
            // Clon de la primera → salt a la primera real
            const t = setTimeout(() => {
                setNoAnim(true)
                setTrackIdx(1)
            }, SLIDE_MS)
            return () => clearTimeout(t)
        }
        
        // Si no està en clon, desbloqueja al cap d'un moment per permetre l'anim normal
        const t2 = setTimeout(() => {
            isAnimatingRef.current = false
        }, SLIDE_MS)
        return () => clearTimeout(t2)

    }, [trackIdx, total])

    // Reactiva animació el frame següent al salt
    useEffect(() => {
        if (!noAnim) return
        const raf = requestAnimationFrame(() => setNoAnim(false))
        return () => cancelAnimationFrame(raf)
    }, [noAnim])

    const goNext = useCallback(() => setTrackIdx(i => i + 1), [])
    const goPrev = useCallback(() => setTrackIdx(i => i - 1), [])

    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            if (!isAnimatingRef.current) goNext()
        }, AUTO_ADVANCE_MS)
    }, [goNext])

    useEffect(() => {
        if (total > 0) resetTimer()
        return () => clearInterval(timerRef.current)
    }, [total, resetTimer])

    const handleNav = (fn) => { 
        if (isAnimatingRef.current) return;
        fn(); 
        resetTimer();
    }

    if (extendedList.length === 0) return null

    // ── Posicionament del filmstrip via CSS ──
    const translateX = `calc(-${trackIdx * ITEM_W}% + ${SIDE_W}%)`

    const trackStyle = {
        transform: `translateX(${translateX})`,
        transition: noAnim ? 'none' : `transform ${SLIDE_MS}ms cubic-bezier(0.77,0,0.18,1)`,
        willChange: 'transform',
        display: 'flex',
        height: '100%',
        width: '100%',
    }

    return (
        <div className='w-full px-6 md:px-10 mt-2 select-none'>
            {/* Contenidor principal — fa el clip del filmstrip */}
            <div className='relative overflow-hidden rounded-2xl h-[220px] md:h-[440px] group
                transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(204,132,0,0.2)]'>

                {/* ═══ UN ÚNIC DIV QUE LLISCA (filmstrip) ═══ */}
                    <div style={trackStyle}>
                        {extendedList.map((movie, idx) => {
                            const isCurrent = idx === trackIdx
                            return (
                                <div
                                    key={idx}
                                    className={`flex-shrink-0 h-full relative px-1 md:px-2 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isCurrent ? 'cursor-pointer hover:scale-[1.015]' : ''}`}
                                    style={{ 
                                        width: `${ITEM_W}%`,
                                        transform: isCurrent ? 'scale(1)' : 'scale(0.89)',
                                        opacity: isCurrent ? 1 : 0.6
                                    }}
                                    onClick={() => isCurrent && handleMovieClick(movie)}
                                >
                                    <div className='w-full h-full relative rounded-2xl overflow-hidden shadow-2xl'>
                                        <img
                                            src={movie?.backdrop_path?.startsWith('http') 
                                                ? movie.backdrop_path 
                                                : IMAGE_BASE_URL + movie?.backdrop_path}
                                            className='w-full h-full object-cover object-center'
                                            style={{
                                                filter: isCurrent ? 'brightness(1)' : 'brightness(0.5)',
                                                transition: `filter ${SLIDE_MS}ms ease`,
                                            }}
                                            alt={movie?.title || movie?.name}
                                        />
                                        {isCurrent && (
                                            <>
                                                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent' />
                                                <p className='absolute bottom-5 left-6 text-white font-black text-xl md:text-3xl drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] tracking-wide'>
                                                    {movie?.title || movie?.name}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Gradients de profunditat als costats */}
                    <div className='absolute left-0 top-0 h-full w-[12%] bg-gradient-to-r from-black/70 to-transparent pointer-events-none z-10' />
                    <div className='absolute right-0 top-0 h-full w-[12%] bg-gradient-to-l from-black/70 to-transparent pointer-events-none z-10' />

                    {/* Zones clicables als costats */}
                    <div className='absolute left-0 top-0 h-full w-[12%] cursor-pointer z-20'
                        onClick={() => handleNav(goPrev)} />
                    <div className='absolute right-0 top-0 h-full w-[12%] cursor-pointer z-20'
                        onClick={() => handleNav(goNext)} />

                    {/* Fletxa esquerra */}
                    <button
                        className='hidden md:flex absolute left-[9%] top-1/2 -translate-y-1/2 z-30
                            w-10 h-10 items-center justify-center rounded-full
                            bg-black/60 hover:bg-[#CC8400] text-white
                            transition-all duration-300 opacity-0 group-hover:opacity-100'
                        onClick={() => handleNav(goPrev)}
                    >
                        <HiChevronLeft className="text-[22px]" />
                    </button>

                    {/* Fletxa dreta */}
                    <button
                        className='hidden md:flex absolute right-[9%] top-1/2 -translate-y-1/2 z-30
                            w-10 h-10 items-center justify-center rounded-full
                            bg-black/60 hover:bg-[#CC8400] text-white
                            transition-all duration-300 opacity-0 group-hover:opacity-100'
                        onClick={() => handleNav(goNext)}
                    >
                        <HiChevronRight className="text-[22px]" />
                    </button>
                </div>

                {/* Dots indicadors */}
                <div className='flex justify-center gap-2 mt-3'>
                    {movieList.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleNav(() => setTrackIdx(idx + 1))}
                            className={`rounded-full transition-all duration-300
                                ${idx === currentMovieIdx
                                    ? 'w-6 h-2 bg-[#CC8400]'
                                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>
        </div>
    )
}

export default Slider
