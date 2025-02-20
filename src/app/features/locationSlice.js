import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  location: null,
};


export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    changeLoc: (state, action) => {
      state.location = action.payload;
    },
  },
});


export const { changeLoc } = locationSlice.actions;

export const selectLoc = (state) => state.location.location;

export default locationSlice.reducer;