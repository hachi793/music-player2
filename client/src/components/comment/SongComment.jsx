import moment from "moment";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../../context/stateProvider";
import {
  deleteCommentsById,
  getCommentsBySongId,
  saveNewComment,
} from "../../api";
import { FaPen } from "react-icons/fa";

const SongComment = ({ song }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [{ user }, dispatch] = useStateValue();
  const [deleteMenu, setDeleteMenu] = useState(false);

  const fetchComments = async (id) => {
    const comments = await getCommentsBySongId(id);
    setComments(comments);
  };
  useEffect(() => {
    fetchComments(song._id);
  }, [song._id, dispatch]);

  const saveComment = async () => {
    const data = {
      userId: user._id,
      songId: song._id,
      content: content,
    };
    if (user._id && song._id && content) {
      saveNewComment(data)
        .then((res) => {
          if (res) {
            getCommentsBySongId(song._id).then((comment) => {
              if (comment) {
                setComments(...comments, comment);
              } else {
                console.error("Failed to fetch comments of song");
              }
            });
          } else {
            console.error("Failed to save new comments");
          }
        })
        .finally(() => {
          setContent("");
          fetchComments(song._id);
        });
    } else {
      console.error("Required fields are missing");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveComment();
    }
  };

  const handleDeleteComment = async (data) => {
    try {
      const res = await deleteCommentsById(data._id);
      if (res.success) {
        const updatedComments = comments.filter(
          (comment) => comment._id !== data._id
        );
        setComments(updatedComments);
        setDeleteMenu(false);
      } else {
        console.error("Failed to delete comment: ", res.msg);
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  return (
    <section
      className="comment mx-3 my-5 p-2 border-5"
      style={{ background: "#252525" }}
    >
      <div className="d-flex gap-3 align-items-center">
        <img
          src={user.profileImagePath}
          style={{
            borderRadius: "50%",
            width: "3rem",
            height: "3rem",
          }}
          alt=""
        />
        <div className="input-comment d-flex justify-content-between py-2">
          <input
            className=" px-2 pt-2 text-light w-100"
            type="text"
            placeholder="Write down your comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="py-1 text-light fw-lighter" onClick={saveComment}>
            Comment
          </button>
        </div>
      </div>

      <div className="comments-section">
        {comments &&
          comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((comment) => (
              <div key={comment._id} className="comment-item my-3">
                {comment.userId && (
                  <div className="d-flex gap-3 align-items-center position-relative">
                    <img
                      src={comment.userId.profileImagePath}
                      style={{
                        borderRadius: "50%",
                        width: "3rem",
                        height: "3rem",
                      }}
                      alt=""
                    />
                    <div>
                      <p className="small-text d-flex gap-3 align-items-center">
                        {comment.userId.name}
                        <span className="small-text">
                          {moment(new Date(comment.createdAt)).format(
                            "YYYY-MM-DD"
                          )}
                        </span>
                        {comment.userId._id === user._id && (
                          <FaPen onClick={() => setDeleteMenu(true)} />
                        )}
                      </p>
                      <p>{comment.content}</p>
                    </div>
                    {/* Delete comment option */}
                    {deleteMenu && comment.userId._id === user._id && (
                      <div
                        className="delete-menu position-absolute w-25 py-2 px-3 d-flex flex-column justify-content-center align-items-center gap-2"
                        style={{
                          right: "0%",
                          top: "10%",
                          borderRadius: "5px",
                          transition: "0.5s ease-in-out",
                        }}
                      >
                        <p
                          className="py-1 px-2 w-100 text-center bg-danger"
                          style={{
                            borderRadius: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleDeleteComment(comment)}
                        >
                          Delete
                        </p>
                        <p
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => setDeleteMenu(false)}
                        >
                          Cancel
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
      </div>
    </section>
  );
};

export default SongComment;
