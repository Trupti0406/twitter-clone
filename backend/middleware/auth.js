const jwt = require("jsonwebtoken");

/* This middleware function is responsible for authenticating a user 
based on a JSON Web Token (JWT) passed in the request headers.  */
const isUserAuthenticated = async (req, res, next) => {
  // This is coming from our frontend request
  const authHeader = req.headers.authorization;
  // If the 'authorization' header is missing or doesn't start with 'Bearer',
  // return a JSON response with an error message indicating an invalid token
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.json({ error: "Invalid token is there" });
  }
  // Split the authHeader string to extract the token part
  // by removing the word "Bearer" and any leading whitespace.
  const token = authHeader.split(" ")[1];

  /* verifying the token using jwt.verify and the JWT secret stored in 
  the process.env.JWT_SECRET environment variable. 
  This function decodes the token and verifies its authenticity. */
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user information extracted from the token to the 'req.user' object
    req.user = { userId: data._id, name: data.name };
    next();
  } catch (error) {
    return res.json({ error: error });
  }
};

module.exports = { isUserAuthenticated };
