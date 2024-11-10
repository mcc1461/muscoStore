// src/controllers/productController.js

const Product = require("../models/Product");

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};

// Create a Product
const createProduct = async (req, res) => {
  const { name, category, price, quantity, value } = req.body;

  if (!name || !category || !price || !quantity || !value) {
    return res.status(400).json({
      error: true,
      message: "Please provide all required fields.",
    });
  }

  try {
    const product = new Product({
      name,
      category,
      price,
      quantity,
      value,
    });

    await product.save();

    return res.status(201).json({ product });
  } catch (error) {
    console.error("Error creating product:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};

// Update a Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, quantity, value } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found." });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.value = value || product.value;

    await product.save();

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};

// Delete a Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ error: true, message: "Product not found." });
    }

    await product.remove();

    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
