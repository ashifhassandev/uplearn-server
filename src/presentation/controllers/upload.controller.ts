import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { TOKENS } from "@/application/constants/injection-token.constants";
import {
  LOG_ACTION,
  LOG_CONTEXT,
} from "@/application/constants/logger.constants";
import type { IUploadFileUseCase } from "@/application/ports/use-cases/storage/upload-file.use-case.interface";
import { UploadFolder } from "@/domain/enums/upload-folder.enum";
import { HttpStatus } from "@/shared/enums/http-status.enum";
import { AppError } from "@/shared/errors/app.error";
import { createLogger } from "@/shared/logger/create-logger";
import { ILogger } from "@/shared/logger/logger.interface";
import { ContextLogger } from "@/shared/logger/logger-context.type";

@injectable()
export class UploadController {
  private readonly log: ContextLogger;

  constructor(
    @inject(TOKENS.IUploadFileUseCase)
    private readonly _uploadFileUseCase: IUploadFileUseCase,

    @inject(TOKENS.ILogger)
    private readonly _logger: ILogger,
  ) {
    this.log = createLogger(this._logger, LOG_CONTEXT.STORAGE_CONTROLLER);
  }

  public async uploadFile(req: Request, res: Response): Promise<Response> {
    this.log.attempt(LOG_ACTION.UPLOAD_FILE, {
      folder: req.body.folder,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
    });

    if (!req.file) {
      this.log.failed(LOG_ACTION.UPLOAD_FILE, {
        code: "VAL_003",
        message: "No file provided",
      });
      throw new AppError("No file provided", HttpStatus.BAD_REQUEST);
    }

    const folder = req.body.folder as UploadFolder;
    if (!folder || !Object.values(UploadFolder).includes(folder)) {
      this.log.failed(LOG_ACTION.UPLOAD_FILE, {
        code: "VAL_003",
        message: "Invalid upload folder",
      });
      throw new AppError("Invalid upload folder", HttpStatus.BAD_REQUEST);
    }

    const result = await this._uploadFileUseCase.execute({
      file: req.file.buffer,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      folder,
    });

    this.log.success(LOG_ACTION.UPLOAD_FILE, {
      key: result.key,
      url: result.url,
    });

    return res.status(HttpStatus.OK).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        key: result.key,
        url: result.url,
      },
    });
  }
}