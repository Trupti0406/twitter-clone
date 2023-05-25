const express = require("express");
const {
  createTweet,
  getAllTweets,
  deleteTweet,
  likeDislike,
  uploadImageToCloud,
  getSingleTweet,
  createComment,
  getTweetsFromFollowingUsers,
  createComment2,
  createReTweet,
} = require("../controllers/tweetController");
const { followUserController } = require("../controllers/userController");
const { isUserAuthenticated } = require("../middleware/auth");
const {
  tweetPhotoUpload,
  afterUploadingThroughMulter,
} = require("../utilities/tweetPhotoUpload");

const router = express.Router();

// In server.js request is used like this
// app.use("/tweet", tweetRoutes);
// So every request in this route will automatically have a "/tweet" prefix

// Request to upload a picture to the cloudinary
router.post(
  "/uploadPictureToCloud",
  tweetPhotoUpload.single("file"), // Handles file upload using multer middleware
  afterUploadingThroughMulter, // Process uploaded file (optional)
  uploadImageToCloud // Handle uploading image to cloud storage
);

// Request to create a new tweet
router.post("/createTweet", isUserAuthenticated, createTweet);

// Request to get a single tweet by its ID
router.get("/getSingleTweet/:id", isUserAuthenticated, getSingleTweet);

// Request to get all tweets from the users being followed by the authenticated user
router.post("/getAllTweets", isUserAuthenticated, getTweetsFromFollowingUsers);

// Request to get all tweets
router.get("/getAllTweets", isUserAuthenticated, getAllTweets);
// Request to create a comment on a tweet
router.post("/createComment/:tweetId", isUserAuthenticated, createComment);
router.put("/createComment/:tweetId", isUserAuthenticated, createComment2);

// Request to create a retweet of a tweet
router.post("/createRetweet/:tweetId", isUserAuthenticated, createReTweet);

// Request to follow a user
router.post(
  "/follow/:follower/:toFollow",
  isUserAuthenticated,
  followUserController
);

// Request to like/Dislike a tweet
router.put("/likeDislike/:tweetId", isUserAuthenticated, likeDislike);

// Request to delete a tweet by its ID
router.delete("/deleteTweet/:id", isUserAuthenticated, deleteTweet);

module.exports = router;
