import MovieCard from "./MovieCard"
import { useEffect, useState } from "react";
import { fetchCurrentPage } from "../utils/utils";
import "../styles/MovieList.css"


export default function MovieList() {
    const [movies, setMovies] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        (async () => {
            setMovies(await fetchCurrentPage(pageNumber));
        })();
    }, [pageNumber]);

    if (!movies) {
        return <p>Loading movie data...</p>
    } else {
        return (
            <div className="movie-list">
                    {movies.results.map((movie, index) => (
                        <MovieCard key={index} movieData={movie} />
                    ))}
            </div>

        );
    }
}
