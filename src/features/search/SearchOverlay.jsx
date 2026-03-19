import React, { useState, useEffect } from 'react';
import MovieCard from '@/components/MovieCard';
import GlobalApi from '@/Services/GlobalApi';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

export default function SearchOverlay({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) { 
           setQuery(''); 
           setResults([]); 
           return; 
        }
        
        // Quan l'usuari deixa d'escriure per 500ms, enviem la petició de cerca
        const timeoutId = setTimeout(() => {
            if (query.length > 1) {
                setLoading(true);
                setError('');
                // CRIDEM AL TEU PROPI SERVIDOR (localhost:8000), NO A TMDB!
                GlobalApi.searchLocalMovies(query)
                    .then(res => {
                        setResults(res.data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.log("Error de connexió local:", err);
                        // FINS QUE EL TEU COMPANY NO ACABI EL BACKEND, POSAREM AQUEST 'MOCK'
                        setError('No es pot connectar al backend local. Simulant resultats de prova...');
                        setResults([
                            { id: 991, title: 'Resultat Simulat: ' + query + ' 1', poster_path: null, backdrop_path: null },
                            { id: 992, title: 'Resultat Simulat: ' + query + ' 2', poster_path: null, backdrop_path: null }
                        ]);
                        setLoading(false);
                    });
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/85 overflow-y-auto w-full h-full animate-fade-in">
            {/* Botó Tancar */}
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 md:right-12 text-white/50 hover:text-[#CC8400] transition-colors z-50 p-2"
                title="Tancar cercador"
            >
                <HiXMark className="text-4xl" />
            </button>
            
            <div className="pt-24 px-6 md:px-16 flex flex-col items-center min-h-[100vh]">
                {/* Search Bar Gegant */}
                <div className="relative w-full max-w-4xl group">
                    <HiMagnifyingGlass className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 text-3xl group-focus-within:text-[#CC8400] transition-colors" />
                    <input 
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Busca pel·lícules, programes i molt més..."
                        className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-5 pl-20 pr-8 text-xl text-white outline-none focus:bg-white/20 focus:backdrop-blur-lg focus:border-[#CC8400] transition-all shadow-xl"
                        autoFocus
                    />
                </div>

                {/* Zona de resultats */}
                <div className="w-full mt-12 mb-20">
                    {loading && (
                        <div className="flex justify-center mt-20">
                            <div className="w-10 h-10 border-4 border-[#CC8400] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {error && (
                        <div className="w-full text-center text-yellow-500 mb-8 bg-yellow-500/10 py-3 rounded-lg border border-yellow-500/20">
                            {error}
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {results.map((movie) => (
                                <div key={movie.id} className="animate-fade-in hover:scale-105 transition-transform">
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && query.length > 1 && results.length === 0 && !error && (
                        <div className="text-center text-white/50 text-xl mt-20">
                            No hi ha cap coincidència per a "{query}". 
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
