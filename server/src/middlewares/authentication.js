"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | MusCo Dev
------------------------------------------------------- */
// authentication.js | Middleware

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers?.authorization || null; // Bearer ...accessToken...

  if (authHeader) {
    const [scheme, token] = authHeader.split(" "); // ['Bearer', '...accessToken...']

    if (scheme === "Bearer" && token) {
      jwt.verify(token, process.env.ACCESS_KEY, (err, decoded) => {
        if (err) {
          // Token verification failed
          req.user = undefined;
        } else {
          // Token is valid, set user data
          req.user = decoded;
        }
        next();
      });
    } else {
      // Invalid token format
      req.user = undefined;
      next();
    }
  } else {
    // No authorization header
    req.user = undefined;
    next();
  }
};
