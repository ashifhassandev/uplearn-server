import { Router } from "express";
import { container } from "tsyringe";

import { GoogleAuthController } from "../controllers/google-auth.controller";

const router = Router();
const googleAuthController = container.resolve(GoogleAuthController);

router.get("/google", googleAuthController.initiateGoogleAuth);
router.get("/google/callback", googleAuthController.handleGoogleCallback);

export default router;