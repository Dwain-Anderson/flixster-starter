const TMDB_BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;


/**
 * Returns an object that contains the options for the fetch request to The Movie Database API
 * @param {string} methodType - The method type of the request.
 */
const TMDB_OPTIONS = (methodType) => {
    return {
        method: methodType,
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
        }
    }
}

/**
 * A simple object that contains the urls for the different endpoints of the The Movie Database API
 */
const TMDB_API_MANAGER = {
    nowPlayingMovies:  pageNumber => `https://api.themoviedb.org/3/movie/now_playing?&page=${pageNumber}`,
    searchMovies: (query, pageNumber) => `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${pageNumber}`,
    getMovieById:  movieId => `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
    getMovieVideos: movieId => `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`
}

/**
 * Fetches a page of data from The Movie Database API using the specified url, hardcoded GET method as all requests are GET in this app
 * @param {string} url - The url to fetch from.
 */
async function fetchDataPage(url) {
    const response = await fetch(url, TMDB_OPTIONS('GET'))
    const result = await response.json();
    return result;
}

/**
 * Formats the poster path to a full url if it exists, otherwise returns a default poster image
 * @param {string} basename - the base path of the poster image
*/
function formatPosterPath(basename){
    return basename === null ? "/movie.png" : `https://image.tmdb.org/t/p/w500${basename}`
}

/**
 * Formats the  list of genres for a given movie to comma separated list of genres if it exists, otherwise returns "No genres available"
 * @param {*} movie A movie object
 * @param {*} genres A list of genres objects.
 * @returns
 */
function formatGenreString(movie, genres) {
    if (movie === null || movie === undefined || genres === null || genres === undefined) {
        return "No genres available";
    }
    const result = genres.map(genre => genre.name);
    return (!result || result.length === 0) ? "No genres available" : result.join(", ")
}

const VISUAL_FAVORITE_BUTTON  =  {
    name: "favorited",
    checkedIcon: "liked.png",
    uncheckedIcon: "unliked.png",
}

const VISUAL_WATCH_BUTTON = {
    name: "watched",
    checkedIcon: "watched.png",
    uncheckedIcon: "unwatched.png",
}

export { TMDB_API_MANAGER, fetchDataPage, formatPosterPath, formatGenreString, VISUAL_FAVORITE_BUTTON, VISUAL_WATCH_BUTTON };
