import { formatPosterPath, formatGenreString} from "../utils/utils"
// import Embeddded Video
import "../styles/MovieModal.css"

export default function MovieModal({ movie, isOpen, setShowModal, setModalMovieId, setMovieDetails}) {
  if (!isOpen || movie === null || movie === undefined) {
    return null;
  }


  const handleClose = () => {
    setModalMovieId(null);
    setShowModal(false);
    setMovieDetails(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal') {
      handleClose();
    }
  };

  return (
    <div className="modal" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2 className="modal-movie-title">{movie.title}</h2>
        <img
          src={formatPosterPath(movie.backdrop_path)}
          alt={`${movie.title} poster`}
          className="movie-poster-image"
        />
        <p className="modal-release-date">Released: {movie.release_date}</p>
        <p className="modal-runtime">Runtime: {movie.runtime } minutes</p>
        <p className="modal-overview">{movie.overview}</p>
        <p className="modal-genres">Genres: {formatGenreString(movie, movie.genres)}</p>
        <div className="modal-trailer-container">
          <iframe className="modal-trailer" width="420" height="315"
            src={`https://www.youtube.com/embed/${movie.video}`}>
            </iframe>
        </div>
        <button className="modal-close-button" onClick={handleClose}>X</button>
      </div>
    </div>
  );
}
