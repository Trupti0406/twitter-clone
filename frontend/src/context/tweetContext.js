import axios from "axios";

import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./authContext";
/* Helper function */
// Function to get tweets from the users that the logged-in user is following
const getTweetsFromFollowingUsers = async (loggedInUser) => {
  try {
    // Retrieving the authentication data from local storage
    const authData = localStorage.getItem("auth");
    const authDataToUse = JSON.parse(authData);

    // Sending a POST request to the server to get all tweets from following users
    const { data } = await axios.post(
      `/tweet/getAllTweets`,
      { loggedInUser },
      {
        headers: {
          // Including the authentication token in the request headers

          Authorization: `Bearer ${authDataToUse?.token}`,
        },
      }
    );
    // Returning the response data (tweets from following users)
    return data;
  } catch (error) {
    console.log(error);
  }
};

/* Helper function */
// Function to get details of the logged-in user
const getLoggedInUser = async () => {
  try {
    const authData = localStorage.getItem("auth");
    const authDataToUse = JSON.parse(authData);
    // Sending a GET request to the server to get the logged-in user details
    const { data } = await axios.get(`/user/getLoggedInUserDetails`, {
      headers: {
        Authorization: `Bearer ${authDataToUse?.token}`,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

// This context will be used to provide tweet-related data to components.
const TweetContext = createContext();

const TweetProvider = ({ children }) => {
  const navigate = useNavigate();
  const [allTweets, setAllTweets] = useState([]);
  const [auth, setAuth] = useAuth();
  // to store the tweets & replies from the single user page
  const [singleUserPageDetails, setSingleUserPageDetails] = useState();
  const [tweetsFromFollowingUsers, setTweetsFromFollowingUsers] = useState([]);
  const [authDetails, setAuthDetails] = useState();

  const [tweetBool, setTweetBool] = useState(false);
  const [tweetToAddACommentOn, setTweetToAddACommentOn] = useState(null);

  // This function is used to send a request to like/dislike a tweet.
  const likeRequest = async (tweetToLike) => {
    const { data } = await axios.put(`/tweet/likeTweet/${tweetToLike}`);
    if (data?.error) {
      toast.error(data?.error);
    } else {
      if (data?.like) {
        toast.info("Tweet Liked Successfully");
      }
      // Since we are sending boolean value in backend, this will work like toggle
      if (!data?.like) {
        toast.info("Tweet Unliked Successfully");
      }
      // Calling these two to update the user details and all tweets after liking/disliking a tweet.
      getSingleUserDetails();
      getAllTweets();
    }
  };

  // This function is used to send a delete request to backend
  const deleteRequest = async (id) => {
    const { data } = await axios.delete(`/tweet/deleteTweet/${id}`);

    if (data?.error) {
      toast.error(data?.error);
    } else {
      // If the tweet has any replies, letting the user know that all the replies are also deleted
      if (data?.deletedReplies) {
        toast.success(
          `Tweet deleted successfully along with ${data?.deletedReplies} nested reply(ies)`
        );
      }
      toast.success("Tweet Deleted Successfully");
      // updating
      getAllTweets();
    }
  };

  /* To navigate to single tweet page. This wasn't really necessary. 
  / Since we can do it simply by declaring a function directly in Component 
  whenever we want to navigate to some page
  But I did it anyway to not miss any functionalities */
  const showSingleTweet = (id) => {
    navigate(`/tweet/${id}`);
  };

  // This function will fetch details of a tweet to be commented on.
  const fetchDetailsOfTweetToCommentOn = async (IDOftweetToCommentOn) => {
    setTweetToAddACommentOn(IDOftweetToCommentOn);
    const { data } = await axios.get(
      `/tweet/getSingleTweet/${IDOftweetToCommentOn}`
      // console.log(data);
    );
  };

  // sending a request to retweet a tweet.
  const retweetRequest = async (id) => {
    const { data } = await axios.post(`/tweet/createReTweet/${id}`);
    // console.log(data);
    if (data?.error) {
      toast.error(data?.error);
    } else {
      toast.success("retweeted Successfully");

      navigate("/");
    }

    // Updating
    getAllTweets();
  };

  /* This function  fetches the details of the logged-in user and 
  the tweets from the users that the logged -in user is following. */
  async function getLoggedInDetails() {
    const loggedInUser = await getLoggedInUser();
    // console.log(loggedInUser);
    const following = await getTweetsFromFollowingUsers(loggedInUser);

    // console.log(following);
    setTweetsFromFollowingUsers(following?.tweets);

    return loggedInUser;
  }

  // Sending a GET request to getch the details of sinle user
  const getSingleUserDetails = async () => {
    const { data } = await axios.get(`/user/getSingleUser`);
    if (data?.error) {
      toast?.error(data?.error);
    } else {
      setSingleUserPageDetails(data);
    }
  };

  if (!singleUserPageDetails) {
    getSingleUserDetails();
  }
  if (!tweetsFromFollowingUsers) {
    getLoggedInDetails();
  }

  // This function will fetch all tweets to show on the feed
  const getAllTweets = async () => {
    try {
      const authData = localStorage.getItem("auth");
      if (authData) {
        var authDataToUse = JSON.parse(authData);
        const { data } = await axios.get("/tweet/getAllTweets", {
          headers: {
            Authorization: `Bearer ${authDataToUse?.token}`,
          },
        });
        if (data?.tweets) {
          setAllTweets(data?.tweets);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (tweetsFromFollowingUsers) {
    // console.log(tweetsFromFollowingUsers);
  }
  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const parsed = JSON.parse(authData);
      setAuthDetails({
        ...authDetails,
        user: parsed.user,
        token: parsed.token,
      });
    }
    getAllTweets();
    getLoggedInDetails();
  }, []);

  return (
    <TweetContext.Provider
      value={{
        showSingleTweet,
        deleteRequest,
        retweetRequest,
        fetchDetailsOfTweetToCommentOn,
        getSingleUserDetails,
        likeRequest,
        auth,
        tweetToAddACommentOn,
        setAuthDetails,
        setTweetToAddACommentOn,
        tweetBool,
        setTweetBool,
        tweetsFromFollowingUsers,
        allTweets,
        getAllTweets,
        authDetails,
        setAuthDetails,
        singleUserPageDetails,
      }}
    >
      {children}
    </TweetContext.Provider>
  );
};

const useTweetContext = () => useContext(TweetContext);

export { useTweetContext, TweetProvider };
