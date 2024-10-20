"use strict";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const sendResetEmail = require("../helpers/sendResetEmail");

// Define a password regex for validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// Register function

const register = async (req, res) => {
  try {
    // Register the user (existing logic)
    const user = await User.create(req.body);

    // Generate the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Generated token:", token);

    // Return token and user info
    return res.status(201).json({
      message: "User registered successfully",
      token, // Send token back in the response
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: true,
      message: "Please enter username and password.",
    });
  }

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Wrong username or password.",
      });
    }

    // Compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: "Wrong username or password.",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: true,
        message: "This account is not active.",
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { _id: user._id, username: user.username, role: user.role },
      process.env.ACCESS_KEY,
      { expiresIn: "10d" }
    );
    const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_KEY, {
      expiresIn: "30d",
    });

    // Send response with tokens and user info
    res.send({
      error: false,
      bearer: { accessToken, refreshToken },
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

// Refresh token function
const refresh = async (req, res) => {
  const refreshToken = req.body?.bearer?.refreshToken;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ error: true, message: "Refresh token not provided." });
  }

  jwt.verify(refreshToken, process.env.REFRESH_KEY, async (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ error: true, message: "Invalid refresh token." });
    }

    const { _id } = decoded;
    try {
      const user = await User.findById(_id);
      if (!user || !user.isActive) {
        return res
          .status(401)
          .json({ error: true, message: "This account is not active." });
      }

      const accessToken = jwt.sign(
        { _id: user._id, username: user.username, role: user.role },
        process.env.ACCESS_KEY,
        { expiresIn: "10d" }
      );

      return res.send({ error: false, bearer: { accessToken } });
    } catch (error) {
      console.error("Refresh token error:", error);
      return res.status(500).json({ error: true, message: "Server error." });
    }
  });
};

// Logout function
const logout = async (req, res) => {
  res.send({ error: false, message: "Logged out successfully." });
};

// Password reset function
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({
      error: true,
      message: "Reset token and new password are required.",
    });
  }

  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      error: true,
      message: "Password does not meet the required criteria.",
    });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.RESET_KEY);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found." });
    }

    // Set new password directly, no hashing
    user.password = newPassword;

    // Clear reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.send({ error: false, message: "Password reset successful." });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ error: true, message: "Server error." });
  }
};

// Request password reset function
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ _id: user._id }, process.env.RESET_KEY, {
      expiresIn: "1h",
    });

    // Update the user with the reset token and expiry time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Construct the reset link
    const baseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:3061";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // Send the email with the reset link
    await sendResetEmail(
      user.email,
      "Password Reset",
      `You requested a password reset. Click the link to reset your password: ${resetLink}`
    );

    res.json({ message: "Password reset link sent to email." });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  login,
  register,
  refresh,
  logout,
  resetPassword,
  requestPasswordReset,
};
