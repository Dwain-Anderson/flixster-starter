import MovieCard from "./MovieCard"
import "../styles/MovieList.css"

export default function MovieList({movies}) {
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
