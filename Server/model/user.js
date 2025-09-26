import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "buyer",
      required: [true, "Role is Required"],
    },
    businessName: {
      type: String,
      required: function () {
        return this.role === "seller";
      },
    },
    businessAddress: {
      type: String,
      required: function () {
        return this.role === "seller";
      },
    },
    businessDecription: {
      type: String,
      required: function () {
        return this.role === "seller";
      },
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.role === "seller";
      },
    },
    businessPhoneNumber: {
      type: String,
      required: function () {
        return this.role === "seller";
      },
    },
  },
  { timestamps: true }
);

export const User = new mongoose.model("User", userSchema);
