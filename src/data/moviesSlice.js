import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/**
 * Asynchronously fetches movies from given apiUrl
 */
export const fetchMovies = createAsyncThunk("fetch-movies", async (apiUrl) => {
  const response = await fetch(apiUrl);
  return response.json();
});
/**
 * Creates slice initial states for movies and it's reducers
 */
const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    fetchStatus: "",
    page: 1,
    nextPage: null,
  },
  reducers: {},

  /**
   * Defines extra reducers for the fetchMovies slice case reducers.
   *
   * @param {object} builder - An instance of ReducerBuilder from @reduxjs/toolkit
   * @return {void}
   */
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          // Handle the case when the payload is an array of movies directly
          state.movies = action.payload;
          state.fetchStatus = "success";
          state.page = 1;
          state.nextPage = null;
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (action.payload.results && Array.isArray(action.payload.results)) {
          // Handle the case when the payload has nested 'results' property
          state.fetchStatus = "success";
          state.movies =
            action.payload.page === 1
              ? action.payload.results
              : [...state.movies, ...action.payload.results];
          if (action.payload.page === 1) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          state.page = action.payload.page;
          state.nextPage =
            action.payload.page < action.payload.total_pages
              ? action.payload.page + 1
              : null;
        } else {
          // Handle unexpected payload structure
          state.fetchStatus = "error";
        }
      })
      .addCase(fetchMovies.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.fetchStatus = "error";
      });
  },
});

// Export selectors to get access to their states within the redux store state
export const selectPage = (state) => state.movies.page;

export const selectMovies = (state) => state.movies.movies;

export const selectFetchStatus = (state) => state.movies.fetchStatus;

export default moviesSlice;
