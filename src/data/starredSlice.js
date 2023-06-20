import { createSlice } from "@reduxjs/toolkit";

/**
 * Creates slice initial states for starred movies and it's reducers
 */
const starredSlice = createSlice({
  name: "starred",
  initialState: {
    starredMovies: [],
  },
  reducers: {
    /**
     * Updates the state by adding a new movie to the starredMovies array.
     *
     * @param {Object} state - The current state object.
     * @param {Object} action - The Redux action being dispatched.
     * @param {string} action.payload - The movie to be starred.
     */
    starMovie: (state, action) => {
      state.starredMovies = [action.payload, ...state.starredMovies];
    },

    /**
     * Removes a movie from the list of starred movies in the state.
     *
     * @param {object} state - The current state of the application
     * @param {object} action - The action object, which contains the id of the movie to remove
     * @return {void}
     */
    unstarMovie: (state, action) => {
      const indexOfId = state.starredMovies.findIndex(
        (key) => key.id === action.payload.id
      );
      state.starredMovies.splice(indexOfId, 1);
    },

    /**
     * Clears the list of starred movies in the given state.
     *
     * @param {Object} state - The state object containing the starred movies list.
     * @return {void}
     */
    clearAllStarred: (state) => {
      state.starredMovies = [];
    },
  },
});

export default starredSlice;
