// src/middlewares/authentication.js

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const JWT_SECRET = process.env.JWT_SECRET || "Mcc_JWT_SECRET";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: true, message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user to request
    const user = await User.findById(decoded._id).select("-password -__v");
    if (!user) {
      return res.status(401).json({ error: true, message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(401)
      .json({ error: true, message: "Invalid or expired token." });
  }
};

module.exports = authenticate;
