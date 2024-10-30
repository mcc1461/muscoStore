"use strict";

/* -------------------------------------------------------
    NODEJS EXPRESS SERVER - server.js | MusCo Dev
------------------------------------------------------- */
const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

// Import Password Reset Controllers
const {
  resetPassword,
  requestPasswordReset,
} = require("./src/controllers/auth");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 8061;

// Handle async errors
require("express-async-errors");

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

// Accept JSON and URL Encoded Requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve SVG with correct CORS headers
app.get("/mark.svg", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.sendFile(path.join(__dirname, "public/mark.svg"));
});

// Authentication Middleware
app.use(require("./src/middlewares/authentication"));

// Middleware for findSearchSortPage
app.use(require("./src/middlewares/findSearchSortPage"));

/* ------------------------------------------------------- */
// Routes:

// Authentication Routes
const authRoutes = require("./src/routes/auth");
app.use("/api/auth", authRoutes);

// HomePath for API Documentation
app.all("/api/documents", (req, res) => {
  res.render("documents", {
    title: "Stock Management API Service for MusCo",
  });
});

// Main API Routes
const mainRoutes = require("./src/routes");
app.use("/api", mainRoutes);

// Password reset routes
app.post("/api/users/forgotPassword", requestPasswordReset);
app.post("/api/users/reset-password", resetPassword);

// Welcome Route
app.get("/", (req, res) => {
  res.json({ message: "Hello MusCo" });
});

/* ------------------------------------------------------- */
// 404 and Error Handlers

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ msg: "not found" });
});

// Error Handler Middleware
app.use(require("./src/middlewares/errorHandler"));

/* ------------------------------------------------------- */
// Catch-all route for serving index.html if needed
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "index.html"));
});

/* ------------------------------------------------------- */
// Run Server
app.listen(PORT, HOST, () =>
  console.log(`Server running at http://${HOST}:${PORT}`)
);

// Uncomment for production sync
// if (process.env.NODE_ENV === "production") {
//   require("./src/configs/sync")();
// }
