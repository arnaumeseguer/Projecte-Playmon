import React, { useEffect, useState, useRef } from 'react'
import Header from '@/components/Header'
import HomeFooter from '@/features/home/components/HomeFooter'
import MovieCard from '@/components/MovieCard'
import GlobalApi from '@/Services/GlobalApi'
import { HiTv, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

// Tots els gèneres TMDB presents al CSV de 1000 sèries
const SERIES_GENRES = [
    { id: 18,    name: 'Drama',                  desc: 'Personatges i trames captivadors' },
    { id: 35,    name: 'Comèdia',                desc: 'Episodis que alegren el dia' },
    { id: 10759, name: 'Acció i Aventura',       desc: 'Adrenalina en cada episodi' },
    { id: 10765, name: 'Fantasia i Sci-Fi',      desc: 'Mons impossibles fets realitat' },
    { id: 80,    name: 'Crim',                   desc: 'Misteris que t\'atrapen' },
    { id: 9648,  name: 'Misteri',                desc: 'La veritat sempre es descobreix' },
    { id: 99,    name: 'Documental',             desc: 'Realitat més estranya que la ficció' },
    { id: 16,    name: 'Animació',               desc: 'Per a totes les edats' },
    { id: 10751, name: 'Família',                desc: 'Per gaudir en companyia' },
    { id: 10762, name: 'Infantil',               desc: 'Diversió per als més petits' },
    { id: 10764, name: 'Reality',                desc: 'La vida real sense filtres' },
    { id: 10768, name: 'Guerra i Política',      desc: 'Conflictes que canvien el món' },
    { id: 37,    name: 'Western',                desc: 'L\'oest salvatge a la pantalla' },
]

// Component de fila horitzontal
function GenreRow({ genre, allSeries, isFirst }) {
    const rowRef = useRef(null)
    const genreSeries = allSeries.filter(s => {
        const genres = s.genres || []
        return genres.some(g => (typeof g === 'object' ? g.id : g) === genre.id)
    }).slice(0, 25)

    if (genreSeries.length === 0) return null

    const scroll = (dir) => {
        if (rowRef.current) {
            const scrollAmount = rowRef.current.clientWidth * 0.8;
            rowRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' })
        }
    }

    return (
        <section className='group/row px-6 md:px-12 py-5'>
            {/* Capçalera */}
            <div className='flex items-end justify-between mb-4'>
                <div>
                    {isFirst && (
                        <span className='text-[10px] font-black tracking-[0.15em] px-2 py-0.5 rounded-sm text-indigo-400 bg-indigo-500/10 border border-indigo-500/30'>
                            SÈRIES
                        </span>
                    )}
                    <h2 className={`text-white font-bold text-lg leading-tight ${isFirst ? 'mt-1.5' : ''}`}>{genre.name}</h2>
                    <p className='text-white/40 text-xs'>{genre.desc}</p>
                </div>
                <span className='text-white/30 text-xs mb-0.5'>{genreSeries.length} sèries</span>
            </div>

            {/* Row */}
            <div className='relative'>
                <button onClick={() => scroll(-1)}
                    className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20
                               w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white
                               opacity-0 group-hover/row:opacity-100 hover:bg-black hover:scale-110 transition-all duration-300'>
                    <HiChevronLeft className='text-lg' />
                </button>

                <div ref={rowRef} className='flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1'
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {genreSeries.map(serie => (
                        <div key={serie.id} className='flex-shrink-0 group/card relative snap-start'>
                            <MovieCard movie={{ ...serie, media_type: 'tv' }} />
                            <div className='absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6
                                            bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-lg
                                            opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none'>
                                <p className='text-white text-[11px] font-medium truncate'>{serie.title || serie.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={() => scroll(1)}
                    className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20
                               w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white
                               opacity-0 group-hover/row:opacity-100 hover:bg-black hover:scale-110 transition-all duration-300'>
                    <HiChevronRight className='text-lg' />
                </button>
                <div className='absolute right-0 top-0 bottom-1 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none' />
            </div>

            <div className='mt-5 h-px bg-white/5' />
        </section>
    )
}

export default function SeriesPage() {
    const [allSeries, setAllSeries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        GlobalApi.getSeries()
            .then(res => setAllSeries(res?.data?.results || res?.data || []))
            .catch(() => setAllSeries([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className='min-h-screen' style={{ background: '#0a0a0a' }}>
            <Header />
            <div className='pt-24 pb-16'>
                {/* Encapçalament */}
                <div className='flex items-center gap-4 px-6 md:px-12 mb-8'>
                    <HiTv className='text-indigo-400 text-4xl flex-shrink-0' />
                    <div>
                        <h1 className='text-3xl font-black text-white'>Sèries</h1>
                        <p className='text-white/40 text-sm mt-0.5'>
                            {allSeries.length > 0 ? `${allSeries.length} sèries · Ordenades per gènere` : 'Carregant catàleg...'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className='flex justify-center py-32'>
                        <div className='w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin' />
                    </div>
                ) : allSeries.length === 0 ? (
                    <div className='flex flex-col items-center py-32 text-center'>
                        <HiTv className='text-white/10 text-6xl mb-4' />
                        <p className='text-white/40 text-xl'>Sèries no disponibles</p>
                        <p className='text-white/20 text-sm mt-2'>El servidor de sèries s'està preparant. Torna aviat!</p>
                    </div>
                ) : (
                    SERIES_GENRES.map((genre, index) => (
                        <GenreRow key={genre.id} genre={genre} allSeries={allSeries} isFirst={index === 0} />
                    ))
                )}
            </div>
            <HomeFooter />
        </div>
    )
}
