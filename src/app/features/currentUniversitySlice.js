import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUniversity: null,
};


export const currentUniversitySlice = createSlice({
  name: 'currentUniversity',
  initialState,
  reducers: {
    changeCurrentUniversity: (state, action) => {
      state.currentUniversity = action.payload;
    },
  },
});


export const { changeCurrentUniversity } = currentUniversitySlice.actions;

export const selectCurrentUniversity = (state) => state.currentUniversity.currentUniversity;

export default currentUniversitySlice.reducer;