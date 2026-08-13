import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", authMiddleware, getProfile);

router.get(
  "/recruiter-test",
  authMiddleware,
  roleMiddleware("recruiter"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Recruiter",
      user: req.user,
    });
  }
);

router.get(
  "/candidate-test",
  authMiddleware,
  roleMiddleware("candidate"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Candidate",
      user: req.user,
    });
  }
);

export default router;