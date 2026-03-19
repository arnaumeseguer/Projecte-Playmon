import axios from "axios";

// Local Backend URL
const movieBaseUrl = "http://127.0.0.1:5000/api/pelis"

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
        backdrop_path: m.backdrop_url || m.backdrop_path,
        overview: m.description || m.overview,
        name: m.title || m.name,
        release_date: m.fecha_estreno ? m.fecha_estreno.split('T')[0] : (m.release_date || ''),
        first_air_date: m.fecha_estreno ? m.fecha_estreno.split('T')[0] : (m.first_air_date || ''),
        
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
        seasons: m.seasons || []
    };
};

// Wraps list response in { results: [...] } to match TMDB structure
const mapResults = (res) => {
    const rawData = Array.isArray(res.data) ? res.data : (res.data.results || []);
    return { 
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

const getTvDetails = (id) => axios.get(`${movieBaseUrl}/${id}`).then(mapSingle);

const getTvSeason = (tvId, seasonNum) => axios.get(`${movieBaseUrl}/${tvId}`).then(mapSingle);

export default {
    getTrendingVideos,
    getMoviesByGender
}
