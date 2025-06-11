import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieList from "../components/MovieList";
import MovieModal from "../components/MovieModal"
import Search from "../components/Search";
import { fetchDataPage, TMDB_SEARCH_URL, TMDB_URL } from "../utils/utils";


export default function MoviesPage() {
    const [pageNumber, setPageNumber] = useState(1);
    const [movies, setMovies] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [nowPlayingActive, setNowPlayingActive] = useState(true);
    const [stateStack, setStateStack] = useState(["initialPage"]);

    const [showModal, setShowModal] = useState(false)
    const [modalMovie, setModalMovie] = useState({})

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
        let fetchedMovies = await fetchDataPage(TMDB_URL(pageNumber));
        updatePrevPage(pageNumber, fetchedMovies);
        setMovies(fetchedMovies);
    }

    // fetch next page of movies
    async function nextPage() {
        let fetchedMovies = await fetchDataPage(TMDB_URL(pageNumber));
        if (movies !== null) {
            fetchedMovies.results = [...movies.results, ...fetchedMovies.results];
        }
        updatePrevPage(pageNumber, fetchedMovies);
        setMovies(fetchedMovies);
    }

    async function searchPage() {
        let fetchedMovies = await fetchDataPage(TMDB_SEARCH_URL(searchQuery, 1));
        setMovies(fetchedMovies);
    }
    async function toggleView() {
        if (nowPlayingActive) {
            setMovies(prevPage.current.movies)
        } else {
            setMovies(null);
        }
    }
    async function clearSearch() {
        if (!nowPlayingActive) {
            setMovies(null);
        }
    }

    useEffect(() => {
        let nextState = stateStack.pop();
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
            case "toggleView":
                toggleView();
                break;
            case "clearSearch":
                clearSearch();
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

    const toggleViewClicked = (value) => {
        stateStack.push("toggleView")
        setStateStack([...stateStack]);
        setNowPlayingActive(value);
    };


    return (
        <>
            <Header />
            <main>
                <button className="load-movies" onClick={incrementPageNumber}>Load More Movies</button>
                <button className="toggle-view" onClick={() => toggleViewClicked(true)}>Now-Playing</button>
                <Search setSearchQuery={setSearchQuery}  stateStack={stateStack} setStateStack={setStateStack} toggleClick={toggleViewClicked} />
                {(showModal && (
                    <MovieModal
                        key={modalMovie.id}
                        isOpen={showModal}
                        movie={modalMovie}
                        setShowModal={setShowModal}
                        setModalMovie={setModalMovie}
                    />
                ))}
                <MovieList movies={movies} setModalMovie={setModalMovie} setShowModal={setShowModal} />
            </main>
            <Footer />
        </>
    )

}
