"use strict";
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs"); // Ensure bcrypt is required for password comparison
const sendResetEmail = require("../helpers/sendResetEmail");

module.exports = {
  // Login function
  login: async (req, res) => {
    const { username, email, password } = req.body;

    if ((username || email) && password) {
      try {
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            if (user.isActive) {
              const accessToken = jwt.sign(
                {
                  _id: user._id,
                  username: user.username,
                  role: user.role,
                  isActive: user.isActive,
                },
                process.env.ACCESS_KEY,
                { expiresIn: "10d" }
              );

              const refreshToken = jwt.sign(
                { _id: user._id },
                process.env.REFRESH_KEY,
                { expiresIn: "30d" }
              );

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
                const user = await User.findById(_id);

                if (user && user.isActive) {
                  const accessToken = jwt.sign(
                    {
                      _id: user._id,
                      username: user.username,
                      role: user.role,
                      isActive: user.isActive,
                    },
                    process.env.ACCESS_KEY,
                    { expiresIn: "10d" }
                  );

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
    res.send({ error: false, message: "Logged out successfully." });
  },

  // Password reset function
  resetPassword: async (req, res) => {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        error: true,
        message: "Reset token and new password are required.",
      });
    }

    try {
      jwt.verify(resetToken, process.env.RESET_KEY, async (err, decoded) => {
        if (err) {
          return res.status(400).json({
            error: true,
            message: "Invalid or expired reset token.",
          });
        }

        const { _id } = decoded;
        const user = await User.findById(_id);

        if (!user) {
          return res.status(404).json({
            error: true,
            message: "User not found.",
          });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.send({ error: false, message: "Password reset successful." });
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ error: true, message: "Server error." });
    }
  },
};
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

    // Debugging log for the reset link
    console.log("Reset Link:", resetLink); // Log the complete reset link

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

module.exports.requestPasswordReset = requestPasswordReset;
