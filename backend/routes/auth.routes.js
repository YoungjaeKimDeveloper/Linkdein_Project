import express from "express";
const router = express.Router();
import { signup, login, logout } from "../controllers/auth.controller.js";

// Signup
router.post("/signup", signup);
// Login
router.post("/login", login);
// Logout
router.post("/logout", logout);

export default router;
