// controllers/auth.js

"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.ACCESS_KEY || process.env.JWT_SECRET,
    { expiresIn: "15m" } // Access token expires in 15 minutes
  );

  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.REFRESH_KEY || process.env.JWT_SECRET,
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );

  return { accessToken, refreshToken };
};

module.exports = {
  // Login Controller
  login: async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Username and password are required." });
    }

    try {
      // Find user by username
      const user = await User.findOne({ username });

      if (!user) {
        return res
          .status(401)
          .json({ error: true, message: "Invalid username or password." });
      }

      // Check password (Assuming you have a method to compare passwords)
      const isMatch = await user.comparePassword(password); // Implement comparePassword in User model

      if (!isMatch) {
        return res
          .status(401)
          .json({ error: true, message: "Invalid username or password." });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user);

      // Optionally, store refreshToken in the database
      user.refreshToken = refreshToken;
      await user.save();

      // Respond with user data and tokens
      return res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          // ...other user fields
        },
        bearer: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error." });
    }
  },

  // Refresh Token Controller
  refresh: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ error: true, message: "Refresh token is required." });
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_KEY || process.env.JWT_SECRET
      );

      // Find user by ID and validate refresh token
      const user = await User.findById(decoded._id);

      if (!user || user.refreshToken !== refreshToken) {
        return res
          .status(401)
          .json({ error: true, message: "Invalid refresh token." });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        generateTokens(user);

      // Update user's refresh token
      user.refreshToken = newRefreshToken;
      await user.save();

      // Respond with new tokens
      return res.status(200).json({
        bearer: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      console.error("Refresh token error:", error);
      return res
        .status(401)
        .json({ error: true, message: "Invalid or expired refresh token." });
    }
  },

  // Logout Controller
  logout: async (req, res) => {
    const user = req.user;

    try {
      // Clear the user's refresh token
      user.refreshToken = null;
      await user.save();

      return res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      console.error("Logout error:", error);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error." });
    }
  },
};
