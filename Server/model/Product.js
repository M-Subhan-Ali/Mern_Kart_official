import mongoose from "mongoose";

const product_Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is Required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is Required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is Required"],
      min: [0, "Price can't be nagative"],
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: [
        "men's clothing",
        "electronics",
        "Clothing",
        "groceries",
        "women's clothing",
        "Sports",
        "beauty",
        "jewelery",
        "furniture",
        "fragrances",
        "watch",
      ],
      required: [true, "Categopry is Required"],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock is Required"],
      min: [0, "Stock can't be negative"],
      default: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = new mongoose.model("Product", product_Schema);
