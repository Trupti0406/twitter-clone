import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const EditProfileModal = () => {
  const [file, setFile] = useState();

  const pfpUploadHandler = async () => {
    if (!file) {
      return toast.error("Please upload a file");
    }
    const formData = new FormData();
    formData.append("file", file?.data);

    const { data } = await axios.post("/user/uploadProfilePicture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data?.error) {
      toast.error(data?.error);
    } else {
      window.location.reload(); //updating by reloading the window
    }
  };
  const handleChange = (e) => {
    // console.log("getting triggered");
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    // console.log(e.target.files[0]);
    setFile(img);
  };
  return (
    <>
      <div
        className="modal fade"
        id="exampleModal3"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Upload Profile Picture
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center flex-column">
              <div>
                <span className="fw-bold fs-5 me-2">Click here:</span>
                <label htmlFor="inputField" className="btn"></label>
                <input
                  type="file"
                  onChange={handleChange}
                  // style={{ display: "none" }}
                />
              </div>
            </div>
            <div className="mt-2"></div>
            {file?.preview && (
              <img
                src={file?.preview}
                alt=""
                className="img-fluid"
                height="150"
                width="150"
              />
            )}
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
                data-bs-dismiss="modal"
                onClick={() => pfpUploadHandler()}
                className="btn btn-primary"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
