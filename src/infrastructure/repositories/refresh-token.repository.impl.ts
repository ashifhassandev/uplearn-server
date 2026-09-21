import { injectable } from "tsyringe";

import { IRefreshTokenRepository } from "../../application/ports/repositories/refresh-token.repository.interface";
import { RefreshTokenModel } from "../database/models/refresh-token.model";

@injectable()
export class RefreshTokenRepositoryImpl implements IRefreshTokenRepository {
  async save(userId: string, token: string): Promise<void> {
    // upsert
    await RefreshTokenModel.findOneAndUpdate(
      { userId },
      { token },
      { upsert: true, new: true },
    );
  }

  async findByUserId(userId: string): Promise<string | null> {
    const doc = await RefreshTokenModel.findOne({ userId });
    return doc ? doc.token : null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await RefreshTokenModel.deleteOne({ userId });
  }
}