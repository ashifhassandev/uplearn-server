import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import passport from "passport";

import { setupGoogleStrategy } from "../../infrastructure/config/google.strategy";
import { errorHandler } from "../middlewares/error.middleware";
import adminRoutes from "../routes/admin.routes";
import authRoutes from "../routes/auth.routes";
import googleAuthRoutes from "../routes/google-auth.routes";
import studentRoutes from "../routes/student.routes";
import tutorRoutes from "../routes/tutor.routes";

export const createExpressApp = (): Express => {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());

  setupGoogleStrategy();
  app.use(passport.initialize());

  app.use("/api/auth", authRoutes);
  app.use("/api/auth", googleAuthRoutes);
  app.use("/api/student", studentRoutes);
  app.use("/api/tutor", tutorRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(errorHandler);

  return app;
};