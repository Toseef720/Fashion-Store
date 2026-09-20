import express from "express";
import {
  registerUser,
  loginUser,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/userContorlers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Defined routes for authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// Defined routes for addresses (Protected)
router.route("/addresses").get(protect, getAddresses).post(protect, addAddress);
router
  .route("/addresses/:id")
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

export default router;