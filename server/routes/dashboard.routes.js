import express from "express";

import {
  getCandidateDashboard,
  getRecruiterDashboard,
} from "../controllers/dashboard.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Candidate dashboard
router.get(
  "/candidate",
  authMiddleware,
  roleMiddleware("candidate"),
  getCandidateDashboard
);

// Recruiter dashboard
router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterDashboard
);

export default router;