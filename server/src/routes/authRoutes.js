// server/routes/authRoutes.js

const express = require("express");
const router = express.Router();

// Correctly import the named exports from authController.js
const {
  login,
  register,
  refresh,
  logout,
} = require("../controllers/authController");

// Define routes using the imported functions
router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refresh);
router.post("/logout", logout);

console.log("login:", login);
console.log("register:", register);
console.log("refresh:", refresh);
console.log("logout:", logout);

module.exports = router;
