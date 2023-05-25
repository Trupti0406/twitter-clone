import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import { useTweetContext } from "../context/tweetContext";

const CreateCommentModal = ({ reloadSingleTweet, setReloadSingleTweet }) => {
  const { tweetToAddACommentOn, getAllTweets, getSingleUserDetails } =
    useTweetContext();
  const [comment, setComment] = useState();
  const [auth, setAuth] = useAuth();
  const [singleTweet, setSingleTweet] = useState();

  const navigate = useNavigate();
  const id = useParams();

  useEffect(() => {
    getAllTweets();
  }, [reloadSingleTweet]);

  const commentRequest = async () => {
    const tweetComment = {
      content: comment,
      commentedBy: auth?.user?.userId,
    };

    const { data } = await axios.put(
      `/tweet/createComment/${tweetToAddACommentOn}`,
      tweetComment
    );

    if (data?.error) {
      toast.error(data?.error);
    } else {
      getSingleUserDetails(); //updating
      setReloadSingleTweet(!reloadSingleTweet);
      toast.success("Comment added Successfully");

      // getSingleTweetDetails()
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal2"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Tweet your reply
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="new-tweet"
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your reply here"
                cols="60"
                rows="5"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary tweet-btn-2"
                data-bs-dismiss="modal"
                onClick={() => commentRequest()}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Tweet Your Status
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="new-tweet"
                name="content"
                id=""
                cols="45"
                rows="5"
                placeholder="Add your reply"
                value=""
              ></textarea>
            </div>
            <div className="upload-image-div">
              <i className="fa-regular fa-image"></i>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() =>
                  commentRequest(
                    tweetToAddACommentOn
                  )
                }
                className="btn btn-primary tweet-btn-2"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default CreateCommentModal;
