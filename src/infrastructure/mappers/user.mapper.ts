import { User } from "../../domain/entities/user.entity";
import { UserRole } from "../../domain/enums/user-role.enum";
import { UserStatus } from "../../domain/enums/user-status.enum";
import { Email } from "../../domain/value-objects/email.value-object";
import { Password } from "../../domain/value-objects/password.value-object";
import { HttpStatus } from "../../shared/enums/http-status.enum";
import { AppError } from "../../shared/errors/app.error";

export interface UserDocument {
  _id: { toString(): string };
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
  role?: string | null;
  status?: string | null;
  profileImage?: string | null;
  lastLogin?: Date | null;
  createdAt?: Date | null;
}

export class UserMapper {
  static toDomain(doc: UserDocument): User {
    if (!doc.firstName || !doc.lastName || !doc.email || !doc.password) {
      throw new AppError(
        "Corrupted user record in database",
        HttpStatus.SERVER_ERROR,
      );
    }

    // Validate role
    const role = Object.values(UserRole).includes(doc.role as UserRole)
      ? (doc.role as UserRole)
      : UserRole.STUDENT;

    // Validate status
    const status = Object.values(UserStatus).includes(doc.status as UserStatus)
      ? (doc.status as UserStatus)
      : UserStatus.ACTIVE;

    return new User(
      doc._id.toString(),
      doc.firstName,
      doc.lastName,
      new Email(doc.email),
      Password.fromHashed(doc.password),
      role,
      status,
      doc.profileImage ?? null,
      doc.lastLogin ?? null,
      doc.createdAt ?? null,
    );
  }

  static toPersistence(user: User): Record<string, unknown> {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.getHashedPassword(),
      role: user.role,
      status: user.status,
      profileImage: user.profileImage,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    };
  }
}