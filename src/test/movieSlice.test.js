import moviesSlice, {
  fetchMovies,
  selectPage,
  selectMovies,
  selectFetchStatus,
} from "../data/moviesSlice";
import { configureStore } from "@reduxjs/toolkit";
import { moviesMock } from "./movies.mocks";

describe("moviesSlice", () => {
  let store;

  // Before each case, assign store with movies reducer
  beforeEach(() => {
    store = configureStore({
      reducer: {
        movies: moviesSlice.reducer,
      },
    });
  });

  it("should handle fetchMovies.fulfilled and update the state correctly", async () => {
    const mockResponse = {
      page: 1,
      results: moviesMock,
      total_pages: 1,
    };

    await store.dispatch(fetchMovies.fulfilled(mockResponse));

    // Check store states on fetching mocked movies
    expect(selectFetchStatus(store.getState())).toEqual("success");
    expect(selectMovies(store.getState())).toEqual(moviesMock);
    expect(selectPage(store.getState())).toEqual(1);
    expect(store.getState().movies.nextPage).toBeNull();
  });

  test("should handle fetchMovies.pending and update the fetchStatus to loading", () => {
    store.dispatch(fetchMovies.pending());

    expect(selectFetchStatus(store.getState())).toEqual("loading");
  });

  it("should handle fetchMovies.rejected and update the fetchStatus to error", () => {
    store.dispatch(fetchMovies.rejected());

    expect(selectFetchStatus(store.getState())).toEqual("error");
  });

  it("should handle fetchMovies.fulfilled and append results for next pages", async () => {
     // First 2 movies
    const mockResponsePage1 = {
      page: 1,
      results: moviesMock.slice(0, 2),
      total_pages: 2,
    };

     // Remaining movies
    const mockResponsePage2 = {
      page: 2,
      results: moviesMock.slice(2),
      total_pages: 2,
    };

    // Dispatch the fetchMovies.fulfilled action for page 1
    await store.dispatch(fetchMovies.fulfilled(mockResponsePage1));

    // Dispatch the fetchMovies.fulfilled action for page 2
    await store.dispatch(fetchMovies.fulfilled(mockResponsePage2));

    // Get the updated state
    const state = store.getState().movies;

    // Verify that the movies are appended correctly
    expect(selectMovies(store.getState())).toEqual(moviesMock);
    expect(selectPage(store.getState())).toEqual(2);
    expect(state.nextPage).toBeNull();
  });

  it("should handle fetchMovies.fulfilled and scroll to top for first page", async () => {
    const mockResponse = {
      page: 1,
      results: moviesMock,
      total_pages: 1,
    };

    global.window.scrollTo = jest.fn();

    // Dispatch the fetchMovies.fulfilled action
    await store.dispatch(fetchMovies.fulfilled(mockResponse));

    // Verify that the window.scrollTo triggers to top of the page
    expect(global.window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
