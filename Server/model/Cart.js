import mongoose from "mongoose";

const Cart_Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must me atleast 1"],
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = new mongoose.model("Cart", Cart_Schema);
