import type { User } from "../../domain/entities/user.entity";

export interface UserResponseDTO {
  id: string | null;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export class UserResponseMapper {
  // Domain entity → HTTP response shape
  static toResponse(user: User): UserResponseDTO {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}