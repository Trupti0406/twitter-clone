import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTweetContext } from "../context/tweetContext";
import CreateCommentModal from "../Modal/Comment";
const SingleTweetPage = () => {
  const {
    auth,
    setTweetToAddACommentOn,
    tweetToAddACommentOn,
    retweetRequest,
  } = useTweetContext();
  const [singleTweet, setSingleTweet] = useState();
  const [reloadSingleTweet, setReloadSingleTweet] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const id = params.id;

  // const date = new Date(singleTweet?.createdAt).toDateString()
  const date = moment(singleTweet?.createdAt).fromNow();

  const likeRequest = async (id) => {
    const { data } = await axios.put(`/tweet/likeDislike/${id}`);

    if (data?.error) {
      toast.error(data?.error);
    } else {
      if (data?.like) {
        toast.info("Tweet Liked Successfully");
      }
      if (!data?.like) {
        toast.info("Tweet Unliked Successfully");
      }
      singleTweetDetails();
    }
  };

  const deleteRequest = async (id) => {
    const { data } = await axios.delete(`/tweet/deleteTweet/${id}`);

    if (data?.error) {
      toast.error(data?.error);
    } else {
      if (data?.deletedTweetNotAReply) {
        navigate("/");
      }
      toast.success("Comment Deleted Successfully");

      if (data?.deletedTweet) {
        navigate(`/tweet/${data?.parentTweet}`);
      }
      singleTweetDetails();
    }

    setReloadSingleTweet(!reloadSingleTweet);
  };

  const fetchDetailsOfTweetToCommentOn = async (id) => {
    setTweetToAddACommentOn(id);
    const { data } = await axios.get(`/tweet/getSingleTweet/${id}`);
  };

  //send request to the backend to get the details of a single tweet
  const singleTweetDetails = async () => {
    const { data } = await axios.get(`/tweet/getSingleTweet/${id}`);
    if (data?.singleTweet) {
      // console.log(data?.singleTweet?.tweetedBy?.username);
      setSingleTweet(data?.singleTweet);
    }
  };

  if (!singleTweet) {
    singleTweetDetails();
  }

  useEffect(() => {
    singleTweetDetails();
  }, [id, tweetToAddACommentOn, reloadSingleTweet]);

  if (!singleTweet) {
    return <h1 className="mt-5"> No tweets To Show</h1>;
  }

  return (
    <div className="container-fluid overflow-hidden bg-primary-subtle">
      <div className="vh-100 row overflow-auto">
        <div className="col d-flex flex-column h-sm-100">
          <nav className="top-0 navbar d-flex justify-content-between">
            <span className="navbar-brand mb-0 h1 fw-bolder fs-3">Profile</span>
          </nav>

          <div className="col-8 d-flex flex-column justify-content-center mt-1 mx-auto">
            <h3 className="text-center fw-bold">About this tweet:</h3>
            <hr />

            <div className="row" key={singleTweet._id}>
              <div className="col-12 d-flex justify-content-center">
                <div className="card w-100">
                  <div className="row">
                    <div className="col-2 d-flex justify-content-center">
                      <div className="mt-4 ms-5 ms-md-1">
                        {/* If profile_picture is available then showing it, else showing a default blank image */}
                        {singleTweet?.tweetedBy?.profile_picture ? (
                          <img
                            src={singleTweet?.tweetedBy?.profile_picture}
                            alt="hugenerd"
                            width="50"
                            height="50"
                            className="rounded-circle"
                          />
                        ) : (
                          <img
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            alt="hugenerd"
                            width="50"
                            height="50"
                            className="rounded-circle"
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-10">
                      <div className="card-body">
                        {/* User Info, name, username, and created at time (user "moment" for time here) */}
                        <p className="card-title fw-bolder fs-5">
                          {singleTweet?.tweetedBy?.name}
                          <span className="ms-1 text-muted me-5 me-md-0">
                            @{singleTweet?.tweetedBy?.username}
                          </span>
                          <span className="ms-4 text-muted fs-6 me-md-5 pe-md-5">
                            {date}
                          </span>
                          {/* if is created by the logged in user, then show the delete icon */}
                          {singleTweet?.tweetedBy?._id ===
                            auth?.user?.userId && (
                            <i
                              onClick={(event) =>
                                deleteRequest(singleTweet?._id)
                              }
                              className="fa-solid fa-trash fs-5 text-danger ps-md-5"
                              role="button"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Delete this tweet"
                            ></i>
                          )}
                          {/* <span
                                  onClick={() =>
                                    showSingleTweet(singleTweet._id)
                                  }
                                >
                                  <i
                                    className="fa-solid fa-ellipsis-vertical fs-5 text-info ms-5"
                                    role="button"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="View all replies"
                                  ></i>
                                </span> */}
                        </p>

                        <p className="card-text">{singleTweet?.content}</p>
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
                            <Link className="text-decoration-none">
                              <i
                                className={`${
                                  singleTweet.likes.map((like) => {
                                    //    ! when the current user has liked a certain post show a solid heart
                                    if (like.user === auth?.user?.userId) {
                                      return `fa-heart fa-solid pe-2`;
                                    } else {
                                      return "fa-heart fa-regular pe-2 text-black";
                                    }
                                  })
                                  //  when likes are zero return a regular heart
                                } ${
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
                              fetchDetailsOfTweetToCommentOn(singleTweet._id)
                            }
                          >
                            <Link
                              className="text-decoration-none"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal2"
                            >
                              <i className="fa-regular fa-comment pe-2 text-black"></i>
                              <span className="text-black">
                                {singleTweet?.comments?.length}
                              </span>
                            </Link>
                          </div>
                          {/* Retweet */}
                          <div
                            className="retweet-icon-container"
                            onClick={() => retweetRequest(singleTweet._id)}
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

            {singleTweet?.replies.map((reply, index) => {
              if (reply.reply === null) {
                return null;
              }
              return (
                <div className="row" key={singleTweet._id}>
                  <div className="col-12 d-flex justify-content-center">
                    <div className="card w-100">
                      <div className="row">
                        <div className="col-2 d-flex justify-content-center">
                          <div className="mt-4 ms-5 ms-md-1">
                            {/* If profile_picture is available then showing it, else showing a default blank image */}
                            {reply?.reply?.tweetedBy?.profile_picture ? (
                              <img
                                src={reply?.reply?.tweetedBy?.profile_picture}
                                alt="hugenerd"
                                width="50"
                                height="50"
                                className="rounded-circle"
                              />
                            ) : (
                              <img
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                                alt="hugenerd"
                                width="50"
                                height="50"
                                className="rounded-circle"
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-10">
                          <div className="card-body">
                            {/* User Info, name, username, and created at time (user "moment" for time here) */}
                            <p className="card-title fw-bolder fs-5">
                              {reply?.reply?.tweetedBy?.name}
                              <span className="ms-1 text-muted me-5 me-md-0">
                                @{reply?.reply?.tweetedBy?.username}
                              </span>
                              <span className="ms-4 text-muted fs-6 me-md-5 pe-md-5">
                                {moment(reply?.reply?.createdAt).fromNow()}
                              </span>
                              {/* if is created by the logged in user, then show the delete icon */}
                              {auth?.user?.userId ===
                                reply?.reply?.tweetedBy?._id && (
                                <i
                                  onClick={(event) =>
                                    deleteRequest(reply?.reply?._id)
                                  }
                                  className="fa-solid fa-trash fs-5 text-danger ps-md-5"
                                  role="button"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title="Delete this tweet"
                                ></i>
                              )}
                              {/* <span
                                  onClick={() =>
                                    showSingleTweet(singleTweet._id)
                                  }
                                >
                                  <i
                                    className="fa-solid fa-ellipsis-vertical fs-5 text-info ms-5"
                                    role="button"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="View all replies"
                                  ></i>
                                </span> */}
                            </p>

                            <p className="card-text">{reply?.reply?.content}</p>

                            {/* Like , Dislike and Retweet functionalities */}
                            <div className="d-flex justify-content-start gap-1 gap-md-5 mt-2 fs-5">
                              {/* Like */}
                              <div
                                className="like-icon-container"
                                onClick={() => likeRequest(reply?.reply?._id)}
                              >
                                <Link className="text-decoration-none">
                                  <i
                                    className={`${
                                      reply?.reply?.likes.map((like) => {
                                        //    ! when the current user has liked a certain post show a solid heart
                                        if (like.user === auth?.user?.userId) {
                                          return `fa-heart fa-solid pe-2`;
                                        } else {
                                          return "fa-heart fa-regular pe-2 text-black";
                                        }
                                      })
                                      //  when likes are zero return a regular heart
                                    } ${
                                      reply?.reply?.likes?.length === 0 &&
                                      "fa-regular fa-heart pe-2 text-black"
                                    }`}
                                  ></i>

                                  <span className="text-black">
                                    {reply?.reply?.likes?.length}
                                  </span>
                                </Link>

                                {/* // "fa-solid fa-heart" :"fa-regular fa-heart"                                */}
                              </div>
                              {/* comment */}
                              <div
                                className="comment-icon-container"
                                onClick={() =>
                                  fetchDetailsOfTweetToCommentOn(
                                    reply?.reply?._id
                                  )
                                }
                              >
                                <Link
                                  className="text-decoration-none"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal2"
                                >
                                  <i className="fa-regular fa-comment pe-2 text-black"></i>
                                  <span className="text-black">
                                    {reply?.reply?.replies?.length}
                                  </span>
                                </Link>
                              </div>
                              {/* Retweet */}
                              <div
                                className="retweet-icon-container"
                                onClick={() =>
                                  retweetRequest(reply?.reply?.replies?.length)
                                }
                              >
                                <Link className="fa-solid fa-retweet pe-2 text-decoration-none text-black"></Link>
                                <span className="text-black">
                                  {reply?.reply?.replies?.length}
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
      <CreateCommentModal
        reloadSingleTweet={reloadSingleTweet}
        setReloadSingleTweet={setReloadSingleTweet}
      />
    </div>
  );
};

export default SingleTweetPage;
