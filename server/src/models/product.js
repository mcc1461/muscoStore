// src/models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    quantity: {
      type: Number,
      required: [true, "Please add a quantity"],
    },
    value: {
      type: Number,
      required: [true, "Please add a value"],
    },
    // Add other fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
