import express from "express";

import {
  applyForJob,
  getMyApplications,
  getApplicationById,
  getRecruiterApplications,
  updateApplicationStatus,
  getCandidateApplicationStats,
  getRecruiterApplicationStats,
  getRecentCandidateApplications,
  getRecentRecruiterApplications,
} from "../controllers/application.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// ======================================================
// CANDIDATE ROUTES
// ======================================================

// Apply for a job
router.post(
  "/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  applyForJob
);

// Get candidate applications
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyApplications
);

// Candidate statistics
router.get(
  "/candidate/stats",
  authMiddleware,
  roleMiddleware("candidate"),
  getCandidateApplicationStats
);

// Candidate recent applications
router.get(
  "/candidate/recent",
  authMiddleware,
  roleMiddleware("candidate"),
  getRecentCandidateApplications
);

// ======================================================
// RECRUITER ROUTES
// ======================================================

// Get all recruiter applications
router.get(
  "/recruiter/all",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterApplications
);

// Recruiter statistics
router.get(
  "/recruiter/stats",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterApplicationStats
);

// Recruiter recent applications
router.get(
  "/recruiter/recent",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecentRecruiterApplications
);

// Update application status
router.patch(
  "/recruiter/:applicationId/status",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateApplicationStatus
);

// ======================================================
// SINGLE APPLICATION
// KEEP THIS LAST
// ======================================================

router.get(
  "/:applicationId",
  authMiddleware,
  roleMiddleware("candidate"),
  getApplicationById
);

export default router;