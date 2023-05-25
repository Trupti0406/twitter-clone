const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const PORT = 5000;
const app = express();
const authRoutes = require("./routes/authRoutes.js");
const tweetRoutes = require("./routes/tweetRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
// Although we are not using the cloudinary variable anywhere,
// we still need to import it here, without the import we can't upload images in tweet
const cloudinary = require("./utilities/cloudinaryConfig.js"); // Require the cloudinaryConfig.js file

dotenv.config();
// to get rid of CORS (cross-origin resource sharing) error
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/tweet", tweetRoutes);
// Initialising database connection
require("./database/connect.js");

app.listen(PORT, () => {
  console.log("Server started!");
});
