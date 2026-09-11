import express from "express";

import {
  uploadResume,
  getMyResume,
  deleteMyResume,
  matchResumeWithJob,
} from "../controllers/resume.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import uploadResumeMiddleware from "../middleware/uploadResume.js";

const router = express.Router();

// Upload a new resume
router.post(
  "/",
  authMiddleware,
  roleMiddleware("candidate"),
  uploadResumeMiddleware.single("resume"),
  uploadResume
);

// Get all resumes of logged-in candidate
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyResume
);

// Match selected resume with job
router.get(
  "/match/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  matchResumeWithJob
);

// Delete a specific resume
router.delete(
  "/:resumeId",
  authMiddleware,
  roleMiddleware("candidate"),
  deleteMyResume
);

export default router;