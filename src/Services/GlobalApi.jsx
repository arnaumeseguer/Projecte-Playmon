import axios from "axios";

// Local Backend URL
const movieBaseUrl = "https://playmonserver.vercel.app/api/pelis"
const seriesBaseUrl = "https://playmonserver.vercel.app/api/series"

/**
 * Normalizes the local movie schema back into the TMDB format expected by frontend components.
 * This mapping ensures that components like MovieDetailPage, Slider, and MovieCard 
 * continue to work without modification when switching from TMDB to the local backend.
 */
const mapMovie = (m) => {
    if (!m) return m;
    
    // Handle JSON fields (categoria, reparto, direccio)
    // Some DB adapters return strings for JSON columns, others return parsed objects.
    const parseJson = (val) => {
        if (!val) return [];
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch (e) { return []; }
        }
        return val;
    };

    const categoria = parseJson(m.categoria);
    const reparto = parseJson(m.reparto);
    const direccio = parseJson(m.direccio);

    return {
        ...m,
        // Basic Metadata
        poster_path: m.poster_url || m.poster_path,
        backdrop_path: m.backdrop_url || m.backdrop_path,
        overview: m.description || m.overview,
        name: m.title || m.name,
        release_date: m.fecha_estreno ? m.fecha_estreno.split('T')[0] : (m.release_date || ''),
        first_air_date: m.fecha_estreno ? m.fecha_estreno.split('T')[0] : (m.first_air_date || ''),
<<<<<<< HEAD
        
=======
        status: m.estat || m.status,
        number_of_seasons: m.num_temporades || m.number_of_seasons,
        number_of_episodes: m.num_episodis || m.number_of_episodes,

>>>>>>> pantallaDetallsContingut#17
        // Genres (expected as array of objects {id, name})
        genres: Array.isArray(categoria) 
            ? categoria.map(c => typeof c === 'object' ? c : { id: c, name: String(c) }) 
            : [],
        
        // Credits (Cast & Crew)
        credits: {
            cast: Array.isArray(reparto) ? reparto : [],
            crew: Array.isArray(direccio) ? direccio : []
        },
        
        // Video / Trailer (Expected as results array)
        videos: {
            results: m.video_url ? [
                { 
                    key: m.video_url.includes('v=') ? m.video_url.split('v=')[1].split('&')[0] : m.video_url, 
                    site: 'YouTube', 
                    type: 'Trailer' 
                }
            ] : []
        },
        
        // Empty stubs for non-migrated features
        recommendations: { results: [] },
        similar: { results: [] },
        seasons: parseJson(m.temporades) || m.seasons || []
    };
};

// Wraps list response in { results: [...] } to match TMDB structure
const mapResults = (res) => {
<<<<<<< HEAD
    const rawData = Array.isArray(res.data) ? res.data : (res.data.results || []);
    return { 
=======
    let rawData = Array.isArray(res.data) ? res.data : (res.data.results || []);
    
    // Mescla aleatòria massiva per garantir l'efecte de rotació constant (tendències que sempre canvien)
    rawData = rawData.sort(() => 0.5 - Math.random());
    
    return {
>>>>>>> pantallaDetallsContingut#17
        ...res,
        data: { 
            results: rawData.map(mapMovie) 
        } 
    };
};

// Maps single object response
const mapSingle = (res) => {
    return { 
        ...res,
        data: mapMovie(res.data) 
    };
};

const getTrendingVideos = () => axios.get(movieBaseUrl).then(mapResults);

const getMoviesByGender = (genreId) => {
    return axios.get(`${movieBaseUrl}?categoria=${genreId}`).then(mapResults);
};

const getMovieDetails = (id) => axios.get(`${movieBaseUrl}/${id}`).then(mapSingle);

const getTvDetails = (id) => axios.get(`${seriesBaseUrl}/${id}`).then(mapSingle);

const getTvSeason = (tvId, seasonNum) => axios.get(`${seriesBaseUrl}/${tvId}`).then(res => {
    // Mapegem la sèrie pare
    const serie = mapMovie(res.data);
    
    // Busquem la temporada sol·licitada
    const targetSeason = serie.seasons.find(s => s.season_number == seasonNum) || {};
    // Traiem el recompte d'episodis de la temporada o fem un fallback a un numero fixat
    const count = targetSeason.episode_count || 10;
    
    // Generem els episodis falsos omplint la taula ràpidament amb les imatges preexistents
    const dummyEpisodes = Array.from({ length: count }).map((_, i) => ({
        id: `${tvId}-${seasonNum}-${i+1}`,
        episode_number: i + 1,
        name: `Episodi ${i + 1}`,
        overview: `Acompanya els personatges en un nou i apassionant capítol de la vida a ${serie.name}. No et perdis cap detall de la història.`,
        still_path: serie.backdrop_path, // Usem el fons de la sèrie com a caràtula de l'episodi
        runtime: Math.floor(Math.random() * (55 - 40 + 1) + 40) // Random runtime entre 40 i 55 minuts
    }));

    return {
        ...res,
        data: {
            ...targetSeason,
            episodes: dummyEpisodes
        }
    };
});

// Related movies: crida al backend local, retorna pelis del mateix gènere
const getRelated = (movieId) => axios.get(`${movieBaseUrl}/${movieId}/relacionats`).then(mapResults);

// Fil’trats per tipus (apunten a les taules separades del backend)
const getMovies = () => axios.get(movieBaseUrl).then(mapResults);
const getSeries = () => axios.get(seriesBaseUrl).then((res) => {
    let rawData = Array.isArray(res.data) ? res.data : (res.data.results || []);
    
    // Mescla aleatòria per trencar la monotonia de la base de dades
    rawData = rawData.sort(() => 0.5 - Math.random());

    return { ...res, data: { results: rawData.map(m => ({ ...mapMovie(m), media_type: 'tv' })) } };
});


// Cerca combinada per a pel·lícules i sèries directament al servidor (amb fallback frontend temporal)
const searchGlobal = async (query) => {
    try {
        // Obtenim llistes completes directament dels endpoints establerts
        const [pelisRes, seriesRes] = await Promise.all([
            getMovies().catch(() => ({ data: { results: [] } })),
            getSeries().catch(() => ({ data: { results: [] } }))
        ]);

        // Cerca normalitzada de text (ignorant accents/dieresis) per evitar "maquina" vs "màquina"
        const normalizedQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        const applyFilter = (results) => {
            return results.filter(item => {
                const title = (item.title || item.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return title.includes(normalizedQuery);
            });
        };

        const resultPelis = applyFilter(pelisRes.data?.results || []);
        const resultSeries = applyFilter(seriesRes.data?.results || []);

        return { data: { results: [...resultPelis, ...resultSeries] } };
    } catch (error) {
        console.error("Error performing global search:", error);
        return { data: { results: [] } };
    }
};

export default {
    getTrendingVideos,
    getMoviesByGender,
    getMovieDetails,
    getTvDetails,
    getTvSeason,
    getMovies,
    getSeries,
    getRelated,
    searchGlobal
}
