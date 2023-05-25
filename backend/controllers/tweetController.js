const Tweet = require("../models/tweetModel.js");
const cloudinaryUploadImg = require("../utilities/uploadToCloudinary.js");
const fs = require("fs");
const mongoose = require("mongoose");

/* This function handles the creation of a new tweet. 
It receives the tweet content and an image (image is optional) from the request body */
const createTweet = async (req, res) => {
  const { tweet, image } = req.body;

  if (!tweet.content) {
    return res.json({ error: "Please Enter something to tweet" });
  }

  /*Creating a new Tweet instance with the tweet content, the ID of the user 
  who tweeted it (req.user.userId), and the image and saving it to database  */
  const createdTweet = await new Tweet({
    content: tweet.content,
    tweetedBy: new mongoose.Types.ObjectId(req?.user?.userId),
    image: image,
  }).save();

  res.json({ tweet: createdTweet }); //returning the created tweet in response.
};

// This function retrieves all tweets from the database.
const getAllTweets = async (req, res) => {
  /*Populates the tweetedBy, thisTweetIsRetweetedBy,
  and likes fields with their corresponding data from other collections.*/
  const tweets = await Tweet.find({})
    .populate("tweetedBy")
    .populate("thisTweetIsRetweetedBy")
    .populate("likes")
    .sort({ createdAt: "-1" }); // Sort by latest posts

  res.json({ tweets }); // Returning tweets in response
};

/* This function handles the deletion of a tweet. 
It receives the tweet ID from the request parameters*/
const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;

    // Finds the tweet with the given ID and checks if it is a reply.
    const findThisTweet = await Tweet.find({ _id: id, isAReply: true });

    //Retrieves the parent tweet ID if the tweet is a reply.
    const tweet = await Tweet.findOne({ _id: id });

    // Retrieves the replies of the tweet and gets their IDs.
    const tweetReplies = await Tweet.findOne({ _id: id })
      .populate("replies.reply")
      .select("replies");
    const tweetReplyIDs = tweetReplies.replies.map((reply) => {
      return reply?.reply?._id;
    });

    // Deletes the tweet replies using their IDs.
    const deleteTweetReplies = await Tweet.deleteMany({
      _id: {
        $in: tweetReplyIDs,
      },
    });

    //If the tweet is a reply, removes the reference to it from the parent tweet's replies array.
    if (tweet.isAReply) {
      const parentTweet = tweet.isAReplyOfTweet.valueOf();
      await Tweet.findByIdAndUpdate(
        { _id: tweet.isAReplyOfTweet },
        {
          $pull: {
            replies: {
              reply: tweet._id,
            },
          },
        },
        { new: true }
      );
      const deletedTweet = await Tweet.findByIdAndDelete(id);
      return res.json({
        deletedTweet,
        parentTweet: parentTweet,
        deletedReplies: deleteTweetReplies?.deletedCount,
        message: "Tweet Deleted Successfully !",
      });
    } else {
      const deletedTweetNotAReply = await Tweet.findByIdAndDelete({ _id: id });
      return res.json({
        deletedTweetNotAReply,
        deletedReplies: deleteTweetReplies?.deletedCount,
        message: "Tweet Deleted Successfully !",
      });
    }
  } catch (error) {
    return res.json({ error });
  }
};

/* This function handles the like functionality of a tweet
and receives the ID of the tweet which we want to like*/
// Reference => https://youtu.be/U7uyolAHLc4
const likeDislike = async (req, res) => {
  try {
    const { tweetId } = req.params;
    // Checking if the user has already liked the tweet
    const alreadyLiked = await Tweet.findOne({
      "likes.user": new mongoose.Types.ObjectId(req.user.userId),
      _id: tweetId,
    });

    // If the user has already liked the tweet, unliking the tweet by removing the like
    if (alreadyLiked) {
      const unlikeTweet = await Tweet.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(alreadyLiked._id) },
        {
          $pull: {
            likes: {
              user: req.user.userId,
            },
          },
        }
      );

      return res.json({ unlikeTweet, like: false });
    }

    // If the user has not already liked the tweet, like the tweet by adding the like
    const likedTweet = await Tweet.findByIdAndUpdate(
      { _id: tweetId },
      {
        $push: {
          likes: [{ user: req.user.userId }],
        },
      }
    );

    res.json({ likedTweet, like: true });
  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
};

const followUser = async (req, res) => {};

const reTweet = async (req, res) => {};

/* The uploadImageToCloud function is responsible for handling 
the uploading of an image file to a cloud storage service i.e. Cloudinary  
and returning the URL of the uploaded image. */
const uploadImageToCloud = async (req, res) => {
  //Checking if the image exists in the request
  if (req?.file) {
    // Get the local path of the uploaded file
    const localPath = `uploads/${req?.file.filename}`;

    // Uploading the file to Cloudinary using the utility function cloudinaryUploadImg.js
    const result = await cloudinaryUploadImg(localPath);

    // Deleting the local file from the server
    fs.unlinkSync(localPath);
    // Returning the Cloudinary image URL in the response
    return res.json({ imgURL: result });
  }
  // If no file is present in the request, return an empty image URL
  res.json({ imgURL: "" });
};

