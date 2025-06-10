const TMDB_API_KEY = import.meta.env.VITE_API_KEY;

/**
 * @param {string} basename
*/
function formatPosterPath(basename){
    return `https://image.tmdb.org/t/p/w500${basename}`
}


/**
 *
 *
 */
async function fetchCurrentPage(pageNumber) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&page=${pageNumber}`);
    const result = await response.json();
    return result;
}


export {fetchCurrentPage, formatPosterPath};
