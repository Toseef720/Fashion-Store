import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Bilkul same email se do users signup na kar sakein
      lowercase: true,//
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false, // Normal users user rahenge, admin products add/edit kar sakega
    },
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, default: "" },
        zip: { type: String, default: "" },
        country: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true, // Automatically `createdAt` aur `updatedAt` add kar dega
  }
);

const User = mongoose.model("User", userSchema);

export default User;