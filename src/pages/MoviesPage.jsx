import { useState, useEffect, useRef } from "react";
import { fetchDataPage, TMDB_API_MANAGER } from "../utils/utils";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal"
import Search from "../components/Search";
import Sort from "../components/Sort";
import Sidebar from "../components/Sidebar";
import "../styles/MoviesPage.css";

export default function MoviesPage() {
    const [pageNumber, setPageNumber] = useState(1);
    const [movies, setMovies] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [stateStack, setStateStack] = useState(["initialPage"]);
    const [showModal, setShowModal] = useState(false)
    const [movieDetails, setMovieDetails] = useState({})
    const [modalMovieId, setModalMovieId] = useState(null)
    const [sortDetails, setSortDetails] = useState(null)
    const [showDefaultMovies, setShowDefaultMovies] = useState(true)

    const LIKED_CHECK_STRING = "favorited"
    const WATCHED_CHECK_STRING = "watched"
    const prevPage = useRef({ pageNumber: 1, movies: null });

    const initMap = new Map()
    initMap.set(LIKED_CHECK_STRING, new Set())
    initMap.set(WATCHED_CHECK_STRING, new Set())
    const [checkedMovies, setCheckedMovies] = useState(initMap)

    function updateCheckedMovies(key, movie, membership) {
        console.log(key, movie, membership)
        const value = checkedMovies.get(key)
        const newCheckedMovies = membership ? [...value, movie] : value.filter(item => item.id !== movie.id)
        checkedMovies.set(key, newCheckedMovies)
        setCheckedMovies(new Map(checkedMovies))
    }

    /**
     * Store the previous page number and movies, as movies are cumulatively stored under nextPage()
     * @param {number} pageNumber - the page number to set
     * @param {Object} movies - An object storing a list of movies, along with other meta data.
     */
    function updatePrevPage(pageNumber, movies) {
        prevPage.current.pageNumber = pageNumber;
        prevPage.current.movies = movies;
    }

    /**
     * Fetches the next page of now playing movies from The Movie Database.
     */
    async function nextPage() {
        const fetchedMovies = await fetchDataPage(TMDB_API_MANAGER.nowPlayingMovies(pageNumber));
        if (movies !== null) {
            fetchedMovies.results = [...movies.results, ...fetchedMovies.results];
        }
        updatePrevPage(pageNumber, fetchedMovies);
        setMovies(fetchedMovies);
    }

    /**
     * Fetches the pages from The Movie Database that correspond to the search query.
     */
    async function searchPage() {
        const fetchedMovies = await fetchDataPage(TMDB_API_MANAGER.searchMovies(searchQuery, 1));
        setMovies(fetchedMovies);
    }

    /**
     *  Clears the search results by loading the fetched page number results.
     */
    async function getPrevPage() {
        setMovies(prevPage.current.movies);
    }

    /**
     * Fetches both additional details about a given movie and any applicable trailer videos from The Movie Database if they exist.
     */
    async function loadMovieDetails() {
        let fetchedMovie = await fetchDataPage(TMDB_API_MANAGER.getMovieById(modalMovieId));
        const fetchMovieVideos = await fetchDataPage(TMDB_API_MANAGER.getMovieVideos(modalMovieId));
        const fetchMovieVideo = (fetchMovieVideos.results.filter(video => video.type === "Trailer" && video.site === "YouTube"))[0]
        fetchedMovie = { ...fetchedMovie, video: null }
        if (fetchMovieVideo) {
            fetchedMovie.video = fetchMovieVideo.key;
        }
        setMovieDetails({ ...fetchedMovie });
    }

    /**
     * Sorts the list of movies according to one of three criteria: title, release-date, or vote-average.
     * If sortDetails does not match any of these three options, sortData essentially becomes the identity function.
     */
    async function sortData() {
        const sortedMoviesList = [...movies.results]
        switch (sortDetails) {
            case "title":
                sortedMoviesList.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "release-date":
                sortedMoviesList.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
                break;
            case "vote-average":
                sortedMoviesList.sort((a, b) => b.vote_average - a.vote_average);
                break;
            default:
                break;
        }
        setMovies({ ...movies, results: sortedMoviesList });
    }

    /**
     *  Load movies that were checked as either watched or favorited onto the page.
     */
    async function loadCheckedMovies(key) {
        if (key !== WATCHED_CHECK_STRING && key !== LIKED_CHECK_STRING) {
            return;
        }
        setMovies({ ...movies, results: checkedMovies.get(key) })
    }

    useEffect(() => {
        // We did not cover useContext, so instead of using (https://en.wikipedia.org/wiki/Finite-state_machine) styled mechanism, I would use the
        // useContext method instead for communicating state changes down the dom tree.
        const nextState = stateStack.pop()
        switch (nextState) {
            case "initialPage": case "nextPage":
                nextPage();
                break;
            case "searchPage":
                searchPage();
                break;
            case "loadMovieDetails":
                loadMovieDetails();
                break;
            case "sortData":
                sortData();
                break;
            case "home": case "clearSearch": case "toggleView":
                getPrevPage();
                break;
            case LIKED_CHECK_STRING: case WATCHED_CHECK_STRING:
                loadCheckedMovies(nextState);
                break;
            default:
                break;
        }
    }, [stateStack]);


    const incrementPageNumber = () => {
        stateStack.push("nextPage")
        setStateStack([...stateStack]);
        setPageNumber(pageNumber + 1);
    };

    return (
        <div className="movies-page">
            <section>
                <Sidebar setShowDefaultMovies={setShowDefaultMovies} stateStack={stateStack} setStateStack={setStateStack}>

                </Sidebar>

                {(showDefaultMovies && <section className="banner">
                    <Search setSearchQuery={setSearchQuery} stateStack={stateStack} setStateStack={setStateStack} />
                    <Sort setSortDetails={setSortDetails} stateStack={stateStack} setStateStack={setStateStack} />
                </section>)}
            </section>
            {(showModal && (
                <MovieModal
                    key={modalMovieId}
                    isOpen={showModal}
                    movie={movieDetails}
                    setShowModal={setShowModal}
                    setModalMovieId={setModalMovieId}
                    setMovieDetails={setMovieDetails}
                />
            ))}
            <MovieList updateCheckedMovies={updateCheckedMovies} movies={movies} setModalMovieId={setModalMovieId} setShowModal={setShowModal} stateStack={stateStack} setStateStack={setStateStack} />
            {(showDefaultMovies && <div className="load-movies-container">
                <button className="load-movies" onClick={incrementPageNumber}><p>Load More Movies</p></button>
            </div>)}
        </div>
    )
}
