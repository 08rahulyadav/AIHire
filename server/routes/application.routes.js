import express from "express";

import {
  applyForJob,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} from "../controllers/application.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("candidate"),
  applyForJob
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyApplications
);

router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterApplications
);

router.patch(
  "/:applicationId/status",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateApplicationStatus
);

export default router;