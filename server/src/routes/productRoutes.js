// src/routes/productRoutes.js

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticate = require("../middlewares/authentication");

// Get all products (Protected)
router.get("/", authenticate, productController.getAllProducts);

// Create a new product (Protected)
router.post("/", authenticate, productController.createProduct);

// Update a product by ID (Protected)
router.put("/:id", authenticate, productController.updateProduct);

// Delete a product by ID (Protected)
router.delete("/:id", authenticate, productController.deleteProduct);

module.exports = router;
