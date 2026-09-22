import { Router } from "express";
import { container } from "tsyringe";

import { AdminStudentController } from "../controllers/admin/admin-student.controller";
import { AdminTutorController } from "../controllers/admin/admin-tutor.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import {
  authenticate,
  authorizeRoles,
} from "../middlewares/authenticate.middleware";

const router = Router();
const adminStudentController = container.resolve(AdminStudentController);
const adminTutorController = container.resolve(AdminTutorController);

router.get(
  "/students",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(adminStudentController.getStudents.bind(adminStudentController)),
);
router.get(
  "/students/:id",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(adminStudentController.getStudent.bind(adminStudentController)),
);
router.patch(
  "/students/:id/suspend",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(
    adminStudentController.suspendStudent.bind(adminStudentController),
  ),
);
router.patch(
  "/students/:id/activate",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(
    adminStudentController.activateStudent.bind(adminStudentController),
  ),
);
router.delete(
  "/students/:id",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(
    adminStudentController.deleteStudent.bind(adminStudentController),
  ),
);

router.get(
  "/tutors",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(adminTutorController.getTutors.bind(adminTutorController)),
);
router.get(
  "/tutors/:id",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(adminTutorController.getTutorById.bind(adminTutorController)),
);
router.get(
  "/tutor/certificate-url",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(
    adminTutorController.getCertificateUrl.bind(adminTutorController),
  ),
);
router.patch(
  "/tutors/:id/suspend",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(adminTutorController.suspendTutor.bind(adminTutorController)),
);
router.patch(
  "/tutors/:id/activate",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(adminTutorController.activateTutor.bind(adminTutorController)),
);
router.patch(
  "/tutors/:id/delete",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(adminTutorController.deleteTutor.bind(adminTutorController)),
);

router.get(
  "/tutor-applications",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(
    adminTutorController.getTutorApplications.bind(adminTutorController),
  ),
);
router.get(
  "/tutor-applications/:id",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(
    adminTutorController.getTutorApplication.bind(adminTutorController),
  ),
);
router.patch(
  "/tutor-applications/:id/approve",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(adminTutorController.approveTutor.bind(adminTutorController)),
);
router.patch(
  "/tutor-applications/:id/reject",
  authenticate,
  authorizeRoles("admin"),
  asyncHandler(adminTutorController.rejectTutor.bind(adminTutorController)),
);

export default router;