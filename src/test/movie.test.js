import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./utils";
import App from "../App";

describe("Movie", () => {
  let observer;

  beforeEach(() => {
    observer = jest.fn(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
    window.IntersectionObserver = observer;
    window.scrollTo = jest.fn();
  });

  xit("stars and saves to watch later", async () => {
    renderWithProviders(<App />);

    // Get the search input element and click on it to focus
    const searchInput = screen.getByTestId("search-movies");
    fireEvent.click(searchInput);

    // Enter "forrest gump" as the search query
    fireEvent.change(searchInput, { target: { value: "forrest gump" } });

    // Check that the movie title "Through the Eyes of Forrest Gump" appears in the search results
    const movieTitle = await screen.findByText(
      "Through the Eyes of Forrest Gump"
    );
    expect(movieTitle).toBeInTheDocument();

    // Click on the "starred" link to favorite the movie
    const starLink = screen.getAllByTestId("starred-link")[0];
    fireEvent.click(starLink);

    // Check that the star fill icon appears
    const starFill = await screen.findByTestId("star-fill");
    expect(starFill).toBeInTheDocument();

    // Check that the "unstar" link appears
    const unstarLink = await screen.findByTestId("unstar-link");
    expect(unstarLink).toBeInTheDocument();

    // Click on the "watch later" button to add the movie to the watch later list
    const watchLaterLink = screen.getAllByTestId("watch-later")[0];
    fireEvent.click(watchLaterLink);

    // Check that the "remove from watch later" button appears
    const removeWatchLaterLink = await screen.findByTestId(
      "remove-watch-later"
    );
    expect(removeWatchLaterLink).toBeInTheDocument();

    // Click on the "remove from watch later" button to remove the movie from the watch later list
    fireEvent.click(removeWatchLaterLink);

    // Check that the "remove from watch later" button is no longer in the document
    expect(removeWatchLaterLink).not.toBeInTheDocument();
  });
});
