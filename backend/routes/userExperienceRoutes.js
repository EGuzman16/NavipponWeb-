import express from "express";
const router = express.Router();
import {
  createExperience,
  deleteExperience,
  updateExperience,
  getUserExperiences,
  getSingleUserExperience, 
} from "../controllers/userExperienceControllers.js";
import { authGuard } from "../middleware/authMiddleware.js";

// Rutas para los usuarios autenticados
router.route("/").post(authGuard, createExperience);
router.route("/user").get(authGuard, getUserExperiences);
router
  .route("/:slug")
  .get(authGuard, getSingleUserExperience)  
  .put(authGuard, updateExperience)
  .delete(authGuard, deleteExperience);

export default router;