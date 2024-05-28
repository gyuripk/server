const jwt = require("jsonwebtoken");

// Middleware function to authorize users based on the JWT token
const authorize = (req, res, next) => {
  // Retrieve the authorization header
  const authorization = req.headers.authorization;
  let token = null;
  console.log("Authorization: ", authorization);

  // Check if the authorization header is properly formatted
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
    console.log("Token: ", token);
  } else {
    return res.status(401).json({
      error: true,
      message: "No authorization token",
    });
  }

  try {
    // Verify the JWT token
    const secretKey = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, secretKey);
    // Check if the token has expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      console.log("Token has expired");
      return res
        .status(401)
        .json({ error: true, message: "Token has expired" });
    }
    // Attach the user ID to the request object
    req.userId = decoded.userId;
    next();
  } catch (e) {
    console.error("Token verification failed:", e);
    return res.status(401).json({ error: true, message: "Token is not valid" });
  }
};

module.exports = authorize;
