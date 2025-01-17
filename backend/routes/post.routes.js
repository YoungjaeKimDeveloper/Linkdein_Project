import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getFeedPosts,
  createPost,
  deletePost,
  getPostById,
  createComment,
  likePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", verifyToken, getFeedPosts);
router.post("/create", verifyToken, createPost);
router.delete("/delete/:id", verifyToken, deletePost);
router.get("/:id", verifyToken, getPostById);
router.post("/:id/comment", verifyToken, createComment);
router.post("/:id/like", verifyToken, likePost);

export default router;
