import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTweetContext } from "../context/tweetContext";

const SingleUserPage = () => {
  const [singleUser, setSingleUser] = useState();
  const { getSingleUserDetails, auth, allTweets } = useTweetContext();

  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  const singleUserDetails = async (id) => {
    const { data } = await axios.get(`/user/getSingleUser/${id}`);

    if (data) {
      setSingleUser(data);
      // console.log(data);
    }
  };

  if (!singleUser) {
    singleUserDetails(id);
  }

  const followRequest = async (follower, userToFollow) => {
    if (follower === userToFollow) {
      toast.error("Oops! You cannot follow yourself");
      return;
    }
    const { data } = await axios.post(
      `/tweet/follow/${follower}/${userToFollow}`
    );
    singleUserDetails(id);
    if (data?.userToUnfollow) {
      toast.success("user unfollowed successfully");
    }
    if (data?.userToFollow) {
      toast.success("user followed successfully");
    }
  };

  useEffect(() => {
    singleUserDetails(id);
    // console.log(singleUser);
    getSingleUserDetails();
  }, [allTweets]);

  if (id === auth?.user?.userId) {
    navigate("/profile");
  }

  return (
    <>
      <div
        className="border d-block"
        style={{ height: "10em", backgroundColor: "#0d6efd" }}
      ></div>
      <div className="row px-4 d-flex flex-column flex-md-row flex-md-row justify-content-between position-relative">
        <div className="d-flex flex-wrap">
          <div className="" id="profile-link">
            {singleUser?.user?.profile_picture ? (
              <img
                src={singleUser?.user?.profile_picture}
                id="profile-img"
                alt=""
                width="120"
                height="120"
                className="rounded-circle profile-pic "
              />
            ) : (
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                alt=""
                width="120"
                height="120"
                className="rounded-circle profile-pic "
              />
            )}
          </div>
          <div className="d-flex h-md-50 ps-md-5 ms-md-5 mt-2">
            <button
              type="button "
              onClick={() => followRequest(auth?.user?.userId, params.id)}
              className="btn btn-dark profile-btn mb-0 h1 fw-bold ms-5 px-5 ps-md-5"
            >
              <span>
                {singleUser?.user?.followers.find(
                  ({ user }) => user === auth?.user?.userId
                )
                  ? "Unfollow"
                  : "Follow"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 d-flex flex-column mt-2">
        <span className="fs-5 fw-bold">{singleUser?.user?.name}</span>
        <p className="text-muted fw-bold">@{singleUser?.user?.username}</p>
        <p>
          <span className="me-5">
            <i className="fa-solid fa-cake-candles"></i> Date of Birth:{" "}
            <span>4th June 2001</span>
          </span>
          <span className="ms-5 ms-md-0">
            <i className="fa-solid fa-location-dot"></i>{" "}
            <span>Mumbai, India</span>
          </span>
        </p>
        <p>
          <span>
            <i className="fa-regular fa-calendar"></i> Joined on:{" "}
            <span id="joining">26th May 2023</span>
          </span>
        </p>
        <p className="fw-bold d-flex flex-column flex-md-row">
          <span className="me-5">
            {singleUser?.user?.following.length} Following
          </span>
          <span>{singleUser?.user?.followers.length} Followers</span>
        </p>
      </div>
    </>
  );
};

export default SingleUserPage;
