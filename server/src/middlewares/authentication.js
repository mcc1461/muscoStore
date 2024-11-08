// middlewares/authentication.js

"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const authHeader = req.headers?.authorization || null; // Bearer ...accessToken...

  if (authHeader) {
    const [scheme, token] = authHeader.split(" "); // ['Bearer', '...accessToken...']

    if (scheme === "Bearer" && token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.ACCESS_KEY || process.env.JWT_SECRET
        );
        // Fetch the user from the database using the decoded token
        const user = await User.findById(decoded._id);

        if (!user) {
          // User not found
          return res
            .status(401)
            .json({ error: true, message: "User not found." });
        }

        req.user = user; // Attach the authenticated user to req.user
        next();
      } catch (err) {
        // Token verification failed
        console.error("Token verification error:", err);
        return res.status(401).json({ error: true, message: "Invalid token." });
      }
    } else {
      // Invalid token format
      return res
        .status(401)
        .json({ error: true, message: "Invalid authorization format." });
    }
  } else {
    // No authorization header
    return res
      .status(401)
      .json({ error: true, message: "No authorization header provided." });
  }
};
