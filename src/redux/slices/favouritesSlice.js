import { createSlice } from "@reduxjs/toolkit";

const getInitialFavourites = () => {
  const saved = localStorage.getItem("favourites");
  return saved ? JSON.parse(saved) : [];
};

const initialState = {
  items: getInitialFavourites(), 
};

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    setFavourites: (state, action) => {
      state.items = action.payload;
      localStorage.setItem("favourites", JSON.stringify(state.items));
    },
    addToFavourites: (state, action) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        localStorage.setItem("favourites", JSON.stringify(state.items));
      }
    },
    removeFromFavourites: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("favourites", JSON.stringify(state.items));
    },
  },
});

export const { setFavourites, addToFavourites, removeFromFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;