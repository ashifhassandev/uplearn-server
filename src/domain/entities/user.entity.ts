import { UserRole } from "../enums/user-role.enum";
import { UserStatus } from "../enums/user-status.enum";
import type { IPasswordHasher } from "../ports/services/password-hasher.service.interface";
import type { Email } from "../value-objects/email.value-object";
import type { Password } from "../value-objects/password.value-object";

export class User {
  constructor(
    private readonly _id: string | null,
    private readonly _firstName: string,
    private readonly _lastName: string,
    private readonly _email: Email,
    private readonly _password: Password,
    private readonly _role: UserRole = UserRole.STUDENT,
    private readonly _status: UserStatus = UserStatus.ACTIVE,
    private readonly _profileImage: string | null = null,
    private readonly _lastLogin: Date | null = null,
    private readonly _createdAt: Date | null = null,
  ) {}

  get id(): string | null {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email.getValue();
  }

  get role(): UserRole {
    return this._role;
  }

  get status(): UserStatus {
    return this._status;
  }

  get profileImage(): string | null {
    return this._profileImage;
  }

  get lastLogin(): Date | null {
    return this._lastLogin;
  }

  get createdAt(): Date | null {
    return this._createdAt;
  }

  async verifyPassword(
    rawInput: string,
    hasher: IPasswordHasher,
  ): Promise<boolean> {
    return hasher.compare(rawInput, this._password.getHashedValue());
  }

  getHashedPassword(): string {
    return this._password.getHashedValue();
  }

  public updateProfileImage(newImage: string): User {
    return new User(
      this._id,
      this._firstName,
      this._lastName,
      this._email,
      this._password,
      this._role,
      this._status,
      newImage,
      this._lastLogin,
      this._createdAt
    );
  }
}