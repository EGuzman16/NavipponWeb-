import express from "express";
const router = express.Router();
import {
    createReview,
    deleteReview,
    getAllReviews,
    updateReview,
} from "../controllers/reviewControllers.js";
import { adminGuard, authGuard } from "../middleware/authMiddleware.js";

router
    .route("/")
    .post(authGuard, createReview)
    .get(authGuard, adminGuard, getAllReviews);

router
    .route("/:reviewId")
    .put(authGuard, updateReview)
    .delete(authGuard, deleteReview);

export default router;