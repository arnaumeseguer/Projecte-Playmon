import axios from "axios";

const movieBaseUrl = "https://api.themoviedb.org/3"
const api_key = "fdf457c53c98d9f517d0dc9ebb60c203"

const getTrendingVideos = () => axios.get(movieBaseUrl +
    "/trending/all/week?api_key=" + api_key);

const getMoviesByGender = (genreId) => axios.get(movieBaseUrl +
    "/discover/movie?api_key=" + api_key + "&with_genres=" + genreId);

const getMovieDetails = (id) => axios.get(movieBaseUrl +
    "/movie/" + id + "?api_key=" + api_key +
    "&append_to_response=credits,videos,similar,recommendations&language=es-ES");

const getTvDetails = (id) => axios.get(movieBaseUrl +
    "/tv/" + id + "?api_key=" + api_key +
    "&append_to_response=credits,videos,similar,recommendations&language=es-ES");

const getTvSeason = (tvId, seasonNum) => axios.get(movieBaseUrl +
    "/tv/" + tvId + "/season/" + seasonNum + "?api_key=" + api_key + "&language=es-ES");

// Aquesta trucada en lloc de cridar a TMDB, truca al teu futur Servidor Python de la Base de dades.
// El teu company només haurà de crear al main.py la ruta equivalent a /api/movies/search?query=...
const searchLocalMovies = (query) => axios.get("http://localhost:8000/api/movies/search?query=" + query);

export default {
    getTrendingVideos,
    getMoviesByGender,
    getMovieDetails,
    getTvDetails,
    getTvSeason,
    searchLocalMovies
}

