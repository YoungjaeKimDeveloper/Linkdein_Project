import express from "express";
const router = express.Router();
import {
  signup,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
// Signup
router.post("/signup", signup);
// Login
router.post("/login", login);
// Logout
router.post("/logout", logout);
router.get("/me", verifyToken, getCurrentUser);

export default router;
