import { configureStore } from '@reduxjs/toolkit';
import framesSlice from '../slices/framesSlice';

const store = configureStore({
    reducer: {
        [framesSlice.reducerPath]: framesSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
