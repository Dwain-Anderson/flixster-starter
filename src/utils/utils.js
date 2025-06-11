const TMDB_API_KEY = import.meta.env.VITE_API_KEY;
const TMDB_BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;
const TMDB_OPTIONS = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        }
}


const GENRES_URL ='https://api.themoviedb.org/3/genre/movie/list?language=en'

async function loadGenres() {
    let genreNames = new Map();
    try {
        const response = await fetch(GENRES_URL, TMDB_OPTIONS)
        const result = await response.json();
        result.genres.forEach(genre => genreNames.set(genre.id, genre.name))
        return genreNames;
    } catch (error) {
        return genreNames;
    }
}

const MOVIE_GENRES = await loadGenres();



const TMDB_URL = pageNumber => `https://api.themoviedb.org/3/movie/now_playing?&page=${pageNumber}`

const TMDB_SEARCH_URL = (query, pageNumber) =>
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNumber}`


/**
 * Formats the poster path to a full url
 * @param {string} basename
*/
function formatPosterPath(basename){
    return basename === null ? "/movie.png" : `https://image.tmdb.org/t/p/w500${basename}`
}

/**
 * Fetches a page of data from the TMDB API using the specified url.
 * @param {string} url - The url to fetch
 */
async function fetchDataPage(url) {
    const response = await fetch(url, TMDB_OPTIONS)
    const result = await response.json();
    return result;
}




function formatGenreString(movie) {
    const genres = movie.genre_ids.map(id => MOVIE_GENRES.get(id)).filter(Boolean);
    return (!genres || genres.length === 0) ? "No genres available" : genres.join(", ")
}

export {fetchDataPage, formatPosterPath, TMDB_URL, TMDB_SEARCH_URL, formatGenreString};
