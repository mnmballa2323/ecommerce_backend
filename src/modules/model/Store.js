const mongoose = require("mongoose");
// const validator = require("validator")
const { ObjectId } = mongoose.Schema.Types;

const storeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a Store name"],
      maxLength: [30, "Name is too learge"],
    },
    description: {
      type: String,
      // maxLength: [500, "Name is too learge"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Art and Crafts",
        "Automotive",
        "Baby and Kids",
        "Beauty and Personal Care",
        "Books and Media",
        "Electronics",
        "Electronics Accessories",
        "Fashion and Apparel",
        "Garden and Outdoor",
        "Grocery and Food",
        "Health and Wellness",
        "Home and Furniture",
        "Home Improvement",
        "Hobbies and Collectibles",
        "Jewelry and Watches",
        "Office Supplies",
        "Pet Supplies",
        "Sports and Outdoors",
        "Toys and Games",
        "Travel and Luggage",
      ],
    },
    storeImg: {
      type: String,
      required: [true, "Image is required"],
    },
    coverImg: {
      type: String,
      default:'https://i.ibb.co/wr0xj2j/Manage-Store-React-E-commerce-Dashboard-Template.png'
    },
    status: {
      type: String,
      enum: ["active", "in-active"],
      default: "active",
    },
    email: {
      type: String,
    },
    delete_url: {
      type: String,
    },
    totalOrders: {
      type: Number,
    },
    pendingOrders: {
      type: Number,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    storeId: String,
  },
  {
    tymestamps: true,
  }
);

const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
