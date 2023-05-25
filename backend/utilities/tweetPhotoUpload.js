const multer = require("multer");
const sharp = require("sharp");
const multerStorage = multer.memoryStorage();
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // For grnerating a unique name for uploaded files

/* This is a Middleware function to filter the uploaded files, 
we have used multer in reactogram as well Most of the code is in referenced to that, 
since the functionalities were almost similar */
const multerFilter = (req, file, cb) => {
  // Check if the file is an image based on its mimetype
  if (file.mimetype.startsWith("image")) {
    cb(null, true); // Accept the file
  } else {
    cb({ message: "Unsupported File Format" }, false); // else reject it
  }
};

// Multer configuration for photo upload of tweet content
const tweetPhotoUpload = multer({
  storage: multerStorage, // Storing the uploaded file in memory
  fileFilter: multerFilter, // Applying the file filter middleware
});

// Multer configuration for profile photo upload
const profilePhotoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware function to process the uploaded file after multer middleware
const afterUploadingThroughMulter = async (req, res, next) => {
  // File upload is an optional category.
  // If no file is uploaded, skip to the next middleware
  if (!req.file) return next();

  // Generate a unique filename for the uploaded file
  req.file.filename = `tweetPhoto-${uuidv4()}-${req?.file.originalname}`;

  // Process the uploaded file using the sharp library(A collegue of mine suggested this)
  await sharp(req.file.buffer)
    .toFormat("jpeg") // Convert the image to JPEG format
    .jpeg({ quality: 90 }) // Setting the JPEG quality to 90%
    .toFile(path.join(`uploads/${req.file.filename}`)); // Saving the processed image to /uploads folder

  next();
};

// Middleware function to process the uploaded profile picture after multer middleware
const afterUploadingProfilePictureThroughMulter = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `pfp-${uuidv4()}-${req?.file.originalname}`;

  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`uploads/pfp/${req.file.filename}`));

  next();
};

module.exports = {
  tweetPhotoUpload,
  profilePhotoUpload,
  afterUploadingProfilePictureThroughMulter,
  afterUploadingThroughMulter,
};
