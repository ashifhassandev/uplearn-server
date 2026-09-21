import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { inject, injectable } from "tsyringe";

import { TOKENS } from "../../application/constants/injection-token.constants";
import type { IStorageService } from "../../application/ports/services/storage.service.interface";
import { ILogger } from "../../shared/logger/logger.interface";

@injectable()
export class S3StorageService implements IStorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(@inject(TOKENS.ILogger) private readonly logger: ILogger) {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_KEY;
    const bucket = process.env.AWS_BUCKET_NAME;

    if (!region) throw new Error("AWS_REGION is not defined");
    if (!accessKeyId) throw new Error("AWS_ACCESS_KEY is not defined");
    if (!secretAccessKey) throw new Error("AWS_SECRET_KEY is not defined");
    if (!bucket) throw new Error("AWS_BUCKET_NAME is not defined");

    this.client = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
    this.bucket = bucket;
  }

  async upload(file: Buffer, key: string, mimeType: string): Promise<string> {
    this.logger.info("Uploading file to S3", { key, mimeType });

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );

    return key;
  }

  async delete(key: string): Promise<void> {
    this.logger.info("Deleting file from S3", { key });

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    this.logger.debug("Generating signed URL", { key, expiresIn });

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }
}