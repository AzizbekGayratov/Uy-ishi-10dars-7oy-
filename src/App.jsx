import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchPosts,
  addPost,
  removePost,
  clearAllPosts,
} from "./store/postsSlice";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import api from "./api/posts";

function App() {
  const posts = useSelector((store) => store.postsReducer.posts);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/posts");
        dispatch(fetchPosts(response.data));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const submitNewPost = async (newPost) => {
    setError(null);
    try {
      await api.post("/posts", newPost);
      dispatch(addPost(newPost));

      navigate("/");
      toast.success("Post added");
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;
    console.log(id);
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };

    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    }).then((result) => {
      if (result.isConfirmed) {
        submitNewPost(newPost);
        setPostTitle("");
        setPostBody("");
      }
    });
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await api.delete(`/posts/${id}`);
      dispatch(removePost(id));
      toast.success("Post deleted");
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClearAll = () => {
    try {
      posts.forEach(async (post) => {
        await api.delete(`/posts/${post.id}`);
      });
      dispatch(clearAllPosts());
      toast.success("All posts deleted");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="App">
      <Toaster position="top-right" />
      <Header title="React JS Blog" />
      <Nav search={search} setSearch={setSearch} />
      {error && <p className="error">{error}</p>}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onLoad={isLoading}
              clearAll={handleClearAll}
              posts={searchResults}
            />
          }
        />
        <Route
          path="/post"
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />
        <Route
          path="/post/:id"
          element={<PostPage posts={posts} handleDelete={handleDelete} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="*" component={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
