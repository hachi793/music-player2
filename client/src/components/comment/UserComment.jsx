import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "../../context/stateProvider";
import { getCommentsByUserId } from "../../api";

const UserComment = ({ userData }) => {
  const [comments, setComments] = useState([]);
  const [{ allSongs }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const fetchCommentsByUserId = async (id) => {
    const comments = await getCommentsByUserId(id);
    setComments(comments);
  };

  useEffect(() => {
    fetchCommentsByUserId(userData._id);
  }, [userData._id, dispatch]);

  return (
    <div className="m-3 p-3" style={{ background: "#252525" }}>
      <p className="small-text">All comments of {userData.name} :</p>
      <div className="comments-section mx-3">
        {comments &&
          comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((comment) => {
              return (
                <div key={comment._id} className="comment-item my-3">
                  <div className="d-flex gap-3 align-items-center">
                    <img
                      src={comment.songId.imageURL}
                      style={{
                        borderRadius: "50%",
                        width: "3rem",
                        height: "3rem",
                      }}
                      alt=""
                    />
                    <div>
                      <p className="small-text d-flex">
                        <div
                          className="details-link"
                          onClick={() =>
                            navigate(`/songDetails/${comment.songId._id}`)
                          }
                        >
                          {comment.songId.name}
                        </div>
                        <p className="small-text ms-3">
                          {moment(new Date(comment.createdAt)).format(
                            "YYYY-MM-DD"
                          )}
                        </p>
                      </p>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default UserComment;
