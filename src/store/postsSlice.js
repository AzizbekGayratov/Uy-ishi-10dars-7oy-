import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
  },
  reducers: {
    fetchPosts(state, action) {
      state.posts = action.payload;
    },
    addPost(state, action) {
      state.posts.push(action.payload);
    },
    removePost(state, action) {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    clearAllPosts(state) {
      state.posts = [];
    },
    editPost(state, action) {
      state.posts = state.posts.map((post) => {
        if (post.id === action.payload.id) {
          return action.payload;
        }
        return post;
      });
    },
  },
});

export const { fetchPosts, addPost, removePost, clearAllPosts, editPost } =
  postsSlice.actions;
export default postsSlice.reducer;
