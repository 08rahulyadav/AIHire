import express from "express";

import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
   deleteJob,
} from "../controllers/job.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get all jobs
router.get("/", getAllJobs);
router.get("/:id", getJobById);
// Create job - recruiter only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("recruiter"),
  createJob
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateJob
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  deleteJob
);
export default router;