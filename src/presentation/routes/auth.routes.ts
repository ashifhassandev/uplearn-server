import { Router } from "express";
import { container } from "tsyringe";

import AuthController from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();
const authController = container.resolve(AuthController);

router.post(
  "/signup",
  asyncHandler(authController.createUser.bind(authController)),
);

router.post(
  "/resend-otp",
  asyncHandler(authController.resendOtp.bind(authController)),
);

router.post(
  "/verify-otp",
  asyncHandler(authController.verifyOtp.bind(authController)),
);

router.post(
  "/verify-reset-otp",
  asyncHandler(authController.verifyResetOtp.bind(authController)),
);

router.post(
  "/login",
  asyncHandler(authController.loginUser.bind(authController)),
);

router.post(
  "/refresh-token",
  asyncHandler(authController.refreshToken.bind(authController)),
);

router.post(
  "/forgot-password",
  asyncHandler(authController.forgotPassword.bind(authController)),
);

router.post(
  "/reset-password",
  asyncHandler(authController.resetPassword.bind(authController)),
);

router.post(
  "/logout",
  authenticate,
  asyncHandler(authController.logout.bind(authController)),
);

export default router;