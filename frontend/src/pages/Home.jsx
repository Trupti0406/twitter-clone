import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import { useTweetContext } from "../context/tweetContext";
import CreateCommentModal from "../Modal/Comment";
import CreateTweetModal from "../Modal/CreateTweet";
import moment from "moment";
const Home = () => {
  const [auth, setAuth] = useAuth();

  const { setTweetToAddACommentOn, tweetToAddACommentOn } = useTweetContext();
  const [reloadSingleTweet, setReloadSingleTweet] = useState(false);

  const { allTweets, getAllTweets } = useTweetContext();

  const navigate = useNavigate();

  const retweetRequest = async (id) => {
    const { data } = await axios.post(`/tweet/createReTweet/${id}`);
    if (data?.error) {
      toast.error(data?.error);
    } else if (data?.createNewTweetAsRetweet) {
      toast.success("retweeted Successfully");
    }
    getAllTweets();
  };

  const deleteRequest = async (id) => {
    const { data } = await axios.delete(`/tweet/deleteTweet/${id}`);

    if (data?.error) {
      toast.error(data?.error);
    } else {
      if (data?.deletedReplies) {
        toast.success(`Tweet deleted successfully along with all the replies)`);
      }
      toast.success("Tweet Deleted Successfully");
      getAllTweets();
    }
  };

  const showSingleTweet = (id) => {
    navigate(`/tweet/${id}`);
  };

  const fetchDetailsOfTweetToCommentOn = async (IDOftweetToCommentOn) => {
    setTweetToAddACommentOn(IDOftweetToCommentOn);
    const { data } = await axios.get(
      `/tweet/getSingleTweet/${IDOftweetToCommentOn}`
    );
  };
  console.log(tweetToAddACommentOn, "from fetch tweet details in home.js");

  const fetchUserDetails = async (userId) => {
    navigate(`/profile/${userId}`);
  };

  const likeRequest = async (id) => {
    const { data } = await axios.put(`/tweet/LikeDislike/${id}`);

    if (data?.error) {
      toast.error(data?.error);
    } else {
      if (data?.like) {
        toast.info("Tweet Liked Successfully");
      }

      if (!data?.like) {
        toast.info("Tweet Unliked Successfully");
      }
      getAllTweets();
    }
  };

  useEffect(() => {
    getAllTweets();
  }, []);
  return (
    <>
      <div className="container-fluid overflow-hidden bg-primary-subtle">
        <div className="vh-100 vw-75 row overflow-auto">
          <div className="col d-flex flex-column h-sm-100">
            <nav className="top-0 navbar d-flex justify-content-between">
              <h2>Explore</h2>
              <button
                type="button"
                className="btn btn-primary mb-0 h1 fw-bold px-5 py-2"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Tweet
              </button>
            </nav>

            {allTweets.length === 0 && (
              <h1 className="text-center">No tweets available !</h1>
            )}

            {allTweets &&
              allTweets.map((singleTweet, index) => {
                if (index === 1) {
                  // console.log(singleTweet)
                }
                /*  All the replies of this tweets would be available on single user page. 
                  That's why hiding the replies here */
                if (singleTweet?.isAReply) {
                  return null;
                }
                return (
                  <div className="row">
                    <div className="col-12 d-flex justify-content-center">
                      <div className="tweet-card card w-75 mb-1">
                        <div className="row">
                          <div className="col-2 d-flex justify-content-center">
                            <div className="mt-4 ms-5 ms-md-1">
                              {/* If profile_picture is available then showing it, else showing a default blank image */}
                              {singleTweet?.tweetedBy?.profile_picture ? (
                                <img
                                  src={singleTweet?.tweetedBy?.profile_picture}
                                  alt="pfp"
                                  width="50"
                                  height="50"
                                  className="rounded-circle"
                                  onClick={() =>
                                    fetchUserDetails(singleTweet?.tweetedBy._id)
                                  }
                                  role="button"
                                />
                              ) : (
                                <img
                                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                  alt="hugenerd"
                                  width="50"
                                  height="50"
                                  className="rounded-circle"
                                  onClick={() =>
                                    fetchUserDetails(singleTweet?.tweetedBy._id)
                                  }
                                  role="button"
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-10">
                            <div className="card-body">
                              {/* If Retweeted by section */}
                              {singleTweet?.isARetweet && (
                                <p className="text-primary">
                                  <i
                                    className="fa-solid fa-retweet pe-2"
                                    role="button"
                                  ></i>
                                  <span>
                                    ReTweeted By :
                                    <span className="ms-1 fw-bold">
                                      @
                                      {
                                        singleTweet?.thisTweetIsRetweetedBy
                                          ?.username
                                      }
                                    </span>
                                  </span>
                                </p>
                              )}

                              {/* User Info, name, username, and created at time (user "moment" for time here) */}
                              <div className="d-flex justify-content-between">
                                <div
                                  className="card-title fw-bolder fs-5"
                                  onClick={() =>
                                    fetchUserDetails(singleTweet?.tweetedBy._id)
                                  }
                                >
                                  {singleTweet?.tweetedBy?.name}
                                  <span className="ms-1 text-muted me-5 me-md-0">
                                    @{singleTweet?.tweetedBy?.username}
                                  </span>
                                  <span className="ms-4 text-muted fs-6 me-md-5 pe-md-5">
                                    {moment(singleTweet?.createdAt).fromNow()}
                                  </span>
                                </div>
                                <div>
                                  {/* ! if the retweet is created by the logged in user, then show the delete icon */}
                                  {singleTweet?.tweetedBy?._id ===
                                    auth?.user?.userId &&
                                    !singleTweet?.isARetweet && (
                                      <i
                                        onClick={(event) =>
                                          deleteRequest(singleTweet._id, event)
                                        }
                                        className="fa-solid fa-trash fs-5 text-danger ms-md-5 ps-md-5"
                                        role="button"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Delete this tweet"
                                      ></i>
                                    )}
                                  {singleTweet?.thisTweetIsRetweetedBy?._id ===
                                    auth?.user?.userId && (
                                    <i
                                      onClick={() =>
                                        deleteRequest(singleTweet._id)
                                      }
                                      className="fa-solid fa-trash fs-5 text-danger ms-md-5 ps-md-5"
                                      role="button"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title="Delete this tweet"
                                    ></i>
                                  )}
                                  <span
                                    onClick={() =>
                                      showSingleTweet(singleTweet._id)
                                    }
                                  >
                                    <i
                                      className="fa-solid fa-circle-info fs-5 text-info ms-5"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title="View all replies"
                                      role="button"
                                    ></i>
                                  </span>
                                </div>
                              </div>

                              <p className="card-text">{singleTweet.content}</p>
                              {/* If an image is is available in tweet then showing it, else showing nothing*/}

                              {singleTweet?.image ? (
                                <img
                                  src={singleTweet?.image}
                                  alt=""
                                  className="img-fluid"
                                  height="250"
                                  width="250"
                                />
                              ) : null}

                              {/* Like , Dislike and Retweet functionalities */}
                              <div className="d-flex justify-content-start gap-1 gap-md-5 mt-2 fs-5">
                                {/* Like */}
                                <div
                                  className="like-icon-container"
                                  onClick={() => likeRequest(singleTweet._id)}
                                >
                                  <Link>
                                    <i
                                      className={`${singleTweet.likes.map(
                                        (like) => {
                                          //    ! when the current user has liked a certain post show a solid heart
                                          if (
                                            like.user === auth?.user?.userId
                                          ) {
                                            return `fa-heart fa-solid pe-2`;
                                          } else {
                                            return "fa-heart fa-regular pe-2 text-black";
                                          }
                                        }
                                      )} ${
                                        singleTweet?.likes?.length === 0 &&
                                        "fa-regular fa-heart pe-2 text-black"
                                      }`}
                                    ></i>

                                    <span className="text-black">
                                      {singleTweet?.likes?.length}
                                    </span>
                                  </Link>

                                  {/* // "fa-solid fa-heart" :"fa-regular fa-heart"                                */}
                                </div>
                                {/* comment */}
                                <div
                                  className="comment-icon-container"
                                  onClick={() =>
                                    fetchDetailsOfTweetToCommentOn(
                                      singleTweet._id
                                    )
                                  }
                                >
                                  <Link
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal2"
                                  >
                                    <i className="fa-regular fa-comment pe-2 text-black"></i>
                                    <span className="text-black">
                                      {singleTweet?.replies?.length}
                                    </span>
                                  </Link>
                                </div>
                                {/* Retweet */}
                                <div
                                  className="retweet-icon-container"
                                  onClick={() =>
                                    retweetRequest(singleTweet._id)
                                  }
                                >
                                  <Link className="fa-solid fa-retweet pe-2 text-decoration-none text-black"></Link>
                                  <span className="text-black">
                                    {singleTweet?.reTweetedBy?.length}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <CreateTweetModal />
      <CreateCommentModal
        reloadSingleTweet={reloadSingleTweet}
        setReloadSingleTweet={setReloadSingleTweet}
      />
    </>
  );
};

export default Home;
