export interface IRefreshTokenRepository {
  save(userId: string, token: string): Promise<void>;
  findByUserId(userId: string): Promise<string | null>;
  deleteByUserId(userId: string): Promise<void>;
}