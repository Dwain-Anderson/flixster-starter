import { formatPosterPath, VISUAL_FAVORITE_BUTTON, VISUAL_WATCH_BUTTON } from "../utils/utils"
import CheckButton from "./CheckButton"
import "../styles/MovieCard.css"

export default function MovieCard({ movieData, setModalMovieId, setShowModal, stateStack, setStateStack, updateCheckedMovies }) {

    const handleClick = (event) => {
        event.preventDefault()
        setModalMovieId(movieData.id)
        stateStack.push("loadMovieDetails")
        setStateStack([...stateStack])
        setShowModal(true)
    }

    return (
        <span className="movie-card-container" onClick={handleClick}>
            <article className="movie-card">
                <div className="poster-container">
                    <img
                        src={formatPosterPath(movieData.poster_path)}
                        alt={`${movieData.title} poster`}
                        className="movie-poster-image"
                    />
                </div>
                <h2 className="movie-title">{movieData.title}</h2>
                <p className="movie-vote-average">Rating: {movieData.vote_average}</p>
                <div className="check-button-container">
                    <CheckButton visualElement={VISUAL_FAVORITE_BUTTON} movie={movieData} updateCheckedMovies={updateCheckedMovies}></CheckButton>
                    <CheckButton visualElement={VISUAL_WATCH_BUTTON} movie={movieData} updateCheckedMovies={updateCheckedMovies}></CheckButton>
                </div>
            </article>
        </span>
    )
}
