import type { UserRole } from "../../../domain/enums/user-role.enum";
import type { UserStatus } from "../../../domain/enums/user-status.enum";

export type TutorResponseDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  role: UserRole;
  status: UserStatus;
  isVerified: boolean;
  courseCount: number;
  rating: number | null;
  lastLogin: Date | null;
  createdAt: Date;
};

export type GetTutorsOutputDTO = {
  tutors: TutorResponseDTO[];
  total: number;
  page: number;
  totalPages: number;
};

export type TutorDetailsResponseDTO = {
  id: string;
  userId: string;

  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;

  status: UserStatus;
  isVerified: boolean;

  createdAt: Date;
  lastLogin: Date | null;

  headline: string | null;
  bio: string | null;

  skills: string[];

  experiences: {
    role: string;
    company: string;
    duration: string;
  }[];

  education: {
    degree: string;
    institution: string;
  }[];

  certificates: {
    key: string;
  }[];
};

export type GetTutorsInputDTO = {
  page: number;
  limit: number;
  search: string | null;
  status: string | null;
  verified: string | null;
};