import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import watchLaterSlice from '../data/watchLaterSlice';
import WatchLater from '../components/WatchLater';
import { moviesMock } from './movies.mocks';

jest.mock('react-redux');

describe('WatchLater', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        watchLater: {
          watchLaterMovies: moviesMock,
        },
      })
    );
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the watch later movies', () => {
    render(
      <Router>
        <WatchLater />
      </Router>
    );
    
    // Check if the watch later movies element is rendered
    const watchLaterMoviesElement = screen.getByTestId('watch-later-movies');
    expect(watchLaterMoviesElement).toBeInTheDocument();
  });

  it('calls removeAllWatchLater action when clicking on Empty list button', () => {
    render(
      <Router>
        <WatchLater />
      </Router>
    );
    
    // Click on the empty list button
    const emptyListButton = screen.getByText('Empty list');
    fireEvent.click(emptyListButton);
    
    // Check if the removeAllWatchLater action is called
    expect(mockDispatch).toHaveBeenCalledWith(watchLaterSlice.actions.removeAllWatchLater());
  });

  it('renders a message and link when there are no watch later movies', () => {
    useSelector.mockImplementation((selectorFn) =>
      selectorFn({
        watchLater: {
          watchLaterMovies: [],
        },
      })
    );
    
    render(
      <Router>
        <WatchLater />
      </Router>
    );
    
    // Check if the empty cart message and home link are rendered
    const emptyCartElement = screen.getByText('You have no movies saved to watch later.');
    const homeLink = screen.getByText('Home');
    
    expect(emptyCartElement).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute('href')).toBe('/');
  });
  
  it('calls removeFromWatchLater action when clicking on the remove watch later button', () => {
    render(
      <Router>
        <WatchLater />
      </Router>
    );
  
    // Click on the remove watch later buttons for each movie
    const removeButtons = screen.getAllByTestId('remove-watch-later');
    removeButtons.forEach((button) => {
      fireEvent.click(button);
    });
  
    // Check if the removeFromWatchLater action is called for each movie
    expect(mockDispatch).toHaveBeenCalledTimes(moviesMock.length);
    moviesMock.forEach((movie) => {
      expect(mockDispatch).toHaveBeenCalledWith(watchLaterSlice.actions.removeFromWatchLater(movie));
    });
  });
});
