import { Router } from "express";
import { container } from "tsyringe";

import { TutorController } from "../controllers/tutor.controller";
import { UploadController } from "../controllers/upload.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { uploadTutorDocument } from "../middlewares/upload.middleware";

const router = Router();
const tutorController = container.resolve(TutorController);
const uploadController = container.resolve(UploadController);

router.post(
  "/upload/document",
  authenticate,
  uploadTutorDocument,
  asyncHandler(uploadController.uploadFile.bind(uploadController)),
);

router.post(
  "/apply",
  authenticate,
  asyncHandler(tutorController.applyForTutor.bind(tutorController)),
);

router.get(
  "/profile",
  authenticate,
  asyncHandler(tutorController.getTutorProfile.bind(tutorController)),
);

router.get(
  "/certificate-url",
  authenticate,
  asyncHandler(tutorController.getCertificateUrl.bind(tutorController)),
);

export default router;