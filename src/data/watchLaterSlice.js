import { createSlice } from "@reduxjs/toolkit";

/**
 * Creates slice initial states for watch later movies and it's reducers
 */
const watchLaterSlice = createSlice({
  name: "watch-later",
  initialState: {
    watchLaterMovies: [],
  },
  reducers: {
    /**
     * Adds a movie to the user's watch later list.
     *
     * @param {object} state - The current state of the application.
     * @param {object} action - The action object containing the movie to be added.
     * @param {object} action.payload - The movie object to be added to the watch later list.
     */
    addToWatchLater: (state, action) => {
      state.watchLaterMovies = [action.payload, ...state.watchLaterMovies];
    },

    /**
     * Removes a movie from the watch later list in the Redux state.
     *
     * @param {object} state - The current Redux state.
     * @param {object} action - The Redux action containing the movie ID to remove.
     */
    removeFromWatchLater: (state, action) => {
      const indexOfId = state.watchLaterMovies.findIndex(
        (key) => key.id === action.payload.id
      );
      state.watchLaterMovies.splice(indexOfId, 1);
    },

    /**
     * Removes all movies from the watch later list.
     *
     * @param {object} state - The current state object.
     */
    removeAllWatchLater: (state) => {
      state.watchLaterMovies = [];
    },
  },
});

export default watchLaterSlice;
