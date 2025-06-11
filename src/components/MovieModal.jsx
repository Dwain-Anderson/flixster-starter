import { formatPosterPath, formatGenreString} from "../utils/utils"
import "../styles/MovieModal.css"

export default function MovieModal({ movie, isOpen, setShowModal, setModalMovie}) {
  console.log(movie)
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
          src={formatPosterPath(movie.backdrop_path)}
          alt={`${movie.title} poster`}
          className="movie-poster-image"
        />
        <p className="modal-release-date">Released: {movie.release_date}</p>
        <p className="modal-runtime">Runtime: {movie.runtime} minutes</p>

        <p className="modal-overview">{movie.overview}</p>
        <p className="modal-genres">Genres: {formatGenreString(movie)}</p>

        <button className="modal-close-button" onClick={handleClose}>X</button>
      </div>
    </div>
  );
}
