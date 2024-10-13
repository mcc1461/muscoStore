"use strict";
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs"); // Ensure bcrypt is required for password comparison

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
      try {
        // Find user by username or email
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (user) {
          // Compare the provided password with the stored hashed password
          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            if (user.isActive) {
              // Generate JWT access token
              const accessToken = jwt.sign(
                {
                  _id: user._id,
                  username: user.username,
                  role: user.role, // Use 'role' instead of 'isAdmin' and 'isStaff'
                  isActive: user.isActive,
                },
                process.env.ACCESS_KEY,
                {
                  expiresIn: "10d", // Access token expires in 10 days
                }
              );
              console.log("Access Token: ", accessToken);

              // Generate JWT refresh token
              const refreshToken = jwt.sign(
                {
                  _id: user._id,
                  // Do not include password in the token payload
                },
                process.env.REFRESH_KEY,
                {
                  expiresIn: "30d", // Refresh token expires in 30 days
                }
              );
              console.log("Refresh Token: ", refreshToken);

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
            res.status(401).json({
              error: true,
              message: "Wrong username/email or password.",
            });
          }
        } else {
          res.status(401).json({
            error: true,
            message: "Wrong username/email or password.",
          });
        }
      } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: true, message: "Server error." });
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
        async (err, decoded) => {
          if (err) {
            res
              .status(401)
              .json({ error: true, message: "Invalid refresh token." });
          } else {
            const { _id } = decoded;

            if (_id) {
              try {
                // Find user by ID
                const user = await User.findById(_id);

                if (user) {
                  if (user.isActive) {
                    // Generate new access token
                    const accessToken = jwt.sign(
                      {
                        _id: user._id,
                        username: user.username,
                        role: user.role,
                        isActive: user.isActive,
                      },
                      process.env.ACCESS_KEY,
                      { expiresIn: "10d" } // Access token expires in 10 days
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
                  res
                    .status(401)
                    .json({ error: true, message: "Invalid user." });
                }
              } catch (error) {
                console.error("Refresh token error:", error);
                res.status(500).json({ error: true, message: "Server error." });
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
