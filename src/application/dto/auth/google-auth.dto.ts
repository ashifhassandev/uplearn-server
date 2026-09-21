import type { ApplicationStatus } from "@/domain/enums/application-status.enum";

import type { UserRole } from "../../../domain/enums/user-role.enum";

export type GoogleAuthInputDTO = {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
};

export type GoogleAuthOutputDTO = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    profileImage: string | null;
    applicationStatus: ApplicationStatus | null;
    rejectionReason: string | null;
  };
};