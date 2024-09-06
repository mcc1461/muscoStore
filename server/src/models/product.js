"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "categoryId": "65343222b67e9681f937f203",
    "brandId": "65343222b67e9681f937f107",
    "name": "Product 1"
}
/* ------------------------------------------------------- */
// Product Model:

const ProductSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "no-image.jpg",
    },
    image2: {
      type: String,
      default: "no-image.jpg",
    },
  },
  { collection: "products", timestamps: true }
);

/* ------------------------------------------------------- */
module.exports = mongoose.model("Product", ProductSchema);
