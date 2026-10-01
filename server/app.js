import express from "express";
import path from "path";
import cors from "cors";

import chatRoutes from "./routes/chat.routes.js";
import directMessageRoutes from "./routes/directMessage.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import testEmailRoutes from "./routes/testEmail.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import aiRoutes from "./routes/ai.routes.js";

// Recommendation routes
import recommendationRoutes from "./routes/recommendation.routes.js";

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// ==========================================
// STATIC FILES
// ==========================================

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ai-hire.vercel.app",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to AIHire API",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/v1/health", healthRoutes);

app.use("/api/v1/ai", aiRoutes);

app.use("/api/v1/auth", authRoutes);

// Existing Gemini / AI chat
app.use("/api/chat", chatRoutes);

// Candidate / Recruiter direct chat
app.use(
  "/api/v1/direct-chat",
  directMessageRoutes
);

app.use("/api/v1/jobs", jobRoutes);

// ==========================================
// AI JOB RECOMMENDATIONS
// ==========================================

app.use(
  "/api/v1/recommendations",
  recommendationRoutes
);

app.use(
  "/api/v1/applications",
  applicationRoutes
);

app.use(
  "/api/v1/notifications",
  notificationRoutes
);

app.use(
  "/api/v1/resumes",
  resumeRoutes
);

app.use(
  "/api/v1/dashboard",
  dashboardRoutes
);

app.use(
  "/api/v1/test-email",
  testEmailRoutes
);

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(notFound);

app.use(errorHandler);

export default app;