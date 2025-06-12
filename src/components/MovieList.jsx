import MovieCard from "./MovieCard"
import "../styles/MovieList.css"

export default function MovieList({movies, setModalMovieId, setShowModal, stateStack, setStateStack}) {
    if (!movies) {
        return (<p>Loading movie data...</p>)
    } else {
        return (
            <div className="movie-list">
                    {movies.results.map((movie, index) => (
                        <MovieCard key={index} movieData={movie} setModalMovieId={setModalMovieId} setShowModal={setShowModal} stateStack={stateStack} setStateStack={setStateStack} />
                    ))}
            </div>
        );
    }
}
