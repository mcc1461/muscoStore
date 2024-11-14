// src/controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const JWT_SECRET = process.env.JWT_SECRET || "Mcc_JWT_SECRET";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "Mcc_REFRESH_SECRET";

// Helper function to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      _id: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" } // Access token expires in 7 days
  );

  const refreshToken = jwt.sign(
    {
      _id: user._id,
    },
    REFRESH_SECRET,
    { expiresIn: "15d" } // Refresh token expires in 15 days
  );

  return { accessToken, refreshToken };
};

// Register Controller
const registerUser = async (req, res) => {
  const { username, email, password, firstName, lastName, role } = req.body;

  console.log("Request body:", req.body);

  // Validate input
  if (!username || !email || !password || !firstName || !lastName) {
    return res.status(400).json({
      error: true,
      message: "Please provide all required fields.",
    });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "Username or email already exists.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || "user",
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refreshToken in user model
    user.refreshToken = refreshToken;
    await user.save();

    // Respond with user data and tokens
    return res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      bearer: {
        accessToken,
        refreshToken,
      },
      error: false,
      message: "Registration successful.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: true,
        message: "Username and password are required.",
      });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials.",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials.",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refreshToken in user model
    user.refreshToken = refreshToken;
    await user.save();

    // Return user data and tokens
    return res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      bearer: {
        accessToken,
        refreshToken,
      },
      error: false,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: true,
      message: "Server error.",
    });
  }
};

// Refresh Token Controller
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ error: true, message: "Refresh token is required." });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // Find user by ID and validate refresh token
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid refresh token." });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update user's refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    // Respond with new tokens
    return res.status(200).json({
      bearer: {
        accessToken,
        refreshToken: newRefreshToken,
      },
      error: false,
      message: "Token refreshed successfully.",
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(401)
      .json({ error: true, message: "Invalid or expired refresh token." });
  }
};

// Logout Controller
const logout = async (req, res) => {
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
};

// Export the controllers
module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logout,
};
