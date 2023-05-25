import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTweetContext } from "../context/tweetContext";

const CreateTweetModal = () => {
  const { auth, getAllTweets } = useTweetContext();
  const [file, setFile] = useState();

  const tweetObject = {
    content: "",
    tweetedBy: auth?.user?.userId,
  };

  const [tweet, setTweet] = useState(tweetObject);

  const handleFileChange = async (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };

    setFile(img);
  };
  console.log(file, "file change");

  const onChange = (e) => {
    setTweet({
      ...tweet,
      [e.target.name]: e.target.value,
    });
  };

  const createTweetRequest = async () => {
    const formData = new FormData();

    let image_url = "";

    formData.append("file", file?.data);

    /* sending the image to the backend
    / from backend, uploading the image to cloud */
    const { data } = await axios.post("/tweet/uploadPictureToCloud", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data?.error) {
      toast.error(data?.error);
    } else {
      // image url coming from the backend
      image_url = data?.imgURL;
    }

    // package the tweet and image into one object
    // and then send it to the backend
    const finalTweetObject = {
      tweet,
      image: image_url?.url || null,
    };

    try {
      const { data } = await axios.post(
        "/tweet/createTweet",
        { ...finalTweetObject },
        {}
      );

      if (data?.error) {
        toast.error(data?.error);
      } else {
        toast.success("Tweet Created Successfully");
        setFile("");
        setTweet(tweetObject);
        getAllTweets();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div
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
              New Tweet
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
              onChange={onChange}
              name="content"
              id=""
              cols="60"
              rows="5"
              placeholder="Write something here..."
            />
            <p className="fw-semibold">Uplaod an image for your tweet:</p>
            {file?.preview && (
              <img
                src={file?.preview}
                className="img-fluid"
                height="100"
                width="100"
                alt="tweet"
              />
            )}
          </div>
          <input
            className="ms-3"
            type="file"
            name="file"
            onChange={handleFileChange}
          />

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
              onClick={() => createTweetRequest()}
              className="btn btn-primary tweet-btn-2"
            >
              Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTweetModal;
