import type { Request } from "express";
import type { FileFilterCallback } from "multer";
import multer from "multer";

import { UPLOAD_LIMITS } from "../../application/constants/upload.constants";
import { UploadFolder } from "../../domain/enums/upload-folder.enum";

const storage = multer.memoryStorage();

const fileFilter =
  (folder: UploadFolder) =>
  (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const allowedTypes = UPLOAD_LIMITS[folder].allowedTypes;
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
        ),
      );
    }
  };

export const uploadProfileImage = multer({
  storage,
  limits: { fileSize: UPLOAD_LIMITS[UploadFolder.PROFILE_IMAGES].maxSize },
  fileFilter: fileFilter(UploadFolder.PROFILE_IMAGES),
}).single("image");

export const uploadTutorDocument = multer({
  storage,
  limits: { fileSize: UPLOAD_LIMITS[UploadFolder.TUTOR_DOCUMENTS].maxSize },
  fileFilter: fileFilter(UploadFolder.TUTOR_DOCUMENTS),
}).single("document");

export const uploadCourseThumbnail = multer({
  storage,
  limits: { fileSize: UPLOAD_LIMITS[UploadFolder.COURSE_THUMBNAILS].maxSize },
  fileFilter: fileFilter(UploadFolder.COURSE_THUMBNAILS),
}).single("thumbnail");

export const uploadCourseVideo = multer({
  storage,
  limits: { fileSize: UPLOAD_LIMITS[UploadFolder.COURSE_VIDEOS].maxSize },
  fileFilter: fileFilter(UploadFolder.COURSE_VIDEOS),
}).single("video");