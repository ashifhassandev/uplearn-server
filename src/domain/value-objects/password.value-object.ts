import type { IPasswordHasher } from "../ports/services/password-hasher.service.interface";

export class Password {
  private constructor(private readonly hashedValue: string) {}

  // For new registrations
  static async create(
    password: string,
    hasher: IPasswordHasher,
  ): Promise<Password> {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    
    const hashed = await hasher.hash(password);
    return new Password(hashed);
  }

  // For rehydrating from DB — skips re-hashing an already-hashed value
  static fromHashed(hash: string): Password {
    return new Password(hash);
  }

  getHashedValue(): string {
    return this.hashedValue;
  }
}