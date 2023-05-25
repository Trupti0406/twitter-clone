const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profile_picture: {
      type: String,
    },
    location: {
      type: String,
    },
    DateOfBirth: {
      type: Date,
    },

    /* Represents the users who are following the current user. 
    It's an array of objects, where each object contains the user 
    field referencing the ID of a user from the "User" model */
    followers: [
      {
        user: {
          type: Schema.ObjectId,
          ref: "User",
        },
      },
    ],
    // Similar to followers
    following: [
      {
        user: { type: Schema.ObjectId, ref: "User" },
      },
    ],
    address: {
      type: String,
      trim: true,
    },
    /*Represents the user's role. It's a 
    string field with the options of "admin" or "user", and it defaults to "user".*/
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true } // to automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("User", UserSchema);
