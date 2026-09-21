import type { ApplicationStatus } from "@/domain/enums/application-status.enum";

import type { UserRole } from "../../../domain/enums/user-role.enum";

export type LoginInputDTO = {
  email: string;
  password: string;
};

export type LoginOutputDTO = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    status: string;
    profileImage: string | null,
    applicationStatus: ApplicationStatus | null;
    rejectionReason: string | null;
  };
};