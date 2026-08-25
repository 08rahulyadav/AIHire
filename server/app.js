import express from "express";

import cors from "cors";

import jobRoutes from "./routes/job.routes.js";

import applicationRoutes from "./routes/application.routes.js";

import healthRoutes from "./routes/health.routes.js";

import authRoutes from "./routes/auth.routes.js";

import notificationRoutes from "./routes/notification.routes.js";

import testEmailRoutes from "./routes/testEmail.routes.js";

import dashboardRoutes from "./routes/dashboard.routes.js";

import notFound from "./middleware/notFound.js";

import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to AIHire API",
  });
});

app.use("/api/v1/health", healthRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/jobs", jobRoutes);

app.use("/api/v1/applications", applicationRoutes);

app.use("/api/v1/notifications", notificationRoutes);

app.use("/api/v1/test-email", testEmailRoutes);

app.use("/api/v1/dashboard", dashboardRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;