import { configureStore } from "@reduxjs/toolkit"
import moviesSlice from './moviesSlice'
import starredSlice from './starredSlice'
import watchLaterSlice from './watchLaterSlice'

/**
 * Configures a store for the reducer in order to keep the state
 */
const store = configureStore({
    reducer: {
        movies: moviesSlice.reducer,
        starred: starredSlice.reducer,
        watchLater: watchLaterSlice.reducer
    },
});

export default store;
