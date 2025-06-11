import { formatPosterPath } from "../utils/utils"
import "../styles/MovieModal.css"

export default function MovieModal({ movie, isOpen, setShowModal, setModalMovie}) {
  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setModalMovie(null);
    setShowModal(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-movie-title">{movie.title}</h2>
        <img
          src={formatPosterPath(movie.poster_path)}
          alt={`${movie.title} poster`}
          className="movie-poster-image"
        />
        <p className="modal-release-date">Released: {movie.release_date}</p>
        <p className="modal-overview">{movie.overview}</p>
        {movie.genres && movie.genres.length > 0 && (
          <p className="modal-genres">
            Genres: {movie.genres.map(genre => genre.name).join(', ')}
          </p>
        )}
        <button className="modal-close-button" onClick={handleClose}>X</button>
      </div>
    </div>
  );
}
