import express from "express";

import {
  applyForJob,
  getMyApplications,
  getApplicationById,
} from "../controllers/application.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Candidate applies for a job
router.post(
  "/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  applyForJob
);

// Candidate gets all own applications
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyApplications
);

// Candidate gets single application
router.get(
  "/:applicationId",
  authMiddleware,
  roleMiddleware("candidate"),
  getApplicationById
);

export default router;