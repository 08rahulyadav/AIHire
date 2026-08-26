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

// Upload / replace resume
router.post(
  "/",
  authMiddleware,
  roleMiddleware("candidate"),
  uploadResumeMiddleware.single("resume"),
  uploadResume
);

// Get my resume
router.get(
  "/my",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyResume
);

// Match resume with job
router.get(
  "/match/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  matchResumeWithJob
);

// Delete my resume
router.delete(
  "/my",
  authMiddleware,
  roleMiddleware("candidate"),
  deleteMyResume
);

export default router;