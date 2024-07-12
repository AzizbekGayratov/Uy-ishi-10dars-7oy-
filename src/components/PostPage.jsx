import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/posts";
import { editPost } from "../store/postsSlice";
import toast from "react-hot-toast";

import { useDispatch } from "react-redux";

const PostPage = ({ posts, handleDelete }) => {
  const { id } = useParams();
  const data = posts.find((post) => post.id.toString() === id);

  // Bu kodlarni har safar refresh qilganimda state undefined bolib qolayvergani uchun yozdim
  const post = data || localStorage.getItem("loggedPostForApp");

  useEffect(() => {
    localStorage.setItem("loggedPostForApp", JSON.stringify(data));
  }, []);
  // ==================

  const dispatch = useDispatch();

  const [editProgress, setEditProgress] = useState(false);

  const [error, setError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(post.title);
  const [newBody, setNewBody] = useState(post.body);

  const navigate = useNavigate();

  const handleEdit = async (id) => {
    setError(null);
    try {
      setEditProgress(true);

      await api.patch(`/posts/${id}`, {
        title: newTitle,
        body: newBody,
      });
      setIsEdit(false);

      dispatch(
        editPost({
          ...post,
          title: newTitle,
          body: newBody,
        })
      );
      navigate("/");
      toast.success("Post edited");
    } catch (error) {
      setError(error.message);
    } finally {
      setEditProgress(false);
    }
  };

  return (
    <main className="PostPage">
      <article className="post">
        {error && <p className="error">{error}</p>}
        {post && (
          <>
            {isEdit ? (
              <>
                <form className="editForm">
                  <input
                    id="editTitle"
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <textarea
                    id="editBody"
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                  ></textarea>
                  <p className="postDate">{post.datetime}</p>
                </form>
              </>
            ) : (
              <>
                <h2>{post.title}</h2>
                <p className="postDate">{post.datetime}</p>
                <p className="postBody">{post.body}</p>
              </>
            )}
            <div className="btnBox">
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      handleDelete(post.id);
                    }
                  });
                }}
              >
                Delete Post
              </button>
              <button
                style={{ backgroundColor: "transparent", color: "#000" }}
                onClick={() => {
                  if (isEdit) {
                    Swal.fire({
                      title: "Are you sure?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, save it!",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        handleEdit(post.id);
                      }
                    });
                  } else {
                    setIsEdit(!isEdit);
                  }
                }}
              >
                {isEdit ? "Save" : "Edit"}
                {editProgress && " ..."}
              </button>
              <button
                className="backButton"
                style={{ backgroundColor: "transparent", color: "#000" }}
                onClick={() => {
                  if (isEdit) {
                    setIsEdit(!isEdit);
                  } else {
                    navigate(-1);
                  }
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {!post && (
          <>
            <h2>Post Not Found</h2>
            <p>Well, that's disappointing.</p>
            <p>
              <Link to="/">Visit Our Homepage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;
