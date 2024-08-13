import moment from "moment";
import React, { useEffect, useState } from "react";
import { useStateValue } from "../../context/stateProvider";
import {
  deleteCommentsById,
  getCommentsBySongId,
  saveNewComment,
} from "../../api";

const SongComment = ({ song }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [{ user, allUsers }, dispatch] = useStateValue();

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

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await deleteCommentsById(commentId);
      if (res.success) {
        const updatedComments = comments.filter(
          (comment) => comment._id !== commentId
        );
        setComments(updatedComments);
      } else {
        console.error("Failed to delete comment: ", res.msg);
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };
  const findUserById = (userId) => {
    const user = allUsers.find((user) => user._id === userId);
    return user ? user : null;
  };

  return (
    <section
      className="comment m-3 p-2 border-5"
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
            .map((comment) => {
              const commentUser = findUserById(comment.userId);
              return (
                <div key={comment._id} className="comment-item my-3">
                  {commentUser && (
                    <div className="d-flex gap-3 align-items-center position-relative">
                      <img
                        src={commentUser.profileImagePath}
                        style={{
                          borderRadius: "50%",
                          width: "3rem",
                          height: "3rem",
                        }}
                        alt=""
                      />
                      <div>
                        <p className="small-text">
                          {commentUser.name}
                          <span className="small-text ms-3">
                            {moment(new Date(comment.createdAt)).format(
                              "YYYY-MM-DD"
                            )}
                          </span>
                        </p>
                        <p>{comment.content}</p>
                      </div>
                      {/* Delete comment option */}
                      {/* {commentUser._id === user._id && (
                    <div className="delete-menu position-relative">
                      <p>Delete</p>
                      <p>Cancel</p>
                    </div>
                  )} */}
                    </div>
                  )}
                </div>
              );
            })}
      </div>
    </section>
  );
};

export default SongComment;
