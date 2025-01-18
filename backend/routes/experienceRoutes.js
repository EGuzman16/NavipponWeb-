import express from "express";
const router = express.Router();
import {
  createExperience,
  deleteExperience,
  getAllExperiences,
  getExperience,
  updateExperience,
  getExperienceById, 
} from "../controllers/experienceControllers.js";
import { authGuard, adminGuard } from "../middleware/authMiddleware.js";

router.route("/").post(authGuard, adminGuard, createExperience).get(getAllExperiences);
router
  .route("/:slug")
  .put(authGuard, adminGuard, updateExperience)
  .delete(authGuard, adminGuard, deleteExperience)
  .get(getExperience);


router.route("/id/:id").get(getExperienceById);


export default router;