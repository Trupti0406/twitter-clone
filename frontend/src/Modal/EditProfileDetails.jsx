import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

const EditProfileDetailsModal = ({ currentUser }) => {
  const profileDetails = {
    name: currentUser?.user?.name,
    location: currentUser?.user?.location,
    date_of_birth: currentUser?.user?.DateOfBirth,
  };
  const [userProfileDetails, setUserProfileDetails] = useState(profileDetails);
  const [auth, setAuth] = useAuth();

  const [name, setName] = useState(userProfileDetails.name);
  const [location, setLocation] = useState(userProfileDetails.location);
  const [date_of_birth, setDate_of_birth] = useState(
    userProfileDetails.date_of_birth
  );
  const updateHandler = async (id) => {
    const { data } = await axios.post(`/user/updateUserProfileDetails/${id}`, {
      name,
      location,
      date_of_birth,
    });

    if (data?.error) {
      return toast.error(data?.error);
    }

    if (data?.user) {
      setUserProfileDetails(profileDetails);
      localStorage.setItem("auth", JSON.stringify(data));
      window.location.reload();
    }
  };
  return (
    <div
      className="modal fade"
      id="exampleModal4"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">
              Edit Profile
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label
                  htmlFor="user-name"
                  className="col-form-label fs-6 fw-semibold"
                >
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="user-name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Update name"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="user-loaction"
                  className="col-form-label fs-6 fw-semibold"
                >
                  Location:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="user-loaction"
                  name="location"
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Update location"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="user-dob"
                  className="col-form-label fs-6 fw-semibold"
                >
                  Date of Birth:
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="user-dob"
                  onChange={(e) => setDate_of_birth(e.target.value)}
                  name="date_of_birth"
                  placeholder="Update Birth Date"
                />
              </div>
            </form>
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
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() => updateHandler(auth?.user?.userId)}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileDetailsModal;
