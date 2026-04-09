import React, { useEffect, useState, useRef } from 'react'
import Header from '@/components/Header'
import HomeFooter from '@/features/home/components/HomeFooter'
import MovieCard from '@/components/MovieCard'
import GlobalApi from '@/Services/GlobalApi'
import { HiFilm, HiChevronLeft, HiChevronRight } from 'react-icons/hi2'

// Tots els gèneres TMDB presents al CSV de 1000 pel·lícules
const MOVIE_GENRES = [
    { id: 28,    name: 'Acció i Aventura',    desc: "Per a qui estima l'adrenalina" },
    { id: 35,    name: 'Comèdia',             desc: 'Per fer un bon somriure' },
    { id: 18,    name: 'Drama',               desc: 'Històries que et marcaran' },
    { id: 53,    name: 'Thriller',            desc: 'Tensió fins a l\'últim segon' },
    { id: 27,    name: 'Terror',              desc: 'Si goseu veure-les de nit' },
    { id: 878,   name: 'Ciència Ficció',      desc: 'Universos que et faran pensar' },
    { id: 12,    name: 'Aventura',            desc: 'Viatja sense moure\'t de casa' },
    { id: 16,    name: 'Animació',            desc: 'Per a tota la família' },
    { id: 14,    name: 'Fantasia',            desc: 'Mons impossibles fets realitat' },
    { id: 80,    name: 'Crim',               desc: 'El costat fosc de la societat' },
    { id: 10749, name: 'Romàntic',           desc: 'Per als amants de l\'amor' },
    { id: 10751, name: 'Família',            desc: 'Per gaudir junts' },
    { id: 99,    name: 'Documental',         desc: 'La veritat de vegades supera la ficció' },
    { id: 36,    name: 'Història',           desc: 'El passat que ens defineix' },
    { id: 9648,  name: 'Misteri',            desc: 'Truca el detectiu que portes dins' },
    { id: 10752, name: 'Bèl·lic',            desc: 'Epopeies de guerra i sacrifici' },
    { id: 37,    name: 'Western',            desc: 'El Far West en tota la seva glòria' },
]

// Component de fila horitzontal reutilitzable
function GenreRow({ genre, allMovies, isFirst }) {
    const rowRef = useRef(null)
    const genreMovies = allMovies.filter(m => {
        const genres = m.genres || []
        return genres.some(g => (typeof g === 'object' ? g.id : g) === genre.id)
    }).slice(0, 25)

    if (genreMovies.length === 0) return null

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
                        <span className='text-[10px] font-black tracking-[0.15em] px-2 py-0.5 rounded-sm text-[#CC8400] bg-[#CC8400]/10 border border-[#CC8400]/30'>
                            PEL·LÍCULES
                        </span>
                    )}
                    <h2 className={`text-white font-bold text-lg leading-tight ${isFirst ? 'mt-1.5' : ''}`}>{genre.name}</h2>
                    <p className='text-white/40 text-xs'>{genre.desc}</p>
                </div>
                <span className='text-white/30 text-xs mb-0.5'>{genreMovies.length} títols</span>
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
                    {genreMovies.map(movie => (
                        <div key={movie.id} className='flex-shrink-0 group/card relative snap-start'>
                            <MovieCard movie={movie} />
                            <div className='absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6
                                            bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-lg
                                            opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 pointer-events-none'>
                                <p className='text-white text-[11px] font-medium truncate'>{movie.title || movie.name}</p>
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

export default function MoviesPage() {
    const [allMovies, setAllMovies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        GlobalApi.getMovies()
            .then(res => setAllMovies(res?.data?.results || res?.data || []))
            .catch(() => setAllMovies([]))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className='min-h-screen' style={{ background: '#0a0a0a' }}>
            <Header />
            <div className='pt-24 pb-16'>
                {/* Encapçalament de pàgina */}
                <div className='flex items-center gap-4 px-6 md:px-12 mb-8'>
                    <HiFilm className='text-[#CC8400] text-4xl flex-shrink-0' />
                    <div>
                        <h1 className='text-3xl font-black text-white'>Pel·lícules</h1>
                        <p className='text-white/40 text-sm mt-0.5'>
                            {allMovies.length > 0 ? `${allMovies.length} títols · Ordenats per gènere` : 'Carregant catàleg...'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className='flex justify-center py-32'>
                        <div className='w-12 h-12 border-4 border-[#CC8400] border-t-transparent rounded-full animate-spin' />
                    </div>
                ) : (
                    MOVIE_GENRES.map((genre, index) => (
                        <GenreRow key={genre.id} genre={genre} allMovies={allMovies} isFirst={index === 0} />
                    ))
                )}
            </div>
            <HomeFooter />
        </div>
    )
}
