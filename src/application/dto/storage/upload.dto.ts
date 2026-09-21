import type { UploadFolder } from "../../../domain/enums/upload-folder.enum";

export type UploadInputDTO = {
  file: Buffer;
  filename: string;
  mimeType: string;
  folder: UploadFolder;
};

export type UploadOutputDTO = {
  key: string; // S3 key — store this in DB
  url: string; // public or signed URL
};