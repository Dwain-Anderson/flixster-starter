import { useState, useEffect, useRef } from "react";
import { fetchDataPage, TMDB_SEARCH_URL, TMDB_URL, TMDB_MOVIE_ID_URL, TMDB_VIDEO_URL} from "../utils/utils";
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
    const [nowPlayingActive, setNowPlayingActive] = useState(true);
    const [stateStack, setStateStack] = useState(["initialPage"]);

    const [showModal, setShowModal] = useState(false)

    const [movieDetails, setMovieDetails] = useState({})
    const [modalMovieId, setModalMovieId] = useState(null)
    const [sortDetails, setSortDetails] = useState(null)


    // store previous page data instead of refetching since pn is cumulative under nextPage's concat
    const prevPage = useRef({ pageNumber: 1, movies: null });

    const updatePrevPage = (pageNumber, movies) => {
        prevPage.current.pageNumber = pageNumber;
        prevPage.current.movies = movies;
    }

    /**
     * Fetch initial page of movies
     */
    async function initialPage() {
        const fetchedMovies = await fetchDataPage(TMDB_URL(pageNumber));
        updatePrevPage(pageNumber, fetchedMovies);
        setMovies(fetchedMovies);
    }

    // fetch next page of movies
    async function nextPage() {
        const fetchedMovies = await fetchDataPage(TMDB_URL(pageNumber));
        if (movies !== null) {
            fetchedMovies.results = [...movies.results, ...fetchedMovies.results];
        }
        updatePrevPage(pageNumber, fetchedMovies);
        setMovies(fetchedMovies);
    }

    async function searchPage() {
        const fetchedMovies = await fetchDataPage(TMDB_SEARCH_URL(searchQuery, 1));
        setMovies(fetchedMovies);
    }

    async function clearSearch() {
        setMovies(prevPage.current.movies);

    }

    async function loadMovieDetails() {
        let fetchedMovie = await fetchDataPage(TMDB_MOVIE_ID_URL(modalMovieId));
        const fetchMovieVideos = await fetchDataPage(TMDB_VIDEO_URL(modalMovieId));
        const fetchMovieVideo = (fetchMovieVideos.results.filter(video => video.type === "Trailer" && video.site === "YouTube"))[0]
        if (fetchMovieVideo) {
            fetchedMovie.video = fetchMovieVideo.key;
        } else {
            fetchedMovie.video = null;
        }
        fetchedMovie =  {...fetchedMovie}
        setMovieDetails(fetchedMovie);
    }

    function sortData() {
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
        const sortedMovies = { ...movies, results: sortedMoviesList }
        setMovies(sortedMovies);
    }

    useEffect(() => {
        const nextState = stateStack.pop();
        switch (nextState) {
            case "initialPage":
                initialPage();
                break;
            case "nextPage":
                nextPage();
                break;
            case "searchPage":
                searchPage();
                break;
            case "clearSearch&toggleView":
                clearSearch();
                break;
            case "loadMovieDetails":
                loadMovieDetails();
                break;
            case "sortData":
                sortData();
            default:
                break;

    }}, [stateStack, sortDetails]);


    const incrementPageNumber = () => {
        stateStack.push("nextPage")
        setStateStack([...stateStack]);
        setPageNumber(pageNumber + 1);
    };

    const toggleViewClicked = (value) => {
        stateStack.push("toggleView")
        setStateStack([...stateStack]);
        setNowPlayingActive(value);
    };

    return (
        <>
            <Header />
            <main>
                <section className="banner">
                    <Search setSearchQuery={setSearchQuery}  stateStack={stateStack} setStateStack={setStateStack} toggleClick={toggleViewClicked} />
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
