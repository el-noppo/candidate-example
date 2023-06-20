import React from "react";
import { Provider } from "react-redux";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import store from "./data/store";
import { moviesMock } from "./test/movies.mocks";

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
  }

  observe() {
    this.callback([{ isIntersecting: true }]);
  }

  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver;

describe("App", () => {
  it("app renders movies and nav-starred routes and components", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Check movies is present in the document
    const movies = screen.getByTestId("movies");
    expect(movies).toBeInTheDocument();

    // Check nav-starred si present in the document
    const navStarred = screen.getByTestId("nav-starred");
    expect(navStarred).toBeInTheDocument();
  });

  xit("view trailer with trailer found", async () => {

    // Fetch mocked movies
    const mockFetch = moviesMock.mockFetch;
    global.fetch = mockFetch;

    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Fire the click to view trailer
    fireEvent.click(await screen.findByText(moviesMock[0].title));

    // Shows the trailer in the youtube player
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    const youtubePlayer = screen.getByTestId("youtube-player");
    expect(youtubePlayer).toBeInTheDocument();
  });

  it("renders header component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Check that header is present in the document
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });
});
