import express from "express";
import {
  registerUser,
  loginUser,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  uploadProfilePic,
  updateUserProfile,
  getUserProfile,
} from "../controllers/userContorlers.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Defined routes for authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Profile routes (Protected)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/profile-pic", protect, upload.single("image"), uploadProfilePic);

// Defined routes for addresses (Protected)
router.route("/addresses").get(protect, getAddresses).post(protect, addAddress);
router
  .route("/addresses/:id")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

export default router;