import bcrypt from "bcrypt";
import { injectable } from "tsyringe";

import { IPasswordHasher } from "../../domain/ports/services/password-hasher.service.interface";

@injectable()
export class BcryptHasher implements IPasswordHasher {
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}