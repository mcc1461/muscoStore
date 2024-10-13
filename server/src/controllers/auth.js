"use strict";
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const passwordEncrypt = require("../helpers/passwordEncrypt");

module.exports = {
  // Login function
  login: async (req, res) => {
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Login"
      #swagger.description = 'Login with username (or email) and password to get JWT tokens.'
      #swagger.parameters["body"] = {
          in: "body",
          required: true,
          schema: {
              "username": "test",
              "password": "1234",
          }
      }
    */

    const { username, email, password } = req.body;

    if ((username || email) && password) {
      // Find user by username or email
      const user = await User.findOne({ $or: [{ username }, { email }] });

      if (user && user.password === passwordEncrypt(password)) {
        if (user.isActive) {
          // Generate JWT access token
          const accessToken = jwt.sign(
            {
              _id: user._id,
              username: user.username,
              isAdmin: user.isAdmin,
              isStaff: user.isStaff,
              isActive: user.isActive,
            },
            process.env.ACCESS_KEY,
            {
              expiresIn: "10d", // Access token expires in 10 days
            }
          );

          // Generate JWT refresh token
          const refreshToken = jwt.sign(
            {
              _id: user._id,
              password: user.password, // It's generally not recommended to include password in token payload
            },
            process.env.REFRESH_KEY,
            {
              expiresIn: "30d", // Refresh token expires in 30 days
            }
          );

          // Send response with tokens and user data
          res.send({
            error: false,
            bearer: { accessToken, refreshToken },
            user,
          });
        } else {
          res
            .status(401)
            .json({ error: true, message: "This account is not active." });
        }
      } else {
        res
          .status(401)
          .json({ error: true, message: "Wrong username/email or password." });
      }
    } else {
      res.status(400).json({
        error: true,
        message: "Please enter username/email and password.",
      });
    }
  },

  // Refresh token function
  refresh: async (req, res) => {
    const refreshToken = req.body?.bearer?.refreshToken;

    if (refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_KEY,
        async (err, userData) => {
          if (err) {
            res
              .status(401)
              .json({ error: true, message: "Invalid refresh token." });
          } else {
            const { _id, password } = userData;

            if (_id && password) {
              // Find user by ID
              const user = await User.findOne({ _id });

              if (user && user.password === password) {
                if (user.isActive) {
                  // Generate new access token
                  const accessToken = jwt.sign(
                    {
                      _id: user._id,
                      username: user.username,
                      isAdmin: user.isAdmin,
                      isStaff: user.isStaff,
                      isActive: user.isActive,
                    },
                    process.env.ACCESS_KEY,
                    { expiresIn: "30m" } // Access token expires in 30 minutes
                  );

                  // Send new access token
                  res.send({
                    error: false,
                    bearer: { accessToken },
                  });
                } else {
                  res.status(401).json({
                    error: true,
                    message: "This account is not active.",
                  });
                }
              } else {
                res.status(401).json({ error: true, message: "Invalid user." });
              }
            } else {
              res
                .status(400)
                .json({ error: true, message: "Invalid token payload." });
            }
          }
        }
      );
    } else {
      res
        .status(400)
        .json({ error: true, message: "Refresh token not provided." });
    }
  },

  // Logout function
  logout: async (req, res) => {
    /*
      Since JWT tokens are stateless, you cannot invalidate them on the server side
      without implementing a token blacklist. For simplicity, we can just respond
      with a success message. The client should delete the token on their side.
    */
    res.send({ error: false, message: "Logged out successfully." });
  },
};
