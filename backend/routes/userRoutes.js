const express = require("express");
const { isUserAuthenticated } = require("../middleware/auth");
const {
  getSingleUser,
  getLoggedInUserDetails,
  uploadProfilePicture,
  uploadImageToCloud,
  getSingleUserDirectly,
  updateUserProfileDetails,
} = require("../controllers/userController");
const {
  profilePhotoUpload,
  afterUploadingProfilePictureThroughMulter,
} = require("../utilities/tweetPhotoUpload");

const router = express.Router();

// In server.js request is used like this
// app.use("/user", userRoutes);
// So every request in this route will automatically have a "/user" prefix

// Request to get all users
router.get("/getAllUsers", async (req, res) => {
  res.json({ message: "get all users" });
});

// Request to get the logged-in user's details directly instead of messing around. A mentor in doubt session suggested this.
router.get("/getSingleUser", isUserAuthenticated, getSingleUserDirectly);

// Request to get a single user by their ID
router.get("/getSingleUser/:id", isUserAuthenticated, getSingleUser);

// Request to update a user's details by their ID
router.put("/updateUser/:id", isUserAuthenticated, async (req, res) => {
  res.json({ message: "get all users" });
});

// Request to get details of the logged-in user
router.get(
  "/getLoggedInUserDetails",
  isUserAuthenticated,
  getLoggedInUserDetails
);

// Request to update the profile details of a user by their ID
router.post(
  "/updateUserProfileDetails/:id",
  isUserAuthenticated,
  updateUserProfileDetails
);

// Request to upload a profile picture
//(Bit tricky, referenced the functionality from several youTube videos)
router.post(
  "/uploadProfilePicture",
  isUserAuthenticated,
  profilePhotoUpload.single("file"), //Handles file upload using multer middleware
  afterUploadingProfilePictureThroughMulter, // Process uploaded file (optional)
  uploadImageToCloud // Handle uploading image to Cloudinary
);

module.exports = router;
