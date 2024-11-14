// src/models/index.js

"use strict";

const mongoose = require("mongoose");

// Import all models to ensure they are registered
require("./user"); // Assuming you have a User model
require("./brand"); // Brand model
require("./category"); // Category model
require("./product"); // Product model
// Add other models as needed

module.exports = mongoose;
