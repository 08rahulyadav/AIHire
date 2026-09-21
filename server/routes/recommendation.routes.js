import express from "express";

import {
  getJobRecommendations,
} from "../controllers/recommendation.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================================
// AI JOB RECOMMENDATIONS
// ==========================================

router.get(
  "/",
  authMiddleware,
  roleMiddleware("candidate"),
  getJobRecommendations
);

export default router;