const Tweet = require("../models/tweetModel.js");
const User = require("../models/userModel.js");
const mongoose = require("mongoose");
const fs = require("fs");
const cloudinaryUploadImg = require("../utilities/uploadToCloudinary.js");

// Function to get details of a single user
const getSingleUser = async (req, res) => {
  const { id } = req.params; // Extract the 'id' parameter from the request

  // Finding tweets by the user with the specified 'id'
  const tweetsByThisUser = await Tweet.find({ tweetedBy: id });

  // Finding the user with the specified 'id' and exclude the 'password' field from the result
  const user = await User.findOne({ _id: id })
    .select("-password")
    .sort({ createdAt: "-1" }); //sorting them by the latest posts;

  res.json({ user, tweetsByThisUser });
};

// Function to handle user follow action
const followUserController = async (req, res) => {
  // Extracting the 'follower' and 'toFollow' parameters from the request
  const { follower, toFollow } = req.params;

  // Checking if the user 'follower' is already following the user 'toFollow'
  const alreadyFollowed = await User.findOne({
    "followers.user": follower,
    _id: toFollow,
  });

  // If already followed, unfollow the user by removing their references from both 'followers' and 'following' arrays
  // We will be using a single button and toggle it to "follow" "unfollow"
  if (alreadyFollowed) {
    const userToUnfollow = await User.findOneAndUpdate(
      { _id: toFollow },
      {
        $pull: {
          followers: {
            user: new mongoose.Types.ObjectId(req.user.userId),
          },
        },
      },
      { new: true }
    );

    const userToRemoveFromFollowingArray = await User.findOneAndUpdate(
      { _id: req.user.userId },
      {
        $pull: {
          following: {
            user: new mongoose.Types.ObjectId(toFollow),
          },
        },
      },
      { new: true }
    );

    // Returning the updated user details
    return res
      .status(200)
      .json({ userToUnfollow, userToRemoveFromFollowingArray });
  }

  // If not already followed, follow the user by adding their references to 'followers' and 'following' arrays
  const userToFollow = await User.findOneAndUpdate(
    { _id: toFollow },
    {
      $push: {
        followers: {
          user: req.user.userId,
        },
      },
    },
    { new: true }
  );

  // console.log(req.user);
  const userWhoFollowed = await User.findOneAndUpdate(
    { _id: req.user.userId },
    {
      $push: {
        following: {
          user: new mongoose.Types.ObjectId(toFollow.toString()),
        },
      },
    },
    { new: true }
  );

  res.status(200).json({ userToFollow, userWhoFollowed });
};

// Function to get details of the logged-in user
const getLoggedInUserDetails = async (req, res) => {
  // Finding the logged-in user excluding the 'password' field from the result
  const loggedInUser = await User.findOne({ _id: req.user.userId }).select(
    "-password"
  );

  // Return the logged-in user details as JSON response
  res.json(loggedInUser);
};

// Function to handle profile picture upload
const uploadProfilePicture = async (req, res) => {
  res.json({ message: "upload profile picture" });
  // I have made the necessary code for this seperately in utilities Folder
};

// Function to upload an image to cloudinary
const uploadImageToCloud = async (req, res) => {
  if (req?.file) {
    const localPath = `uploads/pfp/${req?.file.filename}`;
    // console.log(localPath);

    // Uploading the image to a  Cloudinary
    const result = await cloudinaryUploadImg(localPath);
    // console.log(result);

    /* I don't want my local folders to get flooded with files, that's why I'm deleting it after 
    uploading to cloudinary */
    fs.unlinkSync(localPath);

    // Finding the user to update their profile picture and set the uploaded image URL
    const findUserToUpdateProfilePicture = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      {
        profile_picture: result.url,
      }
    );
    // Returning the uploaded image URL as JSON response
    return res.json({ imgURL: result });
  }
  res.json({ imgURL: "" });
};

/* Function to get details of a single user directly (without 
specifying the user ID in the route) */
const getSingleUserDirectly = async (req, res) => {
  // Finding the user with the ID of the logged-in user and exclude the 'password' field from the result
  const user = await User.findOne({ _id: req.user.userId }).select("-password");

  // Finding the tweets by the logged-in user, populate the 'tweetedBy' field
  const tweets = await Tweet.find({ tweetedBy: req.user.userId })
    .populate("tweetedBy")
    .sort({ createdAt: "-1" }); //sorting them by the latest posts

  // Finding all replies made by the logged-in user so that I can show it on my feed and specific user activity page as well
  const allReplies = await Tweet.find({
    isAReply: true,
    tweetedBy: req.user.userId,
  });

  // Returning the user details, their replies, and tweets as JSON response
  res.json({ user, allReplies, tweets });
};

// Function to update user profile details, name, location and dob
const updateUserProfileDetails = async (req, res) => {
  // Extracting the 'id' parameter from the request
  const { id } = req.params;
  // Extracting the name, locationa and dob from the request body
  const { name, location, date_of_birth } = req.body;

  // Sending error if any of the field is not provided
  if (!name || !location || !date_of_birth) {
    return res.json({ error: "please enter all the fields" }).status(404);
  }
  // console.log(req.body, "Profile Details");

  try {
    // Retrieving the auth token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);

    // Checking if the user to be updated already exists
    const userAlreadyExists = await User.findOne({ _id: id }).select(
      "-password"
    );

    if (!userAlreadyExists) {
      return res.json({ error: "user does not exist" }).status(409);
    }

    // Updating the user profile details and return the updated user details along with the token
    const editedUser = await User.findByIdAndUpdate(
      { _id: id },
      {
        name: name ? name : userAlreadyExists?.name,
        location: location ? location : userAlreadyExists?.location,
        DateOfBirth: new Date(date_of_birth)
          ? date_of_birth
          : userAlreadyExists?.DateOfBirth,
      },
      { new: true }
    );
    // console.log(editedUser);

    res.json({
      user: {
        userId: userAlreadyExists._id,
        name: editedUser?.name || userAlreadyExists.name,
        email: userAlreadyExists?.email,
        // password:userAlreadyExists?.password,
        DateOfBirth: editedUser?.DateOfBirth || userAlreadyExists.DateOfBirth,
        location: editedUser?.location || userAlreadyExists.location,
        username: userAlreadyExists?.username,
        following: userAlreadyExists?.following,
        followers: userAlreadyExists?.followers,
        joiningDate: userAlreadyExists?.createdAt,
        role: userAlreadyExists?.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  updateUserProfileDetails,
  getSingleUserDirectly,
  getSingleUser,
  followUserController,
  getLoggedInUserDetails,
  uploadProfilePicture,
  uploadImageToCloud,
};
