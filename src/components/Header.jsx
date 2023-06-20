import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import useInfiniteScroll from "../hooks/infinite-scroll";
import { fetchMovies, selectPage } from "../data/moviesSlice";
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER } from "../constants";
import "../styles/header.scss";

/**
 * Renders the header component which provides search functionality and navigation to other routes.
 *
 * @returns {JSX.Element} The header component with search bar and navigation links.
 */
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get params from URI
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  // Uses page and starredMovies selector from redux store in order to get their states
  const { starredMovies } = useSelector((state) => state.starred);
  const page = useSelector(selectPage);

  /**
   * Fetches search results from the server based on the given query and page number.
   *
   * @param {string} query - The search query to be used.
   * @param {number} page - The page number to be fetched.
   * @return {void}
   */
  const getSearchResults = (query, page) => {
    if (query !== "" && query !== null) {
      dispatch(
        fetchMovies(
          `${ENDPOINT_SEARCH}&query=${query || searchQuery}&page=${page || 1}`
        )
      );
      setSearchParams({ search: query || searchQuery });
    } else {
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${page || 1}`));
      setSearchParams();
    }
  };

  /**
   * Navigates to home route
   * @returns {void}
   */
  const goToHome = () => navigate("/");

  /**
   * Loads more movies by requesting search results for the next page.
   *
   * @return {void} This function does not return a value.
   */
  const loadMoreMovies = () => {
    const nextPage = page + 1;
    getSearchResults(searchQuery, nextPage);
  };

  // Loads the custom useInfiniteScroll hook
  useInfiniteScroll(loadMoreMovies);

  /**
   * Fetch movies on first page load
   *
   * @todo This method is being called twice caused by React.StrictMode
   */
  useEffect(() => {
    getSearchResults(searchQuery || "");
  }, []);

  return (
    <header>
      <Link to="/" data-testid="home" onClick={goToHome}>
        <i className="bi bi-film" />
      </Link>

      <nav>
        <NavLink
          to="/starred"
          data-testid="nav-starred"
          className="nav-starred"
        >
          {starredMovies.length > 0 ? (
            <>
              <i className="bi bi-star-fill bi-star-fill-white" />
              <sup className="star-number">{starredMovies.length}</sup>
            </>
          ) : (
            <i className="bi bi-star" />
          )}
        </NavLink>
        <NavLink to="/watch-later" className="nav-fav">
          watch later
        </NavLink>
      </nav>

      <div className="input-group rounded">
        <Link to="/" onClick={goToHome} className="search-link">
          <input
            type="search"
            data-testid="search-movies"
            onKeyUp={(e) => getSearchResults(e.target.value)}
            className="form-control rounded"
            placeholder="Search movies..."
            aria-label="Search movies"
            aria-describedby="search-addon"
            onClick={goToHome}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
