import type { UserRole } from "../../../domain/enums/user-role.enum";
import type { UserStatus } from "../../../domain/enums/user-status.enum";

export type StudentResponseDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  role: UserRole;
  status: UserStatus;
  lastLogin: Date | null;
  createdAt: Date;
};

export type GetStudentInputDTO = {
  studentId: string;
};

export type GetStudentsOutputDTO = {
  students: StudentResponseDTO[];
  total: number;
  page: number;
  totalPages: number;
};

export type GetStudentsInputDTO = {
  page: number;
  limit: number;
  search: string | null;
  status: string | null;
};