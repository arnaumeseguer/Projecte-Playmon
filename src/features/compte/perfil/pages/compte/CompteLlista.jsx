import React, { useEffect, useState } from 'react'
import MovieCard from '@/components/MovieCard'

export default function CompteLlista() {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('playmon_watchlist') || '[]')
        setMovies(stored)
    }, [])

    return (
        <div className="bg-[#111] p-6 lg:p-8 rounded-2xl min-h-[600px] border border-white/5">
            <div className="mb-8 border-b border-white/10 pb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Veure més tard</h1>
                <p className="text-[#A0A0A0]">Totes les pel·lícules i sèries que has desat per a revisar-les.</p>
            </div>

            {movies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <h3 className="text-xl font-medium text-white/60 mb-2">La teva llista està buida</h3>
                    <p className="text-white/40">Busca pel·lícules al catàleg i prem el botó '+' per començar a desar el teu contingut preferit.</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 md:gap-6">
                    {movies.map(movie => (
                        <div key={movie.id} className="flex-shrink-0 animate-fade-in">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
