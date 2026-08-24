import express from "express";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "AIHire Email Test",
      text: "Congratulations! AIHire email service is working successfully.",
    });

    res.status(200).json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    next(error);
  }
});

export default router;