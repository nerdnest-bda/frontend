import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import locationReducer from './features/locationSlice'
import currentUniversityReducer from './features/currentUniversitySlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    location: locationReducer,
    currentUniversity: currentUniversityReducer
  },
});