/*The getSingleTweet function is used to retrieve a single tweet from a 
database and send it as a response in an API endpoint. */
const getSingleTweet = async (req, res) => {
  const { id } = req.params;

  // Checking if an 'id' parameter is provided in the request and if the request is valid
  if (!id) {
    return res.json({ error: "Please provide an id" });
  }
  // Finding the single tweet with the provided 'id'
  const singleTweet = await Tweet.findOne({ _id: id })
    .populate("tweetedBy replies.reply replies.reply") //retriving replies to the tweet and nested replies
    .populate({ path: "replies.reply", populate: "tweetedBy" })
    .select("-password")
    .populate({
      path: "tweetedBy",
      select: "-password",
    });

  // return error is tweet is not found with the 'id'
  if (!singleTweet) {
    return res.json({ error: "no such tweet found" });
  }
  // Sending the singleTweet object in the response
  res.send({ singleTweet });
};

const createComment = async (req, res) => {
  /* Extract the tweetId parameter and the content and 
   commentedBy fields from the request body. */
  const { tweetId } = req.params;
  const { content, commentedBy } = req.body;

  const tweetToAddACommentOn = await Tweet.findByIdAndUpdate(
    { _id: tweetId },
    /* Within the update, using the $push operator to add a new
     comment object to the comments array field of the tweet. */
    {
      /* The comment object contains the content and 
      commentedBy values obtained from the request body. */
      $push: {
        comments: {
          content,
          commentedBy,
        },
      },
    },
    { new: true }
  );
  res.json({ tweetToAddACommentOn });
};

const createComment2 = async (req, res) => {
  const { tweetId } = req.params;
  const { content, commentedBy } = req.body;

  if (!content) {
    return res.json({ error: "Please enter something to reply" }).status(400);
  }
  const commentToAdd = {
    content: content,
    commentedBy: commentedBy,
  };

  const tweetAsComment = await new Tweet({
    content,
    tweetedBy: req.user.userId,
    isAReply: true,
    isAReplyOfTweet: tweetId,
  }).save();

  const tweetToAddACommentOn = await Tweet.findByIdAndUpdate(
    { _id: tweetId },
    {
      $push: {
        comments: [
          {
            comment: new mongoose.Types.ObjectId(tweetAsComment._id),
            content,
            commentedBy: new mongoose.Types.ObjectId(req.user.userId),
          },
        ],
      },
    },
    { new: true }
  );

  const addToReplyArray = await Tweet.findByIdAndUpdate(
    { _id: tweetId },
    {
      $push: {
        replies: [{ reply: new mongoose.Types.ObjectId(tweetAsComment._id) }],
      },
    },
    { new: true }
  );
  res.json({ tweetToAddACommentOn });
};

/* This code essentially retrieves tweets from the users that the logged-in user is following 
and includes the user objects who posted those tweets. */
const getTweetsFromFollowingUsers = async (req, res) => {
  // Retrieving the list of users that the logged-in user is following
  const followingUsers = req.body.loggedInUser?.following.map((singleTweet) => {
    return singleTweet.user; // extracting user property from each element
  });

  // Finding all tweets where the 'tweetedBy' field matches any of the followingUsers
  const tweets = await Tweet.find({ tweetedBy: followingUsers }).populate(
    "tweetedBy"
  );

  // Returning the list of tweets as the response
  res.json({ tweets });
};

const createReTweet = async (req, res) => {
  const { tweetId } = req.params;
  const tweetedBy = req.user.userId;

  // Finding the original tweet to retweet
  const tweetToRetweet = await Tweet.findOne({ _id: tweetId });
  const retweetsOfTweetToReTweet = tweetToRetweet?.reTweetedBy;

  // Adding the current user to the list of users who retweeted the original tweet
  retweetsOfTweetToReTweet.push(tweetedBy);

  // Creating a new tweet as a retweet
  const createNewTweetAsARetweet = await new Tweet({
    isARetweet: true,
    content: tweetToRetweet.content,
    tweetedBy: new mongoose.Types.ObjectId(tweetToRetweet.tweetedBy._id),
    thisTweetIsRetweetedBy: new mongoose.Types.ObjectId(req?.user.userId),
    image: tweetToRetweet?.image ? tweetToRetweet?.image : null,
  }).save();

  // Updating the original tweet's retweet list with the current user
  const retweet = await Tweet.findByIdAndUpdate(
    { _id: tweetId },
    {
      $push: {
        reTweetedBy: [tweetedBy],
      },
    },
    { new: true }
  );

  // Updating the retweet list of the newly created retweet with other users who retweeted the original tweet
  retweet?.reTweetedBy?.map(async (userID) => {
    await Tweet.findByIdAndUpdate(
      { _id: createNewTweetAsARetweet._id.valueOf() },
      {
        $push: {
          reTweetedBy: [userID],
        },
      },
      { new: true }
    );
  });

  res.json({
    message: "createReTweet",
    tweetId,
    tweetedBy,
    retweet,
    createNewTweetAsARetweet,
  });
};

module.exports = {
  createReTweet,
  getTweetsFromFollowingUsers,
  createTweet,
  createComment2,
  createComment,
  getSingleTweet,
  getAllTweets,
  deleteTweet,
  likeDislike,
  followUser,
  reTweet,
  uploadImageToCloud,
};
