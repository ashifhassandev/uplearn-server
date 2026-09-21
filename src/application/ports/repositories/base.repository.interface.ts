export interface IBaseRepository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

export interface IUserOwnedRepository<TEntity> {
  findByUserId(userId: string): Promise<TEntity | null>;
  deleteByUserId(userId: string): Promise<void>;
}