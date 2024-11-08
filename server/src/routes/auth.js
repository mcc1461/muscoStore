// routes/auth.js

"use strict";

const router = require("express").Router();
const authController = require("../controllers/auth");

// Public routes
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout); // Typically, logout can be a protected route

module.exports = router;
