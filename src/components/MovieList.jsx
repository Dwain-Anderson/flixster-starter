import MovieCard from "./MovieCard"
import { useEffect, useState } from "react";
import { fetchCurrentPage} from "../utils/utils";
import "../styles/MovieList.css"

export default function MovieList() {
    const [movies, setMovies] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const nextPage = (e) => {
        (async () => {
            setPageNumber(pageNumber + 1);
            let fetchedMovies = await fetchCurrentPage(pageNumber);
            console.log(fetchedMovies);
            if (movies !== null) {
                fetchedMovies.results = [...movies.results, ...fetchedMovies.results];
            }
            setMovies(fetchedMovies);
        })();
    }


    useEffect(() => {
        (async () => {
            let fetchedMovies = await fetchCurrentPage(pageNumber);
            setMovies(fetchedMovies);
        })();
    }, []);

    if (!movies) {
        return <p>Loading movie data...</p>
    } else {
        return (
            <>
            <div className="movie-list">
                    {movies.results.map((movie, index) => (
                        <MovieCard key={index} movieData={movie} />
                    ))}
            </div>
            <button className="load-movies" onClick={nextPage}>Load More Movies</button>
            </>

        );
    }
}
