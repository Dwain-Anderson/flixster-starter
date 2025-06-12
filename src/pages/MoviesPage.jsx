import { useState, useEffect, useRef } from "react";
import { fetchDataPage, TMDB_API_MANAGER} from "../utils/utils";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal"
import Search from "../components/Search";
import Sort from "../components/Sort";
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

    const prevPage = useRef({ pageNumber: 1, movies: null });

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
    async function clearSearch() {
        setMovies(prevPage.current.movies);
    }

    /**
     * Fetches both additional details about a given movie and any applicable trailer videos from The Movie Database if they exist.
     */
    async function loadMovieDetails() {
        let fetchedMovie = await fetchDataPage(TMDB_API_MANAGER.getMovieById(modalMovieId));
        fetchedMovie = {...fetchedMovie, video: null}
        const fetchMovieVideos = await fetchDataPage(TMDB_API_MANAGER.getMovieVideos(modalMovieId));
        const fetchMovieVideo = (fetchMovieVideos.results.filter(video => video.type === "Trailer" && video.site === "YouTube"))[0]
        if (fetchMovieVideo) {
            fetchedMovie.video = fetchMovieVideo.key;
        }
        setMovieDetails({...fetchedMovie});
    }

    /**
     * Sorts the list of movies according to one of three criteria: title, release-date, or vote-average.
     * If sortDetails does not match any of these three options, the movie list remains unchanged.
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

    useEffect(() => {
        // some things are better left unexplained... (https://en.wikipedia.org/wiki/Finite-state_machine)
        switch (stateStack.pop()) {
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
            case "clearSearch": case "toggleView":
                clearSearch();
                break;
            default:
                break;
    }}, [stateStack]);


    const incrementPageNumber = () => {
        stateStack.push("nextPage")
        setStateStack([...stateStack]);
        setPageNumber(pageNumber + 1);
    };

    return (
        <>
            <Header />
            <main>
                <section className="banner">
                    <Search setSearchQuery={setSearchQuery}  stateStack={stateStack} setStateStack={setStateStack} />
                    <Sort setSortDetails={setSortDetails} stateStack={stateStack} setStateStack={setStateStack} />
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
                <MovieList movies={movies} setModalMovieId={setModalMovieId} setShowModal={setShowModal} stateStack={stateStack} setStateStack={setStateStack} />
                <div className = "load-movies-container">
                    <button className="load-movies" onClick={incrementPageNumber}><p>Load More Movies</p></button>
                </div>
            </main>
            <Footer />
        </>
    )
}
