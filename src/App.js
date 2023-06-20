import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import { ENDPOINT, API_KEY } from "./constants";
import Header from "./components/Header";
import Movies from "./components/Movies";
import Starred from "./components/Starred";
import WatchLater from "./components/WatchLater";
import YouTubePlayer from "./components/YoutubePlayer";
import "./app.scss";

/**
 * Main React component that renders a movie app with a trailer player.
 *
 * @return {JSX.Element} - The rendered React component.
 */
const App = () => {

  // Handle local states
  const [videoKey, setVideoKey] = useState(null);
  const [isOpen, setOpen] = useState(false);

  /**
   * Asynchronously views the trailer of a given movie.
   *
   * @param {Object} movie - the movie object containing an id
   * @return {Promise<void>} - a promise that resolves when the trailer is viewed
   */
  const viewTrailer = async (movie) => {
    await getMovie(movie.id);
    setOpen(true);
  };

  /**
   * Asynchronously fetches movie data from an API, sets a video key if a trailer is found.
   *
   * @param {number} id - The ID of the movie to fetch.
   * @return {void}
   */
  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const response = await fetch(URL);
    const videoData = await response.json();

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(
        (vid) => vid.type === "Trailer"
      );
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  };

  return (
    <div className="App">
      <Header />

      <div className="container">
        {isOpen && <YouTubePlayer videoKey={videoKey} setOpen={setOpen} />}
        <Routes>
          <Route path="/" element={<Movies viewTrailer={viewTrailer} />} />
          <Route
            path="/starred"
            element={<Starred viewTrailer={viewTrailer} />}
          />
          <Route
            path="/watch-later"
            element={<WatchLater viewTrailer={viewTrailer} />}
          />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
