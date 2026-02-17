import express from "express";
import {
  createPost,
  updatePost,
  publishPost,
  getMyPosts,
  getPostById,
} from "../controllers/post.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", isAuthenticated, createPost);
router.patch("/:id", isAuthenticated, updatePost);
router.post("/:id/publish", isAuthenticated, publishPost);
router.get("/my", isAuthenticated, getMyPosts);
router.get("/:id", isAuthenticated, getPostById);

export default router;
