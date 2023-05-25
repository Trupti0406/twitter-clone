import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTweetContext } from "../context/tweetContext";
import CreateCommentModal from "../Modal/Comment";
import { Link } from "react-router-dom";
import UserProfileBio from "../components/UserProfileBio";

const SingleUserPage = () => {
  const [singleUser, setSingleUser] = useState();
  const {
    getSingleUserDetails,
    showSingleTweet,
    fetchDetailsOfTweetToCommentOn,
    retweetRequest,
    deleteRequest,
    auth,
    likeRequest,
    allTweets,
  } = useTweetContext();

  const [reloadSingleTweet, setReloadSingleTweet] = useState(false);

  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();
  console.log(id, "from single user page");

  const fetchSingleUserDetails = async (id) => {
    const { data } = await axios.get(`/user/getSingleUser/${id}`);

    if (data) {
      setSingleUser(data);
      // console.log(data);
    }
  };

  if (!singleUser) {
    fetchSingleUserDetails(id);
  }
  useEffect(() => {
    fetchSingleUserDetails(id);
    // getLoggedInUserDetails();
    getSingleUserDetails();
  }, [allTweets]);
  if (id === auth?.user?.userId) {
    navigate("/profile");
  }

  return (
    <div className="container-fluid overflow-hidden bg-primary-subtle">
      <div className="vh-100 row overflow-auto">
        <div className="col d-flex flex-column h-sm-100">
          <nav className="top-0 navbar d-flex justify-content-between">
            <span className="navbar-brand mb-0 h1 fw-bolder fs-3">Profile</span>
          </nav>

          <div className="col-8 d-flex flex-column justify-content-center  pt-5 mx-auto">
            <UserProfileBio />
            <hr />
            <h3 className="text-center fw-bold">Your Activity</h3>
            {singleUser?.tweetsByThisUser &&
              singleUser?.tweetsByThisUser.map((singleTweet) => {
                return (
                  <div className="row" key={singleTweet._id}>
                    <div className="col-12 d-flex justify-content-center">
                      <div className="card w-100">
                        <div className="row">
                          <div className="col-2 d-flex justify-content-center">
                            <div className="mt-4 ms-5 ms-md-1">
                              {/* If profile_picture is available then showing it, else showing a default blank image */}
                              {singleUser?.user?.profile_picture ? (
                                <img
                                  src={singleUser?.user?.profile_picture}
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
                                {singleUser?.user?.name}
                                <span className="ms-1 text-muted me-5 me-md-0">
                                  @{singleUser?.user?.username}
                                </span>
                                <span className="ms-4 text-muted fs-6 me-md-5 pe-md-5">
                                  {moment(singleTweet?.createdAt).fromNow()}
                                </span>
                                {/* if is created by the logged in user, then show the delete icon */}
                                {auth?.user?.userId ===
                                  singleUser?.user?._id && (
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
                                <span
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
                                </span>
                              </p>

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
                                  <Link className="text-decoration-none">
                                    <i
                                      className={`${
                                        singleTweet.likes.map((like) => {
                                          //    ! when the current user has liked a certain post show a solid heart
                                          if (
                                            like.user === auth?.user?.userId
                                          ) {
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
                                    fetchDetailsOfTweetToCommentOn(
                                      singleTweet._id
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
                                      {singleTweet?.comments?.length}
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
            {""}
            {singleUser?.tweets?.length === 0 && (
              <h1 style={{ textAlign: "center", border: "1px solid black" }}>
                No Tweets & Replies To Show
              </h1>
            )}
          </div>
        </div>
      </div>

      {/* ! this realodSingleTweet and setRealodSingleTweeet state variables were passed so that a re-render can be caused to show the changes
   
   
       there might be better ways of doing this because doing this feels redundant. Well, it helped to fix the problem at hand, so keeping this way.
   */}

      <CreateCommentModal
        reloadSingleTweet={reloadSingleTweet}
        setReloadSingleTweet={setReloadSingleTweet}
      />
    </div>
  );
};

export default SingleUserPage;
