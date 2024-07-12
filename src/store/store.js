import { configureStore } from "@reduxjs/toolkit";
import postsSlice from "./postsSlice";

const store = configureStore({
  reducer: {
    postsReducer: postsSlice,
  },
});

export default store;
