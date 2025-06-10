import { formatPosterPath } from "../utils/utils"
import "../styles/MovieCard.css"

export default function MovieCard({ movieData }) {
    return (
        <div className="movie-card">
            <h2 className="movie-title">{movieData.title}</h2>
            <img
                src={formatPosterPath(movieData.poster_path)}
                alt={`${movieData.title} poster`}
                className="movie-poster-image"
            />
            <p className="movie-vote-average">Rating: {movieData.vote_average}</p>
        </div>
    )
}
