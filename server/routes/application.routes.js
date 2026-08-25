import express from "express";

import {
  applyForJob,
  getMyApplications,
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

// Apply for a job - candidate only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("candidate"),
  applyForJob
);

// Get candidate's applications
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyApplications
);

// Get candidate application statistics
router.get(
  "/my/stats",
  authMiddleware,
  roleMiddleware("candidate"),
  getCandidateApplicationStats
);

// Get candidate's recent applications
router.get(
  "/my/recent",
  authMiddleware,
  roleMiddleware("candidate"),
  getRecentCandidateApplications
);

// Get recruiter's applications
router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterApplications
);

// Get recruiter application statistics
router.get(
  "/recruiter/stats",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterApplicationStats
);

// Get recruiter's recent applications
router.get(
  "/recruiter/recent",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecentRecruiterApplications
);

// Update application status - recruiter only
router.patch(
  "/:applicationId/status",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateApplicationStatus
);

export default router;