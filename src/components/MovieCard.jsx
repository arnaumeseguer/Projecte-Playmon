import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HiFilm, HiTv } from 'react-icons/hi2'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

function MovieCard({ movie }) {
    const navigate = useNavigate()

    const handleClick = () => {
        const isTv = movie.media_type === 'tv' || (!movie.title && movie.name)
        const type = isTv ? 'tv' : 'movie'
        navigate(`/${type}/${movie.id}`)
    }

    const imagePath = movie.backdrop_path || movie.poster_path
    const imageSrc = imagePath?.startsWith('http')
        ? imagePath
        : imagePath
            ? IMAGE_BASE_URL + imagePath
            : null

    if (!imageSrc) {
        // Placeholder quan no hi ha imatge
        const isTv = movie.media_type === 'tv' || (!movie.title && movie.name)
        return (
            <div
                onClick={handleClick}
                className='w-[200px] md:w-[280px] aspect-video rounded-lg cursor-pointer
                           bg-white/5 border border-white/10 flex flex-col items-center justify-center
                           hover:border-[#CC8400]/50 hover:bg-white/10 transition-all duration-200 group'
            >
                {isTv
                    ? <HiTv className='text-white/20 text-3xl mb-2 group-hover:text-white/40 transition-colors' />
                    : <HiFilm className='text-white/20 text-3xl mb-2 group-hover:text-white/40 transition-colors' />
                }
                <p className='text-white/30 text-xs text-center px-2 line-clamp-3 group-hover:text-white/50 transition-colors'>
                    {movie.title || movie.name}
                </p>
            </div>
        )
    }

    return (
        <img
            src={imageSrc}
            onClick={handleClick}
            className='w-[200px] md:w-[280px] border-[3px]
            border-transparent hover:border-white/60 cursor-pointer rounded-lg
            hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]
            transition-all duration-200 ease-in-out aspect-video object-cover'
            alt={movie.title || movie.name}
        />
    )
}

export default MovieCard