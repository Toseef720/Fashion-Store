import express from "express";
import { registerUser, loginUser } from "../controllers/userContorlers.js";
const router = express.Router();

// Defined routes for authentication


router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;