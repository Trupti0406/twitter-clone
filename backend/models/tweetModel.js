const mongoose = require("mongoose");
const { Schema } = mongoose;

const TweetSchema = new Schema(
  {
    // Text content of the tweet
    content: {
      type: String,
    },
    // Image associated with the tweet
    image: {
      type: String,
    },
    // A reply is also a tweet, this field indicates whether the tweet is a reply or not
    isAReply: {
      type: Boolean,
      default: false,
    },
    // If the tweet is a reply, isAReplyOfTweet will store the ID of the original tweet
    isAReplyOfTweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
    // Referencing to the user who tweeted this tweet
    tweetedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    // Users who have liked this tweet
    likes: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          immutable: false,
          ref: "User",
        },
      },
    ],

    // Comments associated with this tweet, which again are another tweet hence referencing to the "Tweet" model
    comments: [
      {
        comment: {
          type: mongoose.Types.ObjectId,
          ref: "Tweet",
          content: {
            type: String,
          },
          commentedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
          },
        },
      },
    ],

    // Users who have retweeted this tweet
    // This will give an array of user IDs representing the users who have retweeted the tweet.
    reTweetedBy: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],

    // User who originally tweeted the retweeted tweet
    thisTweetIsRetweetedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    // Indicates whether the tweet is a retweet or not
    isARetweet: {
      type: Boolean,
      default: false,
    },

    // Replies associated with this tweet
    replies: [
      {
        reply: {
          type: mongoose.Types.ObjectId,
          ref: "Tweet",
        },
      },
    ],
  },
  { timestamps: true } // Adds 'createdAt' and 'updatedAt' fields to track timestamps
);

module.exports = mongoose.model("Tweet", TweetSchema);
