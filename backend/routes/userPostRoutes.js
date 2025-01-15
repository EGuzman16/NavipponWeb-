import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  updatePost,
  getUserPosts,  
  getPost,
} from "../controllers/userPostControllers.js";
import { authGuard } from "../middleware/authMiddleware.js";

// Rutas para los usuarios autenticados
router.route("/").post(authGuard, createPost);
router.route("/user").get(authGuard, getUserPosts);
router
  .route("/:slug")
  .put(authGuard, updatePost)
  .delete(authGuard, deletePost)
  .get(getPost);

export default router;