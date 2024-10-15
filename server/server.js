"use strict";

/* -------------------------------------------------------
    NODEJS EXPRESS SERVER - server.js | MusCo Dev
------------------------------------------------------- */
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

// Import Reset Password
const {
  resetPassword,
  requestPasswordReset,
} = require("./src/controllers/auth");

/* ------------------------------------------------------- */
// Required Modules:

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, ".env") });
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 8061;

// Handle async errors
require("express-async-errors");

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ------------------------------------------------------- */
// Configurations:

// Connect to the database
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

/* ------------------------------------------------------- */
// Middlewares:

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3061", // Allow requests from frontend on port 3061
      "http://127.0.0.1:3061",
      "https://tailwindui.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Methods allowed
    credentials: true, // Allow cookies or credentials
    allowedHeaders: ["Content-Type", "Authorization"], // Headers allowed
  })
);

// Handle preflight requests for all routes
app.options("*", cors());

// Serve static files (e.g., CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Example of serving an SVG file with the correct CORS headers
app.get("/mark.svg", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml"); // Set the correct MIME type
  res.sendFile(path.join(__dirname, "public/mark.svg"));
});

// Accept JSON and URL Encoded Requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Check Authentication middleware
app.use(require("./src/middlewares/authentication"));

// res.getModelList() middleware
app.use(require("./src/middlewares/findSearchSortPage"));

/* ------------------------------------------------------- */
// Routes:

// HomePath
app.all("/api/documents", (req, res) => {
  res.render("documents", {
    title: "Stock Management API Service for MusCo",
  });
});

// API Routes
app.use("/api", require("./src/routes"));

// Catch-all route for serving index.html if needed
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Simple Welcome Message
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ message: "Hello MusCo" });
});

// Forgetten Password
app.post("/api/users/forgotPassword", requestPasswordReset);
app.post("/api/users/reset-password", resetPassword);

/* ------------------------------------------------------- */
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ msg: "not found" });
});

// Error Handler Middleware
app.use(require("./src/middlewares/errorHandler"));

// RUN SERVER:
app.listen(PORT, () => console.log(`http://${HOST}:${PORT}`));

// Sync if in production
// if (process.env.NODE_ENV === "production") {
//   require("./src/configs/sync")();
// }
