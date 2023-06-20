import Movie from './Movie';
import { selectMovies  } from '../data/moviesSlice';
import { useSelector } from 'react-redux';
import '../styles/movies.scss';

/**
 * Renders a list of movies using the movies state from the redux store and 
 * a Movie component for each movie. Allows for viewing a trailer of each movie
 * when the 'viewTrailer' function is passed as a prop to the Movie component.
 *
 * @param {function} viewTrailer - A callback function to view a trailer for a given movie.
 * @return {JSX.Element} Movies component.
 */
const Movies = ({ viewTrailer }) => {

    // Get movies updated state from redux store
    const movies = useSelector(selectMovies);

    return (
        <div data-testid="movies" className='movies'>
            {movies?.map((movie) => {
                return (
                    <Movie 
                        movie={movie} 
                        key={movie.id}
                        viewTrailer={viewTrailer}
                    />
                )
            })}
        </div>
    )
}

export default Movies
