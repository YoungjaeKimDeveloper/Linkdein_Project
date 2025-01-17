import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
// Controllers
import {
  getUserNotification,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";
const router = express.Router();

export default router;

router.get("/", verifyToken, getUserNotification);
router.put("/:id/read", verifyToken, markNotificationAsRead);
router.delete("/:id", verifyToken, deleteNotification);
