const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController.js");

// In server.js request is used like this
// app.use("/auth", authRoutes);
// So every request in this route will automatically have a "/auth" prefix

// POST request for user registration
router.post("/register", register);

// POST request for user login
router.post("/login", login);

module.exports = router;
