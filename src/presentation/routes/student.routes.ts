import { Router } from "express";
import { container } from "tsyringe";

import { StudentController } from "../controllers/student.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();
const studentController = container.resolve(StudentController);

router.get(
  "/profile",
  authenticate,
  asyncHandler(studentController.getStudentProfile.bind(studentController)),
);

export default router;