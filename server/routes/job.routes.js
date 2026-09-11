import express from "express";

import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all jobs - Candidate
router.get("/", getAllJobs);

// ==========================================
// RECRUITER ROUTES
// IMPORTANT: /my MUST come before /:id
// ==========================================

// Get jobs posted by logged-in recruiter
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("recruiter"),
  getMyJobs
);

// Create new job
router.post(
  "/",
  authMiddleware,
  roleMiddleware("recruiter"),
  createJob
);

// Update own job
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateJob
);

// Delete own job
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  deleteJob
);

// Get single job
// Keep this AFTER /my
router.get("/:id", getJobById);

export default router;