import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/suggestions", verifyToken, getSuggestedConnections);
router.get("/:username", verifyToken, getPublicProfile);

router.put("/profile", verifyToken, updateProfile);

export default router;
