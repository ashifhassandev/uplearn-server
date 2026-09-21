import { UploadFolder } from "../../domain/enums/upload-folder.enum";

type UploadLimitConfig = {
  maxSize: number;
  allowedTypes: string[]; // explicitly string[]
};

export const UPLOAD_LIMITS: Record<UploadFolder, UploadLimitConfig> = {
  [UploadFolder.PROFILE_IMAGES]: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  [UploadFolder.TUTOR_DOCUMENTS]: {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ["application/pdf", "image/jpeg", "image/png"],
  },
  [UploadFolder.COURSE_THUMBNAILS]: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  [UploadFolder.COURSE_VIDEOS]: {
    maxSize: 500 * 1024 * 1024,
    allowedTypes: ["video/mp4", "video/webm"],
  },
};