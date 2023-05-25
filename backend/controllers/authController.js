const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* This function uses bcrypt to generate a salt and then hashes the password
with the generated salt. It returns the hashed password. */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

/* This function compares a plain text password with a hashed 
password to check if they match. It returns a promise 
that  resolves to true if the passwords match, or false otherwise. */
const matchPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // Validation: Checking if any required fields are missing
    if (!name || !email || !password || !username) {
      return res.json({ error: "One or more values are missing." });
    }

    // Checking if a user with the same email or username already exists
    const alreadyExistingUser = await User.findOne({ email });
    const alreadyExistingUserName = await User.findOne({ username });

    if (alreadyExistingUser) {
      return res.json({ error: "User already present with this email" });
    }

    if (alreadyExistingUserName) {
      return res.json({ error: "User already present with this username" });
    }

    // Hashing the password
    const hashedPassword = await hashPassword(password);

    // Creating a new user instance and saving it to the mongoDB database
    const user = await new User({
      name,
      email,
      password: hashedPassword,
      username,
    }).save();

    // Generating a JSON Web Token (JWT)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // Returning the user data and token in the response
    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Validation: Checking if username or password is missing
    if (!username || !password) {
      return res.json({ error: "One or more values are missing." });
    }

    // Checking if the user already exists using "username"
    const user = await User.findOne({ username });

    // If the user doesn't exist, returning an error
    if (!user) {
      return res.json({ error: "User not found" });
    }

    // Checking if the entered password matches the password while registering
    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      return res.json({ error: "Please enter correct password!" });
    }

    // Generating a JSON Web Token (JWT)
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    // Returning the user data and token in the response
    res.status(200).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
        role: user.role,
        joiningDate: user.createdAt,
        username: user.username,
        following: user?.following,
        followers: user?.followers,
      },
      token,
    });
  } catch (error) {
    return res.json({ error: error });
  }
};

module.exports = { register, login, hashPassword, matchPassword };
