import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
  LOG_REASONS,
} from "@/application/constants/logger.constants";
import { UPLOAD_LIMITS } from "@/application/constants/upload.constants";
import {
  UploadInputDTO,
  UploadOutputDTO,
} from "@/application/dto/storage/upload.dto";
import { IStorageService } from "@/application/ports/services/storage.service.interface";
import { IUploadFileUseCase } from "@/application/ports/use-cases/storage/upload-file.use-case.interface";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class UploadFileUseCase implements IUploadFileUseCase {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IStorageService)
    private readonly _storageService: IStorageService,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.STORAGE_USE_CASE);
  }

  async execute(input: UploadInputDTO): Promise<UploadOutputDTO> {
    this.log.attempt(LOG_ACTION.UPLOAD_FILE, {
      folder: input.folder,
      filename: input.filename,
      mimeType: input.mimeType,
      size: input.file.length,
    });

    if (input.file.length > UPLOAD_LIMITS[input.folder].maxSize) {
      this.log.failed(
        LOG_ACTION.UPLOAD_FILE,
        LOG_REASONS.VALIDATION.LIMIT_EXCEEDED,
        {
          folder: input.folder,
          filename: input.filename,
          size: input.file.length,
          maxSize: UPLOAD_LIMITS[input.folder].maxSize,
        },
      );
      throw new AppError("File too large", HttpStatus.BAD_REQUEST);
    }

    if (!UPLOAD_LIMITS[input.folder].allowedTypes.includes(input.mimeType)) {
      this.log.failed(
        LOG_ACTION.UPLOAD_FILE,
        LOG_REASONS.VALIDATION.LIMIT_EXCEEDED,
        {
          folder: input.folder,
          filename: input.filename,
          mimeType: input.mimeType,
          allowedTypes: UPLOAD_LIMITS[input.folder].allowedTypes,
        },
      );
      throw new AppError("File type not allowed", HttpStatus.BAD_REQUEST);
    }

    const key = `${input.folder}/${Date.now()}-${input.filename}`;

    const url = await this._storageService.upload(
      input.file,
      key,
      input.mimeType,
    );

    this.log.success(LOG_ACTION.UPLOAD_FILE, {
      folder: input.folder,
      filename: input.filename,
      key,
      url,
    });

    return { key, url };
  }
}