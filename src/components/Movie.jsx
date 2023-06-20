import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import starredSlice from "../data/starredSlice";
import watchLaterSlice from "../data/watchLaterSlice";
import cn from "classnames";
import {posterBaseUrl} from '../constants';
import placeholder from "../assets/not-found-500X750.jpeg";

/**
 * Renders the movie component with Redux state changes.
 *
 * @param {object} props - Object containing movie and viewTrailer function
 * @param {object} props.movie - Object containing movie information
 * @param {function} props.viewTrailer - Callback Function to view movie trailer
 * @return {JSX.Element} Movie component
 */
const Movie = ({ movie, viewTrailer }) => {
  const [ isOpened, setIsOpened ] = useState(false);

  // Redux actions to perform state changes
  const state = useSelector((state) => state);
  const { starred, watchLater } = state;
  const { starMovie, unstarMovie } = starredSlice.actions;
  const { addToWatchLater, removeFromWatchLater } = watchLaterSlice.actions;

  // Updates state in redux
  const dispatch = useDispatch();

  /**
   * Handles the click event for the button element.
   *
   * @param {Event} e - The click event object.
   * @return {void}
   */
  const myClickHandler = (e) => {
    // Removed: e.cancelBubble = true; -> this is just of IE11, use stopPropagation instead
    e.stopPropagation();
    setIsOpened(false);
  };

    /**
   * Returns an object with selected properties from the given movie object.
   *
   * @param {object} movie - The movie object to extract properties from.
   * @return {object} movie with required properties
   */
  const getMovie = (movie) => ({
    id: movie.id,
    overview: movie.overview,
    release_date: movie.release_date?.substring(0, 4),
    poster_path: movie.poster_path,
  });

  return (
    <div
      className={cn("card col-6 col-xs-6 col-sm-6 col-md-6 col-lg-3 col-xl-2", {
        opened: isOpened,
      })}
      onClick={() => setIsOpened(true)}
    >
      <div className="card-body text-center">
        <div className="overlay" />
        <div className="info-panel">
          <div className="overview">{movie.overview}</div>
          <div className="year">{movie.release_date?.substring(0, 4)}</div>
          {!starred?.starredMovies
            .map((movie) => movie.id)
            .includes(movie.id) ? (
            <span
              className="btn-star"
              data-testid="starred-link"
              onClick={() =>
                dispatch(
                  starMovie(getMovie(movie))
                )
              }
            >
              <i className="bi bi-star" />
            </span>
          ) : (
            <span
              className="btn-star"
              data-testid="unstar-link"
              onClick={() => dispatch(unstarMovie(movie))}
            >
              <i className="bi bi-star-fill" data-testid="star-fill" />
            </span>
          )}
          {!watchLater.watchLaterMovies
            .map((movie) => movie.id)
            .includes(movie.id) ? (
            <button
              type="button"
              data-testid="watch-later"
              className="btn btn-light btn-watch-later"
              onClick={() =>
                dispatch(
                  addToWatchLater(getMovie(movie))
                )
              }
            >
              Watch Later
            </button>
          ) : (
            <button
              type="button"
              data-testid="remove-watch-later"
              className="btn btn-light btn-watch-later blue"
              onClick={() => dispatch(removeFromWatchLater(movie))}
            >
              <i className="bi bi-check"></i>
            </button>
          )}
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => viewTrailer(movie)}
          >
            View Trailer
          </button>
        </div>
        <img
          className="center-block"
          src={
            movie.poster_path
              ? `${posterBaseUrl}${movie.poster_path}`
              : placeholder
          }
          alt="Movie poster"
        />
      </div>
      <h6 className="title mobile-card">{movie.title}</h6>
      <h6 className="title">{movie.title}</h6>
      <button
        type="button"
        className="close"
        onClick={(e) => myClickHandler(e)}
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};

export default Movie;
