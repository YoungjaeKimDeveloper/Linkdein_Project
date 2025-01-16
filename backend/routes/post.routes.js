import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getFeedPosts,
  createPost,
  deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.post("/create", verifyToken, createPost);
router.delete("/delete/:id", verifyToken, deletePost);
export default router;
