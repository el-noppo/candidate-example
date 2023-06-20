import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectFetchStatus } from "../data/moviesSlice";
import { selectMovies } from "../data/moviesSlice";

/**
 * A custom React hook that implements infinite scroll functionality to fetch more movies when the user reaches the
 * bottom of the page. It uses IntersectionObserver API to detect if the last movie element is visible in the viewport
 * to allow fetching more movies.
 *
 * @param {function} loadMoreMovies - A callback function that fetches more movies from the server.
 * @return {boolean} Returns a boolean flag that indicates if the component is currently fetching more movies or not.
 */
const useInfiniteScroll = (loadMoreMovies) => {

  // Switch between fetching status flag in order to fetch more movies or not
  const [isFetching, setIsFetching] = useState(false);

  // Use selectors from redux store in order to get their states
  const fetchingStatus = useSelector(selectFetchStatus);
  const movies = useSelector(selectMovies);

  /**
   * Handles the scroll event to fetch more movies when the user reaches the bottom of the page.
   *
   * @return {void}
   */
  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const threshold = scrollHeight - clientHeight * 0.8;

    // Check if element reaches the required point (inside viewport) to allow fetching more movies
    if (!isFetching && scrollTop > threshold) {
      setIsFetching(true);
    }
  };

  useEffect(() => {
    /**
     * Handles the intersection of a target element with the viewport and sets isFetching state to true if the target
     * is intersecting and isFetching state is false otherwise.
     *
     * @param {IntersectionObserverEntry[]} entries - Array of intersection observer entries.
     * @return {void} Returns nothing.
     */
    const handleIntersection = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !isFetching) {
        setIsFetching(true);
      }
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    };

    // Use observer to check and get current status of element to observe
    // In this case it will be the last movie (check when it reaches to viewport)
    const observer = new IntersectionObserver(handleIntersection, options);
    const targetElement = document.querySelector(".card:last-child");

    // If the target exists, observe it
    if (targetElement) {
      observer.observe(targetElement);
    }

    /**
     * Disconnects from observer to prevent observing multiple observers
     */
    return () => {
      observer.disconnect();
    };
  }, [movies, document.querySelector(".card:last-child")]);

  /**
   * Load more movies when fetching is allowed
   */
  useEffect(() => {
    if (!isFetching) return;
    loadMoreMovies();
  }, [isFetching]);

  /**
   * Handle fetching status in order to prevent from fetching more while is waiting for server response
   */
  useEffect(() => {
    if (fetchingStatus === "success" || fetchingStatus === "error") {
      setIsFetching(false);
    }
  }, [fetchingStatus]);

  /**
   * Subscribe to scroll and un-subscribe to it in order to prevent multiple subscriptions
   *
   * Listen to scroll behavior
   */
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isFetching;
};

export default useInfiniteScroll;
