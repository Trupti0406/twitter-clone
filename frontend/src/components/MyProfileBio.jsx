import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useTweetContext } from "../context/tweetContext";
import UploadPfp from "../Modal/UploadPfpModal";
import EditProfileDetailsModal from "../Modal/EditProfileDetails";

const MyProfileBio = () => {
  const [auth, setAuth] = useAuth();
  const { getSingleUserDetails, allTweets } = useTweetContext();
  const [loggedInUser, setLoggedInUser] = useState();
  const [renderBool, setRenderBool] = useState(false);

  // console.log(singleUserPageDetails);

  const singleUserDetails = async (id) => {
    const { data } = await axios.get(`/user/getSingleUser/${id}`);
    if (data?.user) {
      setLoggedInUser(data?.user);
    }
  };

  if (!loggedInUser) {
    singleUserDetails(auth?.user?.userId);
  }

  useEffect(() => {
    getSingleUserDetails();
  }, [allTweets, loggedInUser, renderBool]);

  const date = new Date(auth?.user?.joiningDate);
  return (
    <>
      <div
        className="border bg-banner d-block"
        style={{ height: "10em" }}
      ></div>
      <div className="row px-4 d-flex flex-column flex-md-row flex-md-row justify-content-between position-relative">
        <div className="d-flex flex-wrap">
          <div className="" id="profile-link">
            <img
              src={
                loggedInUser?.profile_picture
                  ? loggedInUser?.profile_picture
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              }
              id="profile-img"
              alt=""
              width="120"
              height="120"
              className="rounded-circle profile-pic "
            />
          </div>
          <div className="d-flex h-md-50 ps-md-5 ms-md-5 mt-2">
            <button
              type="button"
              className="btn profile-btn btn-primary mb-0 h1 fw-bold px-5 me-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal3"
            >
              Upload Profile Pic
            </button>
            <button
              type="button"
              className="btn profile-btn btn-dark mb-0 h1 fw-bold px-5"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal4"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 d-flex flex-column mt-2">
        <span className="fs-5 fw-bold">{auth?.user?.name}</span>
        <p className="text-muted fw-bold">@{auth?.user?.username}</p>
        <p>
          <span className="me-5">
            <i className="fa-solid fa-cake-candles"></i> Date of Birth:{" "}
            <span>{new Date(auth?.user?.DateOfBirth).toDateString()}</span>
          </span>
          <span className="ms-5 ms-md-0">
            <i className="fa-solid fa-location-dot"></i>{" "}
            <span>{auth?.user?.location || loggedInUser?.location}</span>
          </span>
        </p>
        <p>
          <span>
            <i className="fa-regular fa-calendar"></i> Joined on:{" "}
            <span id="joining">{date.toDateString()}</span>
          </span>
        </p>
        <p className="fw-bold d-flex flex-column flex-md-row">
          <span className="me-5">
            {loggedInUser?.following?.length} Following
          </span>
          <span>{loggedInUser?.followers?.length} Followers</span>
        </p>
      </div>
      <UploadPfp />

      <EditProfileDetailsModal currentUser={auth} />
    </>
  );
};

export default MyProfileBio;
