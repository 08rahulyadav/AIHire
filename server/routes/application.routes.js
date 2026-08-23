import express from "express";

import { applyForJob } from "../controllers/application.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("candidate"),
  applyForJob
);

export default router;